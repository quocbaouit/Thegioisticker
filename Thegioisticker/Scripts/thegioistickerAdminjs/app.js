var thegioistickerAdmin = angular.module('thegioistickerAdmin', ['ui.router', 'ui-notification', 'LocalStorageModule']);

thegioistickerAdmin.config(['$httpProvider', '$locationProvider', '$urlRouterProvider', '$stateProvider',
    function ($httpProvider, $locationProvider, $urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/dashboard');
        $stateProvider.state('admin', {
            url: '',
            abstract: true,
            template: '<ui-view/>',
        });
        $stateProvider.state('admin.dashboard', {
            url: '/dashboard',
            templateUrl: '/Scripts/thegioistickerAdminjs/dashboard/dashboard.html?v1',
            controller: 'dashboardController'
        });
       
        $stateProvider.state('admin.homepage', {
            url: '/homepage-manager',
            templateUrl: '/Scripts/thegioistickerAdminjs/homepage-manager/homepage.html?v1',
            controller: 'homepageController'
        });
        $stateProvider.state('admin.products', {
            url: '/products-manager',
            templateUrl: '/Scripts/thegioistickerAdminjs/products-manager/products.html?v1',
            controller: 'productsController'
        });
        $stateProvider.state('admin.order', {
            url: '/order-manager',
            templateUrl: '/Scripts/thegioistickerAdminjs/order-manager/order.html?v1',
            controller: 'orderController'
        });
       
        $stateProvider.state('admin.customer', {
            url: '/customer-manager',
            templateUrl: '/Scripts/thegioistickerAdminjs/customer-manager/customer.html?v1',
            controller: 'customerController'
        });
        $stateProvider.state('admin.faqs', {
            url: '/faqs-manager',
            templateUrl: '/Scripts/thegioistickerAdminjs/faqs-manager/faqs.html?v1',
            controller: 'faqsController',
            cache: false
        });
      
        $stateProvider.state('admin.blogs', {
            url: '/blogs-manager',
            templateUrl: '/Scripts/thegioistickerAdminjs/blogs-manager/blogs.html?v1',
            controller: 'blogsController'
        });
        $stateProvider.state('admin.info', {
            url: '/info-manager',
            templateUrl: '/Scripts/thegioistickerAdminjs/info-manager/info.html?v1',
            controller: 'infoController'
        });
        $stateProvider.state('admin.login', {
            url: '/login',
            templateUrl: '/Scripts/thegioistickerAdminjs/login/login.html?v1',
            controller: 'loginController'
        });
        $stateProvider.state('admin.register', {
            url: '/register',
            templateUrl: '/Scripts/thegioistickerAdminjs/register/register.html?v1',
            controller: 'registerController'
        });
        $stateProvider.state('admin.forgotpassword', {
            url: '/forgot-password',
            templateUrl: '/Scripts/thegioistickerAdminjs/forgot-password/forgot-password.html?v1',
            controller: 'forgotPasswordController'
        });
    }]);
var serviceBase = '';
if (window.location.port == '') {
    serviceBase = 'https://thegioistickerweb.azurewebsites.net/';
} else {
    serviceBase = 'https://localhost:44337/';
}
thegioistickerAdmin.constant('ngAuthSettings', {
	apiServiceBaseUri: serviceBase,
    clientId: 'thegioistickerApp'
});
thegioistickerAdmin.config(function ($httpProvider) {
	$httpProvider.interceptors.push('authInterceptorService');
});

thegioistickerAdmin.run(['$rootScope', 'authService', '$state', function ($rootScope, authService, $state) {
    authService.fillAuthData();
    $rootScope.authentication = authService.authentication;
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (!$rootScope.authentication.isAuth && toState.url != '/register' && toState.url != '/register-social' && toState.url != '/fogot-password')
        $state.go('admin.login')
    });

}]);
