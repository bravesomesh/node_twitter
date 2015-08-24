appControllers.controller('DemoCtrl', ['$scope', 'socket', function($scope, socket){
  $scope.title = "DemoCtrl";
  $scope.d3Data = [
    {name: "Greg", score:98},
    {name: "Ari", score:96},
    {name: "Loser", score: 48}
  ];
  $scope.d3OnClick = function(item){
    alert(item.name);
  };
  /*
    Dynamice Code for getting tweet
  */
  socket.emit('tweet-io:start', true);
  socket.on('tweet-io:tweets', function (data) {
      // $scope.tweets = $scope.tweets.concat(data);
      console.log(data);
  });
}]);
