'use strict';
thegioistickerApp.controller('blogController', ['$scope', '$timeout', 'blogService', 'localStorageService', 'Notification', function ($scope, $timeout, blogService, localStorageService, Notification) {
    $scope.blogs = [];
    $scope.recentProducts = [];
    $scope.numPerPage = 8;
    $scope.noOfPages = 1;
    $scope.currentPage = 1;
    $scope.setPage = function () {
        //showLoader();
        blogService.getblogs($scope.currentPage, $scope.numPerPage).then(function (results) {
            $scope.noOfPages = results.data.pager.totalPages;
            $scope.totalBlogs = results.data.pager.totalItems;
            $scope.blogs = results.data.items;
            $("html, body").animate({ scrollTop: 0 }, "slow");
            //hideLoader();
        }, function (error) {
            //alert(error.data.message);
        });
    };
    $scope.$watch('currentPage', $scope.setPage);

    if (localStorageService.get('recentProducts') != null) {
        var products = localStorageService.get('recentProducts').recentProducts;
        $scope.recentProducts = products;
    }
    $scope.viewDetailBlog = function (url) {
        window.location.href = '/thong-tin-chi-tiet/' + url + '';
    };
    $scope.viewDetail = function (Id) {
        window.location.href = '/chi-tiet-san-pham/' + Id + '';
    };
}]);