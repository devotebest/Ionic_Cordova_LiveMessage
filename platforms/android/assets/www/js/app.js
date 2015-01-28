var app = angular.module('textter', ['ionic','ionic.contrib.frostedGlass', 'textter.services', 'textter.controllers']);

app.config(function ($compileProvider) {
    // Needed for routing to work
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
});

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/profile");

    $stateProvider.state('messages', {
           url: "/messages",
           views: {
               'messages-tab': {
                   templateUrl: "templates/partials/Messages.html",
                   controller: 'FriendsTabCtrl'
               },
           }
       })
      .state('people', {
          url: "/people",
          views: {
              'people-tab': {
                  templateUrl: "templates/partials/People.html",
                  controller: 'API'
              },
          }
      })
     .state('account', {
         url: "/profile",
         views: {
             'profile-tab': {
                 templateUrl: "templates/partials/Account.html",
                 controller:'API'
             }
         }
     })
     .state('currentUserFriends', {
        url: "/:currentUsr/friends/:friendId/:friendName",
        views: {
            'messages-tab': {
                templateUrl: 'templates/friend.html',
                controller: 'LiveCtrl'
            }
        }
    })
	.state('requests', {
		url:"/requests",
		views: {
			'profile-tab': {
				templateUrl: 'templates/partials/Requests.html',
				controller: 'RequestCtrl'
			}
		}
    });
});

//Global functions needed in all views
app.run(function ($rootScope) {
    $rootScope.hideTabs = function () {
        document.getElementsByClassName("tabs")[0].style.display = "none";
    };

    $rootScope.showTabs = function () {
        document.getElementsByClassName("tabs")[0].style.display = "-webkit-box";
    };
});

app.directive('camera', function () {
   return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
         elm.on('click', function () {

            navigator.camera.getPicture(function (dataURL){
              
                    window.localStorage['userImage'] = "data:image/jpeg;base64,"+ dataURL;
                    scope.uploadImage(dataURL);

                }, function (err) {
               ctrl.$setValidity('error', false);
            }, { quality: 35, destinationType: Camera.DestinationType.DATA_URL, sourceType: Camera.PictureSourceType.PHOTOLIBRARY, allowEdit: true, encodingType: Camera.EncodingType.JPEG })
         });
      }
   };
});

// Extending the array options with a new method extend for merging 2 arrays together
Array.prototype.extend = function (otherArray) {
    /* you should include a test to check whether other_array really is an array */
    otherArray.forEach(function (v) { this.push(v); }, this);
};