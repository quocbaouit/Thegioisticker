'use strict';
thegioistickerAdmin.controller('profileController', ['$scope', '$timeout', 'Notification', '$state', '$location', 'authService', 'employeeService', '$window', function ($scope, $timeout, Notification, $state, $location, authService, employeeService, $window) {
    $scope.employee = {
        userName: $scope.authentication.userName,
        fullName:$scope.authentication.fullName,
        address: $scope.authentication.address,
        email: $scope.authentication.email,
        phoneNumber: $scope.authentication.phoneNumber
    }

    $scope.saveProfile = function () {
        employeeService.updateAccount($scope.employee).then(function (response) {
            Notification.success("Lưu thành công");
            $scope.authentication.fullName = $scope.employee.fullName;
            $scope.authentication.address = $scope.employee.address;
            $scope.authentication.email = $scope.employee.email;
            $scope.authentication.phoneNumber = $scope.employee.phoneNumber;
        },
            function (err) {
                $scope.waringMessage = "Vui lòng kiểm tra lại.";
            });
    };
}]);