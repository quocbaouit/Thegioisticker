'use strict';
thegioistickerApp.controller('companyController', ['$scope', '$timeout', 'productService', 'localStorageService', 'Notification', function ($scope, $timeout, productService, localStorageService, Notification) {
    $scope.company = [];
    hideLoader();
}]);