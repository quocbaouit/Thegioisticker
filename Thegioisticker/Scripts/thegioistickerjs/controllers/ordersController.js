'use strict';
thegioistickerApp.controller('ordersController', ['$scope', 'ordersService', function ($scope, ordersService) {

    $scope.orders = [];

    ordersService.getOrders().then(function (results) {

        $scope.orders = results.data;
        hideLoader();
    }, function (error) {
    });

}]);