var express = require('express');
var app = express();
var redis = require("redis");
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
var moment=require('moment');
var LocalStrategy   = require('passport-local').Strategy;
var server = require('http').Server(app);
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var db = mongoose.connection;

mongoose.connect('mongodb://localhost/Thirst_Keeper');

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
            newUser.local._id = new ObjectId();
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

        local        : {
        _id          : Schema.ObjectId,
        email        : String,
        password     : String,
        timeoffset    :{ type: String, default: moment().utcOffset()}

    }

});

var dataSchema = mongoose.Schema({
    _creator : { type: Schema.ObjectId, ref: 'User' },
    _id      : Schema.ObjectId,
    date     : String,
    value    : Number
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
var Data = mongoose.model('Data',dataSchema);

sessionStore = new redisStore({ host: 'localhost', port: 6379, client: client,ttl :  260});

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.set('view engine', 'ejs');

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
app.use(express.static('public'));
app.use(express.static('node_modules/progressbar.js/dist'));

app.get('/', function(req, res) {
      res.render('login.ejs'); // load the index.ejs file
});



app.get('/login', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('login.ejs', { message: req.flash('loginMessage') });
});
app.get('/home', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('home.ejs');
});
app.get('/signup', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', { message: req.flash('signupMessage') });
});

app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/today', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/today', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

app.get('/today', isLoggedIn, function(req, res) {
    var today = moment().utcOffset(req.user.local.timeoffset).format("YYYY-MM-DD");
    Data.findOne({ '_creator' :  req.user.local._id, 'date' : today }, function(err, data) {
        // if there are any errors, return the error before anything else
        if (err)
            return done(err);

        // if no data is found, return the message
        if (!data){
          var newData = new Data();

          // set the user's local credentials
          newData._creator = req.user.local._id;
          newData._id    = new ObjectId();
          newData.date  = today;
          newData.value = 0;

          // save the data
          newData.save(function(err) {
              if (err)
                  throw err;
              console.log("created new data");

          });
          res.render('today.ejs', {
              data : newData // get the user out of session and pass to template
          });
        }else{
          res.render('today.ejs', {
              data : data // get the user out of session and pass to template
          });
        }
    });
  });
  app.put('/api/drinkup', isLoggedIn , function(req, res) {
      var today = moment().utcOffset(req.user.local.timeoffset).format("YYYY-MM-DD");
      console.log(today);
      Data.findOneAndUpdate({ '_creator' :  req.user.local._id, 'date': today, 'value':{$lt : 8}},{$inc:{value:1}}, {new:true}, function(err, data) {
          // if there are any errors, return the error before anything else
          if (err)
              return done(err);

          // if no data is found, return the message
          if (!data){
            res.status(200).send("-.-");
          }else{
            console.log(data.value);
            res.json({value:data.value});

          }
      });
        // render the page and pass in any flash data if it exists

});


app.put('/api/synctime:offset', isLoggedIn , function(req, res) {

    var theoffset = req.params.offset;
    User.findOneAndUpdate({ 'local._id' :  req.user.local._id},{$set:{timeoffset:theoffset}}, {new: true}, function(err, data) {
        // if there are any errors, return the error before anything else
        if (err)
            return done(err);

        // if no data is found, return the message
        if (!data){
          res.status(400).send("Sorry can't find that!");
        }else{
          console.log(theoffset);
          res.status(200).send("thanks!");
        }
    });
      // render the page and pass in any flash data if it exists

});




app.get('/status', isLoggedIn ,function(req, res){

    var reData={};
    var myq;
    let today = moment().utcOffset(req.user.local.timeoffset).format("YYYY-MM-DD");
    for(let i = 0;i<7 ;i++){

      let nowDate  = moment(today).subtract(i,'days').format("YYYY-MM-DD");

      myq = Data.findOne({ '_creator' :  req.user.local._id, 'date': nowDate}, function(err, data) {
          // if there are any errors, return the error before anything else
          if (err)
              return done(err);

          // if no data is found, return the message
          if (!data){
            let theDate =moment(nowDate).format("MM-DD-YYYY");
            reData[i]= [theDate,7];
          }else{

            let theDate =moment(nowDate).format("MM-DD-YYYY");
            reData[i]= [theDate, data.value];
            //console.log(reData);
          }
      })

    }

    myq.then(function(){

        console.log(reData);
        res.render('status.ejs', {data:reData});

    });



});

app.get('/logout', function(req, res) {
  req.session.destroy(function(err){
         if(err){
             console.log(err);
         } else {
             res.redirect('/login');
         }
     });
});



function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}




server.listen(8000);
console.log('The magic happens on port 8000');
