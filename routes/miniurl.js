var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/', function(request, response){
  response.sendFile(path.resolve(__dirname + '/../views/description.html'));
});

module.exports = router;
