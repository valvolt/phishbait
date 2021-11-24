var express = require('express');
var app = express();

// Fetch port from Heroku
app.set('port', (process.env.PORT || 17995));

app.use(express.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  console.log(req.url);
  console.log(req.body);
  console.log(req.socket?.remoteAddress);
  console.log(req.get('User-Agent'));
  next();
});

app.use(express.static('public'))

app.use(function(req, res, next) {
  res.statusCode = 404;
  res.send('<b>Resource not found</b>');
});

var server = app.listen(app.get('port'), function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Panti listening at http://%s:%s", host, port)
})
