var Twit = require('twit');
var io = require('../index').io;

var TWEETS_BUFFER_SIZE = 3;
var SOCKETIO_TWEETS_EVENT = 'tweet-io:tweets';
var SOCKETIO_START_EVENT = 'tweet-io:start';
var SOCKETIO_STOP_EVENT = 'tweet-io:stop';
var nbOpenSockets = 0;
var isFirstConnectionToTwitter = true;

var T = new Twit({
    consumer_key:         'uq8JioRp9MO3gV2HOGdiRsQET',
    consumer_secret:      'CCqwyfHDWdkcxkur6gXeScoRJh2uL4n8wSf0lDbj5d7ldM5DL4',
    access_token:         '79397028-7gtGOwQqGysbRftiqbjaHmAL2fEofzmykvLBgcgwr',
    access_token_secret:  'pevQfSVOEQP8ZTi8Fn3uZKOQUirJZhhkvrqgfyzMJFWPi'
});

console.log("Listening for tweets from Mumbai...");
var stream = T.stream('statuses/filter',{ track: 'rain, pizza, water, contest' }, { locations: [72.775909,18.892868,72.986499,19.271634] });
var tweetsBuffer = [];
var oldTweetsBuffer = [];

io.sockets.on('connection', function(socket) {
	socket.on(SOCKETIO_START_EVENT, function(data) {
		handleClient(data, socket);
	});

	socket.on(SOCKETIO_STOP_EVENT, discardClient);

	socket.on('disconnect', discardClient);
});

stream.on('tweet', function(tweet) {
	if (tweet.place == null) {
		return ;
	}

	//Create message containing tweet + location + username + profile pic
	var msg = {};
	msg.text = tweet.text;
	msg.location = tweet.place.full_name;
	msg.user = {
		name: tweet.user.name, 
		image: tweet.user.profile_image_url
	};


	//push msg into buffer
	tweetsBuffer.push(msg);

	broadcastTweets();
});

//Handle Twitter events
stream.on('connect', function(request) {
	console.log('Connected to Twitter API');

	if (isFirstConnectionToTwitter) {
		isFirstConnectionToTwitter = false;
		// stream.stop();
	}
});

stream.on('disconnect', function(message) {
	console.log('Disconnected from Twitter API. Message: ' + message);
});

stream.on('reconnect', function (request, response, connectInterval) {
  	console.log('Trying to reconnect to Twitter API in ' + connectInterval + ' ms');
});



var broadcastTweets = function() {
	//send buffer only if full
	if (tweetsBuffer.length >= TWEETS_BUFFER_SIZE) {
		//broadcast tweets
		io.sockets.emit(SOCKETIO_TWEETS_EVENT, tweetsBuffer);
		
		oldTweetsBuffer = tweetsBuffer;
		tweetsBuffer = [];
	}
};
//Handle Socket.IO events
var discardClient = function() {
	console.log('Client disconnected !');
	nbOpenSockets--;

	if (nbOpenSockets <= 0) {
		nbOpenSockets = 0;
		console.log("No active client. Stop streaming from Twitter");
		stream.stop();
	}
};

var handleClient = function(data, socket) {
	if (data == true) {
		console.log('Client connected !');
		
		if (nbOpenSockets <= 0) {
			nbOpenSockets = 0;
			console.log('First active client. Start streaming from Twitter');
			stream.start();
		}

		nbOpenSockets++;

		//Send previous tweets buffer to the new client.
		if (oldTweetsBuffer != null && oldTweetsBuffer.length != 0) {
			socket.emit(SOCKETIO_TWEETS_EVENT, oldTweetsBuffer);
		}
	}
};