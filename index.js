var express = require("express");
var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);
exports.io = io;

console.log('Started on port ' + server.address().port);

app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express)
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));

app.get("/", function(req, res){
    //res.render("page");
    res.sendFile('page.html');
});

var twitter = require('./config/twitter');
// var logger = require('./config/logger');

// logger.debug("Overriding 'Express' logger");
// app.use(require('morgan'));