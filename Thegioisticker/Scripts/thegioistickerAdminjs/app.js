var thegioistickerAdmin = angular.module('thegioistickerAdmin', ['ui.router', 'ui-notification', 'LocalStorageModule']);

thegioistickerAdmin.config(['$httpProvider', '$locationProvider', '$urlRouterProvider', '$stateProvider',
    function ($httpProvider, $locationProvider, $urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/products-manager');
        $stateProvider.state('admin', {
            url: '',
            abstract: true,
            template: '<ui-view/>',
        });
        $stateProvider.state('admin.dashboard', {
            url: '/dashboard',
            templateUrl: '/Scripts/thegioistickerAdminjs/dashboard/dashboard.html?ver=2.1',
            controller: 'dashboardController'
        });
       
        $stateProvider.state('admin.homepage', {
            url: '/homepage-manager',
            templateUrl: '/Scripts/thegioistickerAdminjs/homepage-manager/homepage.html?ver=2.1',
            controller: 'homepageController'
        });
        $stateProvider.state('admin.products', {
            url: '/products-manager',
            templateUrl: '/Scripts/thegioistickerAdminjs/products-manager/products.html?ver=2.1',
            controller: 'productsController'
        });
        $stateProvider.state('admin.productdescription', {
            url: '/product-description/:productId',
            templateUrl: '/Scripts/thegioistickerAdminjs/products-manager/product-description.html?ver=2.1',
            controller: 'productDescriptionController'
        });
        $stateProvider.state('admin.selectsamples', {
            url: '/select-samples/:productId',
            templateUrl: '/Scripts/thegioistickerAdminjs/products-manager/select-samples.html?ver=2.1',
            controller: 'selectSamplesController'
        });
        $stateProvider.state('admin.samples', {
            url: '/samples-manager',
            templateUrl: '/Scripts/thegioistickerAdminjs/samples-manager/samples.html?ver=2.1',
            controller: 'samplesController'
        });
        $stateProvider.state('admin.shapes', {
            url: '/shapes-manager',
            templateUrl: '/Scripts/thegioistickerAdminjs/shapes-manager/shapes.html?ver=2.1',
            controller: 'shapesController'
        });
        $stateProvider.state('admin.costs', {
            url: '/costs-manager',
            templateUrl: '/Scripts/thegioistickerAdminjs/costs-manager/costs.html?ver=2.1',
            controller: 'costsController'
        });
        $stateProvider.state('admin.order', {
            url: '/order-manager',
            templateUrl: '/Scripts/thegioistickerAdminjs/order-manager/order.html?ver=2.1',
            controller: 'orderController'
        });
       
        $stateProvider.state('admin.customer', {
            url: '/customer-manager',
            templateUrl: '/Scripts/thegioistickerAdminjs/customer-manager/customer.html?ver=2.1',
            controller: 'customerController'
        });
        $stateProvider.state('admin.employee', {
            url: '/employee-manager',
            templateUrl: '/Scripts/thegioistickerAdminjs/employee-manager/employee.html?ver=2.1',
            controller: 'employeeController'
        });
        $stateProvider.state('admin.faqs', {
            url: '/faqs-manager',
            templateUrl: '/Scripts/thegioistickerAdminjs/faqs-manager/faqs.html?ver=2.1',
            controller: 'faqsController',
            cache: false
        });
        $stateProvider.state('admin.coupons', {
            url: '/coupons-manager',
            templateUrl: '/Scripts/thegioistickerAdminjs/coupons-manager/coupons.html?ver=2.1',
            controller: 'couponsController',
            cache: false
        });    
        $stateProvider.state('admin.blogs', {
            url: '/blogs-manager',
            templateUrl: '/Scripts/thegioistickerAdminjs/blogs-manager/blogs.html?ver=2.1',
            controller: 'blogsController'
        });
        $stateProvider.state('admin.profile', {
            url: '/profile-manager',
            templateUrl: '/Scripts/thegioistickerAdminjs/profile-manager/profile.html?ver=2.1',
            controller: 'profileController'
        });
        $stateProvider.state('admin.changepassword', {
            url: '/change-password',
            templateUrl: '/Scripts/thegioistickerAdminjs/profile-manager/change-password.html?ver=2.1',
            controller: 'changePasswordController'
        });
        $stateProvider.state('admin.blogedit', {
            url: '/blog-edit/:blogId',
            templateUrl: '/Scripts/thegioistickerAdminjs/blogs-manager/blog-edit.html?ver=2.1',
            controller: 'blogEditController'
        });
        $stateProvider.state('admin.info', {
            url: '/info-manager',
            templateUrl: '/Scripts/thegioistickerAdminjs/info-manager/info.html?ver=2.1',
            controller: 'infoController'
        });
        $stateProvider.state('admin.contentpages', {
            url: '/content-pages',
            templateUrl: '/Scripts/thegioistickerAdminjs/content-pages/content-pages.html?ver=2.1',
            controller: 'contentPagesController'
        });
        $stateProvider.state('admin.contentedit', {
            url: '/content-edit/:contentId',
            templateUrl: '/Scripts/thegioistickerAdminjs/content-pages/content-edit.html?ver=2.1',
            controller: 'contentEditController'
        });
        $stateProvider.state('admin.login', {
            url: '/login',
            templateUrl: '/Scripts/thegioistickerAdminjs/login/login.html?ver=2.1',
            controller: 'loginController'
        });
        $stateProvider.state('admin.register', {
            url: '/register',
            templateUrl: '/Scripts/thegioistickerAdminjs/register/register.html?ver=2.1',
            controller: 'registerController'
        });
        $stateProvider.state('admin.forgotpassword', {
            url: '/forgot-password',
            templateUrl: '/Scripts/thegioistickerAdminjs/forgot-password/forgot-password.html?ver=2.1',
            controller: 'forgotPasswordController'
        });
    }]);
var serviceBase = '';
if (window.location.port == '') {
    serviceBase = 'https://vinasticker.com/';
} else {
    serviceBase = 'https://localhost:44336/';
}
thegioistickerAdmin.constant('ngAuthSettings', {
	apiServiceBaseUri: serviceBase,
    clientId: 'thegioistickerApp'
});
thegioistickerAdmin.config(function ($httpProvider) {
	$httpProvider.interceptors.push('authInterceptorService');
});

thegioistickerAdmin.run(['$rootScope', 'authService', '$state', function ($rootScope, authService, $state) {
    showLoading();
    authService.fillAuthData();
    $rootScope.authentication = authService.authentication;
    if ($rootScope.authentication.isAuth&&($rootScope.authentication.role == undefined || $rootScope.authentication.role == '')) {
        window.location.href = "/";
    }
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (!$rootScope.authentication.isAuth && toState.url != '/register' && toState.url != '/register-social' && toState.url != '/fogot-password')
            $state.go('admin.login');
        if ($rootScope.authentication.role == 'business' && (toState.url != '/profile-manager' && toState.url != '/change-password')) {
            $state.go('admin.order');
        }
        if ($rootScope.authentication.role == 'contentWriter' && (toState.url != '/profile-manager' && toState.url != '/change-password')) {
            $state.go('admin.blogs');
        }
        setTimeout(function () {
            $('input.form-control, textarea.form-control').fuseMdInput();
        }, 1000);
        hideLoading();
    });

}]);
