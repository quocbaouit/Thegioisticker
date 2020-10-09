'use strict';
thegioistickerAdmin.controller('homepageController', ['$scope', '$timeout', '$state', 'productService', '$location', 'authService', function ($scope, $timeout, $state, productService, $location, authService) {
    $('body').delegate('.edit-item1', 'click', function (e) {
        e.preventDefault();
        $state.go('admin.products');
    });
    $('body').delegate('.edit-item2', 'click', function (e) {
        e.preventDefault();
        $state.go('admin.blogs');
    });
}]);