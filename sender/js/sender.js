var app = angular.module('hURL', []);
app.config(function($locationProvider) {
	$locationProvider.html5Mode(true).hashPrefix('!');
});

function SenderCtrl($scope, $location, $window) {

	var app_id = '21fade73-b41c-4ffb-a899-e3ede4d46a60_1',
		cast_api = null;

	$scope.activityId = null;
	$scope.receivers = [];
	$scope.showMediaControls = false;
	$scope.isPaused = true;
	$scope.url = $location.search().url;

	var initializeApi = function() {
		if (!cast_api) {
			cast_api = new cast.Api();
			cast_api.addReceiverListener(app_id, onReceiverList);
		}
	};

	var onReceiverList = function(list) {
		$scope.receivers = list;
		$scope.$apply();
	};

	var doLaunch = function(receiver) {
		var request = new cast.LaunchRequest(app_id, receiver);
		cast_api.launch(request, onLaunch);
	};

	var onLaunch = function(activity) {
		$scope.activityId = activity.status === 'running' ? activity.activityId : null;
		loadMedia();
	};

	var loadMedia = function() {
		var request = new cast.MediaLoadRequest($scope.url);
		cast_api.loadMedia($scope.activityId, request); //, callback?
		$scope.showMediaControls = true;
		$scope.togglePlay();
		$scope.$apply();
	};

	$scope.launch = function(i) {
		var receiver = $scope.receivers[i];
		doLaunch(receiver);
	};

	$scope.stopActivity = function() {
		$scope.showMediaControls = false;

		if ($scope.activityId) {
			cast_api.stopActivity($scope.activityId); //, callback?
			$scope.activityId = null;
		}
	};

	$scope.togglePlay = function() {
		if ($scope.isPaused) {
			cast_api.playMedia(
				$scope.activityId,
				new cast.MediaPlayRequest()); //, callback?

			$scope.isPaused = false;
		} else {
			cast_api.pauseMedia($scope.activityId); //, callback?

			$scope.isPaused = true;
		}
	};

	if ($window.cast !== undefined && cast.isAvailable) {
		initializeApi();
	} else {
		$window.addEventListener('message', function(event) {
			if (event.source === $window && event.data &&
					event.data.source === 'CastApi' &&
					event.data.event === 'Hello') {
				initializeApi();
			}
		});
	}

}
