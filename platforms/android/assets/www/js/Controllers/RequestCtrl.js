app.controller('RequestCtrl', function($scope, Friends){
	$scope.people = Friends.getAllFriendRequests(window.localStorage['userID']);
	
	$scope.acceptRequest = function(requestUserId){
		Friends.addFriend(requestUserId, window.localStorage['userID']);
		window.location.href = "#/messages";
	};
	
	$scope.declineRequest = function(requestUserId){
		Friends.denyFriend(requestUserId, window.localStorage['userID']);
		window.location.href = "#/messages";
	};
})