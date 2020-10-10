'use strict';
thegioistickerApp.controller('galleryController', ['$scope', '$timeout', 'productService', 'localStorageService', 'Notification', 'sampleService', function ($scope, $timeout, productService, localStorageService, Notification, sampleService) {
    $scope.products = [];
    $scope.numPerPage = 12;
    $scope.noOfPages = 1;
    $scope.currentPage = 1;
    $scope.categoryId = 0;    
    $scope.myselect = {};
    $scope.samples = [];
    sampleService.getAllSample().then(function (results) {
        debugger;
        $scope.samples = results.data;  
        $scope.products = $scope.samples;
        $scope.products = $scope.products.filter(x => x.shapeId == 3);
        hideLoader();
        
    }, function (error) {
        //alert(error.data.message);
    });
    $('body').delegate('.categories li', 'click', function (e)  {
        e.preventDefault();
        $('.categories li.active').removeClass('active');
        $(this).addClass('active');
    });
    $scope.setPage = function () {
        $scope.products = $scope.samples;
        $scope.noOfPages = 1;
        $scope.totalProduct = $scope.products.length;
        hideLoader();
       
    };
    $scope.$watch('currentPage', $scope.setPage);
    $scope.searchByCategory = function (categoryId) {
        $scope.products = $scope.samples;
        $scope.products = $scope.products.filter(x => x.shapeId == categoryId);
    }
    $scope.recentProducts = [];
    if (localStorageService.get('recentProducts') !== null) {
        var products = localStorageService.get('recentProducts').recentProducts;
        $scope.recentProducts = products;
    }
    $scope.viewDetail = function (Id) {
        window.location.href = '/chinh-sua-mau';
    };
}]);