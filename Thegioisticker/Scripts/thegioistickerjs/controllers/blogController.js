'use strict';
thegioistickerApp.controller('blogController', ['$scope', '$timeout', 'blogService', 'localStorageService', 'Notification', function ($scope, $timeout, blogService, localStorageService, Notification) {
    $scope.blogs = [];
    $scope.recentProducts = [];
    $scope.numPerPage = 10;
    $scope.noOfPages = 1;
    $scope.currentPage = 1;
    $scope.setPage = function () {
        blogService.getblogs($scope.currentPage, $scope.numPerPage).then(function (results) {
            $scope.noOfPages = results.data.pager.totalPages;
            $scope.totalBlogs = results.data.pager.totalItems;
            $scope.blogs = [];
            angular.forEach(results.data.items, function (value, key) {
                var blog = {
                    id: value.id,
                    title: value.title,
                    author: value.author,
                    image: value.image,
                    description:value.description,
                    dateCreated: value.dateCreated,
                }
                $scope.blogs.push(blog);
            });
            $("html, body").animate({ scrollTop: 0 }, "slow");
            hideLoader();
        }, function (error) {
            //alert(error.data.message);
        });
    };
    $scope.$watch('currentPage', $scope.setPage);

    if (localStorageService.get('recentProducts') != null) {
        var products = localStorageService.get('recentProducts').recentProducts;
        $scope.recentProducts = products;
    }
    $scope.viewDetailBlog = function (Id) {
        window.location.href = '/thong-tin-chi-tiet?Id=' + Id + '';
    };
    $scope.viewDetail = function (Id) {
        window.location.href = '/chi-tiet-san-pham?id=' + Id + '';
    };
}]);