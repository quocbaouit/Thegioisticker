'use strict';
thegioistickerApp.controller('galleryController', ['$scope', '$rootScope', '$timeout', 'productService', 'localStorageService', 'Notification', 'sampleService', '$compile', 'invoiceService', function ($scope, $rootScope, $timeout, productService, localStorageService, Notification, sampleService, $compile, invoiceService) {
    $scope.products = [];
    $scope.numPerPage = 8;
    $scope.noOfPages = 1;
    $scope.currentPage = 1;
    $scope.currentCategory = 1;
    $scope.categoryId = 0;
    $scope.samples = [];
    $scope.step = 1;
    $scope.product = {};
    $scope.shapes =
        [
            { id: 1, name: 'Hình Tròn', code: 'hinhtron', image: '/images/shapes/hinhtron.png' }
            , { id: 2, name: 'Hình Oval', code: 'hinhoval', image: '/images/shapes/hinhoval.png' }
            , { id: 3, name: 'Hình Vuông', code: 'hinhvuong', image: '/images/shapes/hinhvuong.png' }
            , { id: 4, name: 'Hình Vuông Bo Góc', code: 'hinhvuongbogoc', image: '/images/shapes/hinhvuongbogoc.png' }
            , { id: 5, name: 'Hình Chữ Nhật', code: 'hinhchunhat', image: '/images/shapes/hinhchunhat.png' }
            , { id: 6, name: 'Hình Chữ Nhật Bo Góc', code: 'hinhchunhatbogoc', image: '/images/shapes/hinhchunhatbogoc.png' }
            , { id: 7, name: 'Hình Hoa', code: 'hinhhoa', image: '/images/shapes/hinhhoa.png' }
            , { id: 8, name: 'Hình Nơ', code: 'hinhno', image: '/images/shapes/hinhno.png' }
            , { id: 9, name: 'Hình Lục Giác', code: 'hinhlucgiac', image: '/images/shapes/hinhlucgiac.png' }
            , { id: 10, name: 'Hình Trái Tim', code: 'hinhtraitim', image: '/images/shapes/hinhtraitim.png' }
            , { id: 11, name: 'Hình Mẫu 1', code: 'hinhmau1', image: '/images/shapes/hinhmau1.png' }
            , { id: 12, name: 'Hình Mẫu 2', code: 'hinhmau2', image: '/images/shapes/hinhmau2.png' }
            , { id: 13, name: 'Hình Mẫu 3', code: 'hinhmau3', image: '/images/shapes/hinhmau3.png' }
            , { id: 14, name: 'Hình Mẫu 4', code: 'hinhmau4', image: '/images/shapes/hinhmau4.png' }
            //, { id: 15, name: 'Hình Mẫu 5', code: 'hinhmau5', image: '/images/shapes/hinhmau5.png' }
            //, { id: 16, name: 'Hình Mẫu 6', code: 'hinhmau6', image: '/images/shapes/hinhmau6.png' }
        ]
    $('body').delegate('.categories li', 'click', function (e) {
        e.preventDefault();
        $('.categories li.active').removeClass('active');
        $(this).addClass('active');
    });
    $scope.setPage = function () {
        //showLoader();
        sampleService.getSamples($scope.currentPage, $scope.numPerPage, $scope.currentCategory).then(function (results) {
            $scope.noOfPages = results.data.pager.totalPages;
            $scope.totalProduct = results.data.pager.totalItems;
            $scope.products = results.data.items;
            $("html, body").animate({ scrollTop: 0 }, "slow");
            //hideLoader();
        }, function (error) {
        });

    };
    $scope.$watch('currentPage', $scope.setPage);
    $scope.searchByCategory = function (categoryId) {
        $scope.currentCategory = categoryId;
        $scope.numPerPage = 12;
        $scope.noOfPages = 1;
        $scope.currentPage = 1;
        $scope.setPage();
    }
    $scope.recentProducts = [];
    if (localStorageService.get('recentProducts') !== null) {
        var products = localStorageService.get('recentProducts').recentProducts;
        $scope.recentProducts = products;
    }

    $scope.viewDetail = function (Id) {
        window.location.href = '/chi-tiet-san-pham/' + Id;
    };
    $scope.selectSample = function (sample) {
        $rootScope.selectedSample = sample;
    };
}]);