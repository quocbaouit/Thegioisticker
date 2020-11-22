var thegioistickerApp = angular.module('thegioistickerApp', ['ui-notification', 'LocalStorageModule', 'ui.bootstrap.pagination']);

thegioistickerApp.config(['NotificationProvider',function (NotificationProvider) {
    //NotificationProvider.setOptions({
    //    //delay: 1000,
    //    //startTop: 20,
    //    //startRight: 10,
    //    //verticalSpacing: 20,
    //    //horizontalSpacing: 20,
    //    positionX: 'right',
    //    positionY: 'bottom'
    //});
}]);
var serviceBase = '';
if (window.location.port == '') {
    serviceBase = 'https://thegioisticker.com/';
} else {
    serviceBase = 'https://localhost:44337/';
}
thegioistickerApp.constant('ngAuthSettings', {
	apiServiceBaseUri: serviceBase,
    clientId: 'sieuvietApp'
});
thegioistickerApp.config(function ($httpProvider) {
	$httpProvider.interceptors.push('authInterceptorService');
});

thegioistickerApp.run(['$rootScope', 'authService', function ($rootScope,authService) {
	authService.fillAuthData();
}]);
//sieuvietApp.run(['$rootScope', '$interval', '$timeout', 'Notification', function ($rootScope, $interval, $timeout, Notification) {
//}]);