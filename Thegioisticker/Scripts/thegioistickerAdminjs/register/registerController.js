'use strict';
thegioistickerAdmin.controller('registerController', ['$scope', '$timeout', '$location', 'authService', '$state', function ($scope, $timeout, $location, authService, $state) {
    $timeout(function () {
        $('input.form-control, textarea.form-control').fuseMdInput();
    }, 1000);
    $scope.loginData = {
        userName: "",
        password: "",
        useRefreshTokens: false
    };
    $scope.waringMessage = '';
    $scope.message = "";
    $scope.savedSuccessfully = false;
    $scope.message = "";

    $scope.registration = {
        fullName: "",
        userName: "",
        password: "",
        confirmPassword: ""
    };
    $scope.signUp = function () {
        if ($scope.registration.fullName == '') {
            $scope.waringMessage = "Họ và tên không được trống";
            return;
        }
        if ($scope.registration.userName == '') {
            $scope.waringMessage = "Tên đăng nhập không được trống";
            return;
        }
        if ($scope.registration.password == '') {
            $scope.waringMessage = "Password không được trống";
            return;
        }
        if ($scope.registration.password != $scope.registration.confirmPassword) {
            $scope.waringMessage = "Password và confirm password không giống nhau";
            return;
        }
        authService.saveRegistration($scope.registration).then(function (response) {
            $scope.waringMessage = "Tạo tài khoản thành công. Vui lòng đăng nhập";
            $timeout(function () {
                $state.go('admin.login');
            }, 1000);
        },
			function (response) {
			    var errors = [];
			    for (var key in response.data.modelState) {
			        for (var i = 0; i < response.data.modelState[key].length; i++) {
			            errors.push(response.data.modelState[key][i]);
			        }
			    }
			    $scope.waringMessage = "Đã có lỗi xảy ra:" + errors.join(' ');
			});
    };
    $scope.loginPage = function () {
        $state.go('admin.login');
    };
}]);