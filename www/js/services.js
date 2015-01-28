angular.module('textter.services', [])
/*
 *  Oh, I get High With a Little Help From My Friends
 */
.factory('Friends', ['$http', 'theCache', function ($http, theCache) {
    //for dev
    //var hostUrl = "http://192.168.1.111:8080/api/";
    //for production
    var hostUrl = 'https://textter-11175.onmodulus.net/api/';
	
	var sendFriendRequest = function(friendId, userId) {
		
		var urlString = hostUrl + userId + '/friendRequest/' + friendId;
		$http({ withCredentials: true, method: 'POST', url: urlString }).
		success(function (data, status, headers, config) {
			console.log('friend request send');
		}).
		error(function (data, status, headers, config) {
			console.log('friend request failed');
		});
	};
	
	var getAllFriendRequests = function(userId) {
		
        var requestsList = [];
		
		var urlString = hostUrl + 'allFriendRequests/' + userId;
		$http({ withCredentials: true, method: 'GET', url: urlString, cache: theCache }).
		success(function(data, status, header, config){
			console.log(data);
			angular.copy(data, requestsList);
		}).
		error(function (data, status, headers, config) {
			console.log('error');
		});
		
		return requestsList;
	}
	
    var addNewFriend = function (friendId, userId) {
        var urlString = hostUrl + userId + '/addFriend/' + friendId;
        $http({ withCredentials: true,  method: 'POST', url: urlString }).
        success(function (data, status, headers, config) {
            console.log('friend added');
        }).
        error(function (data, status, headers, config) {
            console.log('wtf bro');
        });
    };

	var denyFriend = function (friendId, userId) {
		var urlString = hostUrl + userId + '/denyFriend/' + friendId;
        $http({ withCredentials: true,  method: 'POST', url: urlString }).
        success(function (data, status, headers, config) {
            console.log('friend denied');
        }).
        error(function (data, status, headers, config) {
            console.log('error: ' + data);
        });
	};

    var getHistoryAsync = function (friendId, usr, skip, take) {
        var urlString = hostUrl + usr + '/hist/' + friendId + '/skip/' + skip + '/take/' + take;
        // $http returns a promise, which has a then function, which also returns a promise
        var promise = $http({ withCredentials: true,  method: 'GET', url: urlString })
            .then(function (response) {
                // The then function here is an opportunity to modify the response
                console.log(response);
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
        // Return the promise to the controller
        return promise;
    };

    var saveUserImage = function (userId, image) {
        var urlString = hostUrl + 'SaveUserImage/';
        $http({ withCredentials: true,  method: 'POST', url: urlString, data: { userId: userId, userImage: image } }).
            success(function (data, status, headers, config) {
                console.log('success ' + data);
            }).
            error(function (data, status, headers, config) {
                console.log('wtf bro');
            });
    };

    var getFriendList = function (userId) {
        var urlString =hostUrl + 'user/' + userId;
        var myList = [];
        
        $http({ withCredentials: true,  method: 'GET', url: urlString, cache : theCache }).
        success(function (data, status, headers, config) {
            angular.copy(data, myList);
        }).
        error(function (data, status, headers, config) {
            console.log(data);
        });
        
        return myList;
        myList = [];
    };

    var ppl = function (userId, pageNumber, itemsPerPage) {
        var urlString = hostUrl+'people';
        if (userId != 'null')
            urlString = hostUrl+ 'people/' + userId + "/" + pageNumber + "/" + itemsPerPage;

        var promise = $http({ withCredentials: true,  method: 'GET', url: urlString, cache: theCache }).
        success(function (data, status, headers, config) {
            return data;
        }).
        error(function (data, status, headers, config) {
            console.log(data);
        });
        return promise;
    };

    var setStatus = function (userId,status) {
        var apiURL = hostUrl + 'setstatus/' + userId + '/' + status;

        var promise = $http({ withCredentials: true, method: 'POST', url: apiURL })
            .then(function (response) {
                return response.data;
            });
        // Return the promise to the controller
        return promise;
    };
    
    var signupUser = function (signupCode, username, phone, email, password) {
        var apiURL = hostUrl + 'signup?signupCode=' + signupCode + '&username='
      + username + '&phone='
      + phone + '&email='
      + email + '&password='
      + password;

        // Return the promise to the controller
        return $http({ withCredentials: true, method: 'POST', url: apiURL });
    };
    
    var loginUser = function (username, password) {
        var apiURL = hostUrl+'connect?username='
        + username + '&password='
        + password;

        // Return the promise to the controller
        return $http({ withCredentials: true, method: 'POST', url: apiURL });
    };
		
	var logoutUser = function(userID){
		var apiURL = hostUrl + 'logout/' + userID;
		
		// Return the promise to the controller
		return $http({withCredentials: true, method: 'POST', url: apiURL});
	};

    var searchUsers = function(userID, searchTerm, pageNumber, itemsPerPage){
        var urlString = hostUrl+'people';
        if (userID != 'null')
            urlString = hostUrl+ 'people/' + userID + '/' + searchTerm  + "/" + pageNumber + "/" + itemsPerPage;

        var promise = $http({ withCredentials: true,  method: 'GET', url: urlString, cache: theCache }).
            success(function (data, status, headers, config) {
                return data;
            }).
            error(function (data, status, headers, config) {
                console.log(data);
            });

        return promise;
    };
    
    return {
        all: function (userId) {
            return getFriendList(userId);
        },
        getPeeps: function (userId, pageNumber, itemsPerPage) {
            return ppl(userId, pageNumber, itemsPerPage);
        },
		getAllFriendRequests: function (userId) {
			return getAllFriendRequests(userId);
		},
		sendFriendRequest: function (friend, user) {
			return sendFriendRequest(friend, user);
		},
        addFriend: function (friend, user) {
            return addNewFriend(friend, user);
        },
		denyFriend: function (friend, user) {
			return denyFriend(friend, user);
		},
        getHist: function (friendId, userId, skip, take) {
            return getHistoryAsync(friendId, userId, skip, take);
        },
        getFriends: function (userId) {
            getFriendList(userId);
        },
        saveUserImage: function (userId, img) {
            saveUserImage(userId, img);
        },
        setStatus: function(userId,status) {
           return setStatus(userId, status);
        },
        signupUser: function(signupCode, username, phone, email, password) {
            return signupUser(signupCode, username, phone, email, password);
        },
        loginUser: function(username, password) {
            return loginUser(username, password);
        },
		logoutUser: function(userID){
			return logoutUser(userID);
		},
        searchUsers: function(userID, searchTerm, pageNumber, itemsPerPage){
            return searchUsers(userID, searchTerm, pageNumber, itemsPerPage);
        }
    };
}])

.factory('theCache', function($cacheFactory) {
 return $cacheFactory('myData');
});