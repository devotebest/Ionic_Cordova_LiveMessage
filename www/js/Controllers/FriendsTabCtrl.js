// A simple controller that fetches a list of data
app.controller('FriendsTabCtrl', function ($scope, socket, $location, $rootScope, Friends, theCache) {
    
    $scope.user = window.localStorage['userID'];
    $scope.friends = Friends.all($scope.user);
    $scope.newMessage = '';
    $rootScope.inChat = false;
    
    socket.on('liveIn', function (data) {
        $scope.newMessage = '';
        $scope.from = data.from;
        $scope.liveIn = data.msg;
        $rootScope.liveChatPass = data.msg;
        //$ionicScrollDelegate.scrollTop(true);
    });

    socket.on('zero', function (data) {
        $scope.liveIn = '';
        $scope.newMessage = '';
    });

    socket.on('new', function(data) {
        $scope.liveIn = '';
        for (var i = 0; i < $scope.friends.length; i++) {
            if ($scope.friends[i].id == data.from ) {
               var newtime = new Date();
               $scope.friends[i].time = 'Now';
        $scope.newMessage = data.msg;
               theCache.removeAll();
               $scope.$apply;
            }
        }
        //$ionicScrollDelegate.scrollTop(true);
    });
});
