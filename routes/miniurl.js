require('dotenv').config();
var express = require('express');
var mongodb = require('mongodb');
var assert = require('assert');
var path = require('path');
var router = express.Router();
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://' + process.env.MCREDS + '@ds229835.mlab.com:29835/miniurldb';

function createMiniUrl(db, newUrl, callback){
  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);
  if(newUrl.match(regex)){
    var urls = db.collection('urls');
    var short = urls.count();
    short.then((result) => {
      var object = {"original": newUrl, "short": "" + (result + 1)};
      urls.insert(object, function(err, data){
        if(err){
          console.log("Unable to add URL. Error: ", err);
        }
        callback();
      });
    });
  } else {
    console.log("Invalid URL: " + newUrl);
  }
}

router.get('/', function(request, response){
  response.sendFile(path.resolve(__dirname + '/../views/description.html'));
});

router.get('/new/:newUrl', function(request, response){
  MongoClient.connect(url, function(err, db){
    assert.equal(null, err);
    createMiniUrl(db, request.params.newUrl, function(){
      db.close();
    });
  });
  response.sendFile(path.resolve(__dirname + '/../views/description.html'));
});

module.exports = router;
