'use strict';
thegioistickerApp.controller('productDetailController', ['$scope', '$timeout', 'productService', 'localStorageService', 'Notification', 'invoiceService', 'sampleService', '$compile', function ($scope, $timeout, productService, localStorageService, Notification, invoiceService, sampleService, $compile) {
    var url = new URL(location.href);
    var searchParams = new URLSearchParams(url.search);
    var url = location.pathname.split('chi-tiet-san-pham/')[1];
    $scope.samples = [];
    $scope.products = [];
    $scope.productsId = [];
    productService.getProductBySeoUrl(url).then(function (results) {
        $scope.product = results.data;
        //$scope.shoppingCart.material = $scope.product;
        $scope.productsId = results.data.productSample;
        initSample();
        //hideLoader();
    }, function (error) {
        //alert(error.data.message);
    });
    function initImage() {
        var images = $('.image_list li');
        var selected = $('.image_selected img');

        images.each(function () {
            var image = $(this);
            image.on('click', function () {
                debugger;
                var imagePath = new String(image.data('image'));
                selected.attr('src', imagePath);
            });
        });
    }
    function initSample() {
        productService.getSampleByProductBySeoUrl(url).then(function (results) {
            $scope.products = results.data;
            setTimeout(function () {
                initImage();
            }, 500);
         
            //hideLoader();
        }, function (error) {
            //alert(error.data.message);
        });
    }
    $scope.viewDetail = function (Id) {
        window.location.href = '/chi-tiet-san-pham/' + Id + '';
    };
}]);