angular.module('textter.controllers', ['pubnub-sockets'])

.config(function (socketProvider) {
	var config = function (userID) {
		var pubnub_setup = {
        	channel       : userID,
        	publish_key   : 'pub-c-8a373ff1-3058-442a-89f2-ea9928e4817b',
        	subscribe_key : 'sub-c-8b7abbce-a328-11e3-8bcb-02ee2ddab7fe',
            ssl           :  true
    	};

    	var mySocket = io.connect( 'wss://pubsub.pubnub.com', pubnub_setup );
    	socketProvider.ioSocket(mySocket);
    }
    if (window.localStorage['userID']) {
    	var theID = window.localStorage['userID'].toString();
    	config(theID);
    }	
    
});