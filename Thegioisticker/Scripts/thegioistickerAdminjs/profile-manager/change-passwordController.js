'use strict';
thegioistickerAdmin.controller('changePasswordController', ['$scope', '$timeout', 'Notification', '$state', '$location', 'authService', 'employeeService', '$window', function ($scope, $timeout, Notification, $state, $location, authService, employeeService, $window) {
    $scope.changePassWord =
    {
        userId: $scope.authentication.id,
        curentPassWord: '',
        newPassword: '',
        confirmNewPassword: ''
    }
    $scope.savePassword = function () {
        if ($scope.changePassWord.curentPassWord == '') {
            Notification.error("Vui lòng nhập mật khẩu hiện tại");
            return;
        }
        if ($scope.changePassWord.newPassword == '') {
            Notification.error("Vui lòng nhập mật khẩu mới");
            return;
        }
        if ($scope.changePassWord.newPassword != $scope.changePassWord.confirmNewPassword) {
            Notification.error("Password và confirm password không giống nhau");
            return;
        }
        $scope.changePassWord.userId = $scope.authentication.id;
        authService.saveChangePassword($scope.changePassWord).then(function (response) {
            $scope.savedSuccessfully = true;
            Notification.success("Đổi mật khẩu thành công");
            $scope.changePassWord.curentPassWord = '';
            $scope.changePassWord.newPassword = '';
            $scope.changePassWord.confirmNewPassword = '';
            $timeout(function () {              
                authService.logOut();
                $state.go('admin.login')
            }, 1000);
            //startTimer();
        },
            function (response) {
                var errors = [];
                for (var key in response.data.modelState) {
                    for (var i = 0; i < response.data.modelState[key].length; i++) {
                        errors.push(response.data.modelState[key][i]);
                    }
                }
                Notification.error("Đã có lỗi xảy ra:" + errors.join(' '));
            });
    };
}]);