var express = require('express');
var app = express();
var redis = require("redis");
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var morgan = require('morgan');
var passport =require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var client  = redis.createClient();
var flash = require('connect-flash');
var LocalStrategy   = require('passport-local').Strategy;
var server = require('http').Server(app);
var io = require('socket.io')(server);
var passportSocketIo = require('passport.socketio');


mongoose.connect('mongodb://localhost/user_auth');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});



passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, email, password, done) {

    // asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(function() {

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({ 'local.email' :  email }, function(err, user) {
        // if there are any errors, return the error
        if (err)
            return done(err);

        // check to see if theres already a user with that email
        if (user) {
            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {

            // if there is no user with that email
            // create the user
            var newUser            = new User();

            // set the user's local credentials
            newUser.local.email    = email;
            newUser.local.password = newUser.generateHash(password);

            // save the user
            newUser.save(function(err) {
                if (err)
                    throw err;
                return done(null, newUser);
            });
        }

    });

    });

}));


passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

}));


var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
    }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


var User = mongoose.model('User',userSchema);

sessionStore = new redisStore({ host: 'localhost', port: 6379, client: client,ttl :  260});

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.set('view engine','ejs');

app.use(session({
    secret: 'ssshhhhh',
    // create new redis store.
    store: sessionStore,
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.get('/', function(req, res) {
      res.render('index.ejs'); // load the index.ejs file
});

app.get('/login', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('login.ejs', { message: req.flash('loginMessage') });
});

app.get('/signup', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', { message: req.flash('signupMessage') });
});

app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
        user : req.user // get the user out of session and pass to template
    });
});
app.get('/logout', function(req, res) {
  req.session.destroy(function(err){
         if(err){
             console.log(err);
         } else {
             res.redirect('/');
         }
     });
});



function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}



server.listen(8000);

io.use(passportSocketIo.authorize({
    passport:     passport,
    cookieParser: cookieParser,
    key:          'connect.sid',
    secret:       'ssshhhhh',
    store:        sessionStore,
    success:      onAuthorizeSuccess,
    fail:         onAuthorizeFail
}));

function onAuthorizeSuccess(data, accept){
  console.log('successful connection to socket.io');
  accept();
}

function onAuthorizeFail(data, message, error, accept){
  console.log('failed connection to socket.io:');
  if(error)
    accept(new Error(message));
}

io.sockets.on('connection', function(socket) {
    var date = new Date();
    var time = date.getHours() + ":" + date.getMinutes();
    socket.emit('message', {username: 'Server', message: 'welcome to the chat'});
    socket.on('send', function(data) {
        io.sockets.emit('message', data);
    });
});







app.listen(port);
console.log('The magic happens on port ' + port);
