'use strict';
thegioistickerAdmin.controller('loginController', ['$scope','$rootScope', '$timeout', '$location', 'authService', '$state', 'ngAuthSettings', function ($scope, $rootScope, $timeout, $location, authService, $state, ngAuthSettings) {
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
    $scope.login = function () {
        authService.login($scope.loginData).then(function (response) {
            $scope.loginData.password = '';
            $scope.loginData.userName = '';
            $scope.message = "Bạn đã đăng nhập thành công";
            $state.go('admin.products');
        },
			function (err) {
			    $scope.waringMessage = "Vui lòng kiểm tra lại email và password";
			});
    };
    $scope.registerPage = function () {
        $state.go('admin.register');
    };
    $scope.authExternalProvider = function (provider) {

        var redirectUri = location.protocol + '//' + location.host + '/authcomplete.html';

        var externalProviderUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/ExternalLogin?provider=" + provider
                                                                    + "&response_type=token&client_id=" + ngAuthSettings.clientId
                                                                    + "&redirect_uri=" + redirectUri;
        window.$windowScope = $scope;

        var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
    };

    $scope.makeExtenalUserName = function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 50; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    $scope.registerExternal = function () {
        if ($scope.registerData.fullName == '') {
            $scope.shakeModal("Tên hiển thị không được trống");
            return;
        }
        $scope.registerData.userName = $scope.makeExtenalUserName();
        authService.registerExternal($scope.registerData).then(function (response) {
            $scope.isCreateExtenal = false;
            $state.go('admin.dashboard');
           // $('#loginModal').modal('hide');
           // Notification.primary('Bạn đã đăng nhập thành công');
        },
          function (response) {
              var errors = [];
              for (var key in response.modelState) {
                  errors.push(response.modelState[key]);
              }
              $scope.message = "Failed to register user due to:" + errors.join(' ');
          });
    };
    $scope.authCompletedCB = function (fragment) {
        $scope.$apply(function () {
            if (fragment.haslocalaccount == 'False') {

                authService.logOut();

                authService.externalAuthData = {
                    provider: fragment.provider,
                    userName: fragment.external_user_name,
                    externalAccessToken: fragment.external_access_token
                };
                //$scope.openRegisterModal();
                $scope.message = "Liên kết thành công.";
                $scope.isCreateExtenal = true;
                $scope.registerData = {
                    fullName: authService.externalAuthData.userName,
                    userName: authService.externalAuthData.userName,
                    provider: authService.externalAuthData.provider,
                    externalAccessToken: authService.externalAuthData.externalAccessToken
                };
            }
            else {
                //Obtain access token and redirect to orders
                var externalData = { provider: fragment.provider, externalAccessToken: fragment.external_access_token };
                authService.obtainAccessToken(externalData).then(function (response) {
                    $scope.message = "Bạn đã đăng nhập thành công";
                    $state.go('admin.dashboard');             
                },
             function (err) {
                 $scope.message = err.error_description;
             });
            }

        });
    }
}]);