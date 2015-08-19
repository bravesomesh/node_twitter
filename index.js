var express = require("express");
var Twit = require('twit');
var app = express();
var port = 3700;
var T = new Twit({
    consumer_key:         'uq8JioRp9MO3gV2HOGdiRsQET'
  , consumer_secret:      'CCqwyfHDWdkcxkur6gXeScoRJh2uL4n8wSf0lDbj5d7ldM5DL4'
  , access_token:         '79397028-cF3MViGhI55FrmAKamnThr8duPAsMWvFViJsLQdUY'
  , access_token_secret:  '9Bp8j6Bra7aaa1c8x8mz8Tqh1p2UxZSBD969z05xDktVx'
});

 
app.set('views', __dirname + '/views');
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'ejs');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express)

app.get("/", function(req, res){
    res.render("page");
});
 

app.use(express.static(__dirname + '/public'));
// app.listen(port);
var io = require('socket.io').listen(app.listen(port));

//
//  filter the twitter public stream by the word 'mango'.
//
var mumbai = ['72.78','18.90','73.05','19.44'];
var stream = T.stream('statuses/filter', { track: 'pizza', language: 'en',locations: mumbai });

stream.on('tweet', function (tweet) {
  console.log(tweet);
});

io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'welcome to the chat' });
    
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});

console.log("Listening on port " + port);








