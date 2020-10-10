thegioistickerAdmin.controller("RootController", ['$window', 'localStorageService', 'Notification', 'authService', '$rootScope', '$scope', '$location', '$timeout', '$state',
    function (
		$window,
        localStorageService,
		Notification,
		authService,
        $rootScope,
        $scope,
        $location,
		$timeout,
        $state) {
        //localStorageService.set('shoppingCart', { products: listProducts });
       // var authData = localStorageService.get('authorizationData');
        //localStorageService.remove('authorizationData');
		$scope.logOut = function () {
			authService.logOut();
			$state.go('admin.login')
		}	
    }]);