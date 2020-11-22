'use strict';
thegioistickerApp.controller('loginController', ['$scope', '$timeout', 'Notification', '$location', 'authService', 'ngAuthSettings', function ($scope, $timeout, Notification, $location, authService, ngAuthSettings) {
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
		email:"",
		password: "",
		confirmPassword: ""
	};

	$scope.forgot = {
		email: "",
	};
	
	$scope.signUp = function () {
	    if ($scope.registration.fullName == '') {
	        $scope.shakeModal("Vui lòng nhập họ và tên");
	        return;
		}
		//if ($scope.registration.email == '') {
		//	$scope.shakeModal("Vui lòng nhập email");
		//	return;
		//}
		if ($scope.registration.password == '') {
			$scope.shakeModal("Vui lòng nhập mật khẩu");
			return;
		}
		if ($scope.registration.password != $scope.registration.confirmPassword) {
		    $scope.shakeModal("Password và confirm password không giống nhau");
			return;
		}
		authService.saveRegistration($scope.registration).then(function (response) {
			$scope.savedSuccessfully = true;			
			//$scope.openLoginModal();
			$timeout(function () {
				Notification.success("Tạo tài khoản thành công");
				$scope.loginData = {
					userName: $scope.registration.userName,
					password: $scope.registration.password,
					useRefreshTokens: false
				};
				$scope.login();
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
				$scope.shakeModal("Đã có lỗi xảy ra:" + errors.join(' '));
			});
	};
    $scope.login = function () {

        authService.login($scope.loginData).then(function (response) {
            $scope.loginData.password = '';
            $scope.loginData.userName = '';
			$('#loginModal').modal('hide');
			Notification.primary('Bạn đã đăng nhập thành công');
			location.reload();
        },
			function (err) {
			    $scope.shakeModal("Vui lòng kiểm tra lại userName và password");
         });
	};
	$scope.forgotPass = function () {
		if ($scope.forgot.email == '') {
			$scope.shakeModal("Vui lòng nhập email");
			return;
		}
		authService.requestPasswordReset($scope.forgot).then(function (response) {
			$scope.forgot.email == '';
			Notification.primary('Đã gởi reset link tới email của bạn.');
			$('#loginModal').modal('hide');
		},
			function (err) {
				$scope.shakeModal("Vui lòng kiểm tra lại email");
			});
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
	        $('#loginModal').modal('hide');
			Notification.primary('Bạn đã đăng nhập thành công');
			location.reload();
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
                $scope.openRegisterModal();
             
                $scope.shakeModal("Liên kết thành công.");
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
					$('#loginModal').modal('hide');
					location.reload();
					Notification.primary('Bạn đã đăng nhập thành công');

                },
             function (err) {
                 $scope.message = err.error_description;
             });
            }

        });
	}
	
}]);
