app.controller('API', function ($scope, $timeout, $rootScope, $http, $location, Friends, $state, $ionicScrollDelegate, theCache) {

    $scope.pageNumber = 1;
    $scope.itemsPerPage = 10;
    $scope.noMoreItemsAvailable = false;
    $scope.searching = false;
    $scope.searchTerm = "";

    $scope.loadingIn = false;
    $scope.showUser = true;
    $scope.statusInput = false;
    $scope.userId = window.localStorage['userID'];    
    $scope.currentUserName = window.localStorage['userName'];
    $scope.currentUserTitle = window.localStorage['status'];
    $scope.loggedIn = window.localStorage['isLogged'];
    $scope.defaultName = 'Textter';
    $scope.EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    $scope.userAvatar;

    //$scope.people = Friends.getPeeps($scope.userId, $scope.pageNumber, $scope.itemsPerPage);
    Friends.getPeeps($scope.userId, $scope.pageNumber, $scope.itemsPerPage).success(function(asyncData){
       if(asyncData.length < 10)
       {
           $scope.noMoreItemsAvailable = true;
       }
       $scope.people = asyncData;
    });

    $ionicScrollDelegate.scrollTop(true);
    $scope.userImage = (window.localStorage['userImage'])?window.localStorage['userImage']:"https://d2lrssvd8no86h.cloudfront.net/" + $scope.userId + ".jpg";
    
    //for dev
    //var hostUrl = "http://192.168.1.111:8080/api/"
    //for production
    var hostUrl = 'https://textter-11175.onmodulus.net/api/';
    
    $scope.reLoginUser = function () {
        //if (window.localStorage['userName'] && window.localStorage['userName'] !== "null") {
        if (window.localStorage['isLogged'] === "true") {
            Friends.loginUser(window.localStorage['userName'], window.localStorage['password']).then(function (data) {
                window.localStorage['password'] = $scope.login.password;
                $scope.login = {};
                window.localStorage['userID'] = data.data;
                $rootScope.userId = data.data;
                $scope.newAccount = false;
                $scope.oldAccount = false;
                $scope.loggedIn = true;
                window.localStorage['isLogged'] = true;
                window.PushNotification.setAlias(window.localStorage['userID'], function () {
                    console.log('urban'); //location.reload();
                });
                location.reload();
            }, function (error) {
                console.log(error.status + ":" + error.data);
                $scope.userId = 'none';
                $scope.loadingIn = false;
                $scope.signupErr = true;
                window.localStorage['userName'] = null;
                $scope.errorMessage = error.data;
            });
        }
    };
    $scope.reLoginUser();
    
    $scope.uploadImage = function (dataURL) {
        window.localStorage['userImage'] = "data:image/jpeg;base64,"+ dataURL;
        Friends.saveUserImage($scope.userId, dataURL);
    };
    
    $scope.shareTextter = function () {
            var message = {
                text: "Hey! " + $scope.currentUserName  + " is using Textter, the Live Messaging System (think lms > sms). Try it out!",
                url: "http://textter.com/",
                activityTypes: ["PostToFacebook", "PostToTwitter", "Mail", "Message", "AirDrop"]
            };
            if ($scope.userId){
                window.socialmessage.send(message);
            };
    };  

    $scope.goToTop = function() {
        $ionicScrollDelegate.resize();
        $timeout(function () {
            $ionicScrollDelegate.scrollTop(true);
        }, 1);
    }; 

    $scope.showLogin = function () {
        $scope.newAccount = false;
        $scope.oldAccount = true;
        $scope.goToTop();
    };

    $scope.showSignup = function () {
        $scope.newAccount = true;
        $scope.loggedIn = false;
        $scope.goToTop();
    };

    $scope.updatePrivacy = function () {
        window.localStorage['private'] = $scope.privateUser;
        console.log( $scope.privateUser);
    };

    $scope.signupUserForm = function(user) {
        if ($scope.signupForm.$valid) {
            $scope.signupUser(user);
        } else {
            $scope.errorMessage = $scope.formatAlertMesseage($scope.signupForm.$error.required);
        };
    };

    $scope.setStatus = function (statusMessage) {
        $scope.goToTop();
        if (statusMessage != null) {
            Friends.setStatus(window.localStorage['userID'], statusMessage).then(function (data) {
                window.localStorage['status'] = statusMessage;
            }, function(error) {
                console.log(data);
                $scope.loading = false;
                $scope.userId = null;
                $scope.signupErr = true;
                $scope.errorMessage = data;
            });
        }
    };

    $scope.toggleStatus = function () {
        if ($scope.statusInput) {
            $scope.statusInput = false;
        }
        else{
            $scope.statusInput = true;
        };    
    };
    
    $scope.signupUser = function (user) {
        $scope.loadingIn = true;
        $scope.signup = {};
        $scope.signup = angular.copy(user);
        console.log($scope.signup);

        Friends.signupUser($scope.signup.signupCode, $scope.signup.username, $scope.signup.phone, $scope.signup.email, $scope.signup.password).then(function (data) {
            window.localStorage['userName'] = $scope.signup.username;
            window.localStorage['password'] = $scope.signup.password;
            window.localStorage['userID'] = data.data;
            $scope.newAccount = false;
            $scope.oldAccount = false;
            $scope.loggedIn = true;
            window.localStorage['hasLogged'] = true;
            window.localStorage['isLogged'] = true;
            try{
                window.PushNotification.setAlias(window.localStorage['userID'], function () {});
            } catch(e) {
                console.log(e);
            }
            $scope.loadingIn = false;
            location.reload();
            $scope.signup = {};
        }, function (error) {
            console.log(error.status+":"+ error.data);
            $scope.loadingIn = false;
            $scope.userId = null;
            $scope.signupErr = true;
            $scope.errorMessage = error.data;
        });
    };

    $scope.loginUserForm = function(user) {
        if ($scope.loginForm.$valid) {
            $scope.loginUser(user);
        } else {
            $scope.errorMessage = $scope.formatAlertMesseage($scope.loginForm.$error.required);
        }
    };
    
    $scope.loginUser = function (user) {
        $scope.loadingIn = true;
        $scope.login = {};
        $scope.login = angular.copy(user);
        console.log($scope.login);
        window.localStorage['userName'] = $scope.login.username;

        Friends.loginUser($scope.login.username, $scope.login.password).then(function (data) {
            window.localStorage['password'] = $scope.login.password;
            $scope.login = {};
            window.localStorage['userID'] = data.data;
            $rootScope.userId = data.data;
            $scope.newAccount = false;
            $scope.oldAccount = false;
            $scope.loggedIn = true;
            window.localStorage['isLogged'] = true;
            try {
                window.PushNotification.setAlias(window.localStorage['userID'], function() {
                    console.log('urban');
                    window.PushNotification.registerForNotificationTypes(PushNotification.notificationType.badge|
                        PushNotification.notificationType.sound|
                        PushNotification.notificationType.alert);
                });
            } catch(e) {
                console.log(e);
            }
            location.reload();
        }, function (error) {
            console.log(error.status + ":" + error.data);
            $scope.userId = 'none';
            $scope.loadingIn = false;
            $scope.signupErr = true;
            window.localStorage['userName'] = null;
            $scope.errorMessage = error.data;
        });
    };

    $scope.logoutUser = function () {
        
        Friends.logoutUser(window.localStorage['userID']).then(
            function(data){
                $scope.oldAccount = true;
                $scope.loggedIn = false;
                window.localStorage['userID'] = null;
                window.localStorage['userImage'] = null;
                window.localStorage['userName'] = 'textter';
                window.localStorage['isLogged'] = false;
                $scope.goToTop();
            },
            function(error){
                console.log('not logged out');
            }
        );
    };

    $scope.addNew = function (data) {
        Friends.addFriend(data, window.localStorage['userID']);
        theCache.removeAll();
    };
    
    $scope.friendRequest = function (data) {
        Friends.sendFriendRequest(data, window.localStorage['userID']);
        // why?
        // theCache.removeAll();
    }

    $scope.searchUsers = function (searchTerm) {
        $scope.noMoreItemsAvailable = false;
        $scope.searching = true;
        $scope.searchTerm = searchTerm;
        $scope.pageNumber = 1;
        Friends.searchUsers($scope.userId, $scope.searchTerm, $scope.pageNumber, $scope.itemsPerPage).success(function(asyncData){
            if(asyncData.length < 10)
            {
                $scope.noMoreItemsAvailable = true;
            }
            $scope.people = asyncData;
        });
    }
    
    $scope.formatAlertMesseage = function (errors) {
        var messeage = 'This fields are required:\n';
        angular.forEach(errors, function (value, key) {
            messeage = messeage + value.$name + ",";
            value.$dirty = true;
        });
        return messeage;
    };

    $scope.loadMore = function () {
        $scope.pageNumber++;

        if($scope.searching)
        {
            // call search url
            Friends.searchUsers($scope.userId, $scope.searchTerm, $scope.pageNumber, $scope.itemsPerPage).success(function(asyncData){
                if(asyncData.length > 0)
                {
                    for (var i = 0; i < asyncData.length; i++)
                    {
                        $scope.people.push(asyncData[i]);
                    }
                }
                else
                {
                    $scope.noMoreItemsAvailable = true;
                }

                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }
        else
        {
            Friends.getPeeps($scope.userId, $scope.pageNumber, $scope.itemsPerPage).success(function(asyncData){

                if(asyncData.length > 0)
                {
                    for (var i = 0; i < asyncData.length; i++)
                    {
                        $scope.people.push(asyncData[i]);
                    }
                }
                else
                {
                    $scope.noMoreItemsAvailable = true;
                }

                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }
    }
});


