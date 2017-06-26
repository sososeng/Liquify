var mongoose = require('mongoose');
//var flash = require('connect-flash');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
mongoose.connect('mongodb://localhost/Thirst_Keeper');
var db = mongoose.connection;



var moment = require('moment');
var now = moment();
console.log(now);

var then = moment("030000pm","hhmmssa");

console.log(now.isAfter(then));


// var offset = moment().utcOffset();
// console.log(offset);
//
// var testoffset = moment().utcOffset("+07:00");
// console.log(testoffset);

/*
var userSchema = mongoose.Schema({

        local        : {
        _id          : Schema.ObjectId,
        email        : String,
        password     : String,

    }

});

var dataSchema = mongoose.Schema({
    _creator : { type: Schema.ObjectId, ref: 'User' },
    _id      : Schema.ObjectId,
    date     : String,
    value    : Number
});

var User = mongoose.model('User',userSchema);
var Data = mongoose.model('Data',dataSchema);


db.close();

for(let i = 0; i<10;i++){
      var newData = new Data();
      newData._creator = ObjectId("594abe1d3b41fd10ea2f1b73");
      newData._id    = new ObjectId();
      newData.date  = moment().subtract(1,'days').format("YYYY-MM-DD");
      newData.value = Math.floor((Math.random() * 8) + 1);

      // save the data
      newData.save(function(err) {
          if (err)
              throw err;
          console.log("created new data");
          db.close();

      });
}*/
