'use strict';
thegioistickerApp.controller('homeController', ['$scope', 'blogService', '$timeout', 'productService', 'localStorageService', 'Notification', 'sampleService', '$compile', 'invoiceService', function ($scope, blogService, $timeout, productService, localStorageService, Notification, sampleService, $compile, invoiceService) {
    $scope.activeHome = true;
    $scope.products = [];
    $scope.regularProducts = [];
    $scope.product = {};
    $scope.productCategories = [];
    productService.getProductsRegular().then(function (results) {
        $scope.regularProducts = results.data;
    }, function (error) {
    });
    blogService.getBlogForHomePage().then(function (results) {
        $scope.blogs = results.data;
    }, function (error) {
    });
    productService.getProductCategory().then(function (results) {
        $scope.productCategories = results.data;
    }, function (error) {
    });
    $scope.viewDetail = function (seoUrl) {
        window.location.href = '/chi-tiet-san-pham/' + seoUrl + '';
    };
    $scope.viewDetailBlog = function (Id) {
        window.location.href = '/thong-tin-chi-tiet?Id=' + Id + '';
    }
    $scope.newLetterText = '';
    $scope.newLetter = function () {
        if ($scope.newLetterText == '') {
            Notification.error('Vui lòng nhập email.');
            return false;

        }
        Notification.success('Đã Đăng ký thành công.');
    }
}]);