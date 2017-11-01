var express = require('express');
var miniurl = require('./routes/miniurl.js');
var app = express();

app.use(express.static('public'));
app.use('/miniurl', miniurl);

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/description.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
