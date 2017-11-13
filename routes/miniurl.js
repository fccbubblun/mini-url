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

function redirectUrl(db, response, shortUrl, callback){
  var urls = db.collection('urls');
  var doc = urls.findOne({"short": shortUrl});
  doc.then((result) => {
    if(result == null){
      callback();
      response.sendFile(path.resolve(__dirname + '/../views/description.html'));
    } else {
      var u = result.original;
      console.log(result);
      callback();
      if(u.substring(0, 4) == "http"){
        response.redirect(301, u);
      } else {
        response.redirect(301, "https://" + u);
      }
    }
  });
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

router.get('/:shortUrl', function(request, response){
  MongoClient.connect(url, function(err, db){
    assert.equal(null, err);
    redirectUrl(db, response, request.params.shortUrl, function(){
      db.close();
    });
  });
});

module.exports = router;
