app.controller('LiveCtrl', function ($scope, $rootScope, $stateParams, socket, Friends, $timeout, $ionicFrostedDelegate, $ionicScrollDelegate, theCache) {
    $scope.friend = $stateParams.friendId;    
    $scope.title = $stateParams.friendName;
    $scope.user = $stateParams.currentUsr;
    $scope.userName = window.localStorage['userName'];
    $scope.typing = false;
    $scope.chatInput = '';
    $scope.liveIn = '';
    $scope.skip = 0;
    $scope.take = 10;
    $rootScope.inChat = true;
    $scope.phoneVersion = window.localStorage.getItem("version");
    $scope.focus = false;

    // Call the async method and then do stuff with what is returned inside our own then function
    Friends.getHist($stateParams.friendId, $scope.user, $scope.skip, $scope.take).then(function (data) {
        $scope.hist = data;
        $scope.hist.sort(function (a, b) {
            var dateA = new Date(a.date),
                dateB = new Date(b.date);
            return dateA - dateB; //sort by date ascending
        });

        $scope.skip = $scope.skip+10;
        $ionicScrollDelegate.scrollBottom(true);//call it once when the page loads
        $scope.doBlur();
    });

    socket.on('liveIn', function (data) {
        if ($rootScope.inChat){
            if (data.from === $stateParams.friendId){
                $scope.liveIn = data.msg;
                $scope.goToBottom();
        };
        if ((data.msg.length % 21) === (0 || 1)){
            $scope.goToBottom();
        };
    }
    });

    socket.on('new', function (data) {
        $scope.hist.push(data);
        if ($rootScope.inChat){
        $scope.liveIn = '';
        $scope.goToBottom();
        };    
    });

    socket.on('zero', function (data) {
        $scope.liveIn = '';
        $ionicScrollDelegate.resize();
    });

    $scope.refreshChat = function(skip,take) {
        // Load content
        if (skip != -1) {
            Friends.getHist($stateParams.friendId, $scope.user, skip, take).then(function(data) {
                if (data.length > 0) {
                    $scope.hist.extend(data);

                    $scope.hist.sort(function(a, b) {
                        var dateA = new Date(a.date),
                            dateB = new Date(b.date);
                        return dateA - dateB; //sort by date ascending
                    });

                    $scope.skip = $scope.skip + 10;

                } else {
                    $scope.skip = -1; // set it to negative so we don't call server any more
                }
                // Trigger refresh complete on the pull to refresh action
                $scope.$broadcast('scroll.refreshComplete');
            });
        } else {
            // Trigger refresh complete on the pull to refresh action
            $scope.$broadcast('scroll.refreshComplete');
        }
       
    };
    
    //Helper function that sets the css on the chat messages 
    $scope.getClass = function (from) {
        if (from === $scope.friend)
            return 'to';
        else 
            return 'from';
    };

    $scope.doBlur = function () {
        console.log("did bluh");
        //if($scope.phoneVersion >= 7.1) {
               
               $(".noPad").css('bottom', '0px');
               $(".scroll-content").css('bottom', '50px');
        //}
        window.localStorage.setItem("focus", false);
        $scope.focus = false;
       
        //the second 0 marks the Y scroll pos. Setting this to i.e. 100 will push the screen up by 100px.
    };

    $scope.goToBottom = function () {        
        $ionicScrollDelegate.resize();
        
        $timeout(function () {
            $ionicScrollDelegate.scrollBottom(true);
        }, 1);
    };

    $scope.focusBottom = function () {
        $scope.focus = true;
        $scope.goToBottom();
        window.scrollTo(0, 0);
        //if($scope.phoneVersion >= 7.1) {
               console.log("focusBottom");
               $(".scroll-content").css('bottom', '325px');
               $(".noPad").css('bottom', '275px');      
        //}
    };

    $scope.clearChat = function () {
        socket.send({ zero: true, to: $stateParams.friendId, from: $scope.user });
        $scope.chatInput = '';        
    }

    $scope.sendChat = function () {
        var oneMessage = { msg: $scope.chatInput, to: $stateParams.friendId, from: $scope.user, fromName: $scope.userName};
        socket.send(oneMessage);
        $scope.hist.push(oneMessage);
        $scope.chatInput = '';
        $scope.liveIn = '';
        $scope.focusBottom();
        $scope.goToBottom();
        theCache.removeAll();
    };

    $scope.liveChat = function () {
        if ($scope.chatInput.length == 0) {
            socket.send({ zero: true, to: $stateParams.friendId, from: $scope.user });
        }
        else {
            socket.send({ lvMsg: $scope.chatInput, to: $stateParams.friendId, from: $scope.user });
        }
    };

    $scope.save = function () {
        Friends.putHist($scope.chatInput, $stateParams.friendId);
    };

});