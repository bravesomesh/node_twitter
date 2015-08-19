appControllers.controller('TweetCtrl', ['$scope', 'socket',
	function TweetCtrl ($scope, socket) {
		
		$scope.tweets = [];
		$scope.btnIsDisabled = false;
		$scope.btnText = "Find Tweets From San Francisco"

		$scope.findTweets = function findTweets() {

			socket.emit('tweet-io:start', true);

			$scope.btnText = "Brace Yourself, Tweets are coming...";
			$scope.btnIsDisabled = true;

			socket.on('tweet-io:tweets', function (data) {
			    $scope.tweets = $scope.tweets.concat(data);
			});			
		}
	}
]);
