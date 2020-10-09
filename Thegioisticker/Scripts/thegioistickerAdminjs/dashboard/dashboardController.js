'use strict';
thegioistickerAdmin.controller('dashboardController', ['$scope', '$state', '$location', 'authService', function ($scope, $state, $location, authService) {
    $scope.selectType = function () {
        $state.go('admin.selecttype');
    };
    $scope.selectArea = function () {
        $state.go('admin.selectarea', { treeId: 0 });
    };
}]);