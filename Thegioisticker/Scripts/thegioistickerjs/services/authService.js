'use strict';
thegioistickerApp.factory('authService', ['$http', '$q', 'localStorageService', 'ngAuthSettings', function ($http, $q, localStorageService, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        id:"",
        fullName: "",
        address: "",
        email: "",
        phoneNumber: "",
        userName: "",
        useRefreshTokens: false,
        isAdmin: false
    };

    var _externalAuthData = {
        provider: "",
        userName: "",
        externalAccessToken: ""
    };

    var _saveRegistration = function (registration) {

        _logOut();

        return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
            return response;
        });

    }; 
    var _saveChangePassword = function (changePassword) {
        return $http.post(serviceBase + 'api/account/changePassword', changePassword).then(function (response) {
            return response;
        });
    };
    var _resetPassword= function (resetNewPassword) {
        return $http.post(serviceBase + 'api/account/resetPassword', resetNewPassword).then(function (response) {
            return response;
        });
    };
    var _requestPasswordReset = function (resetPassword) {
        return $http.post(serviceBase + 'api/account/requestPasswordReset', resetPassword).then(function (response) {
            return response;
        });
    };

    var _login = function (loginData) {

        var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

        if (loginData.useRefreshTokens) {
            data = data + "&client_id=" + ngAuthSettings.clientId;
        }

        var deferred = $q.defer();

        $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
            var isAdmin = response.isAdmin;
            if (loginData.useRefreshTokens) {               
                localStorageService.set('authorizationData', {
                    token: response.access_token,
                    userName: loginData.userName,
                    id: response.id,
                    fullName: response.fullName,
                    address: response.address,
                    email: response.email,
                    phoneNumber: response.phoneNumber,
                    refreshToken: response.refresh_token,
                    useRefreshTokens: true,
                    isAdmin: isAdmin
                });
            }
            else {
                localStorageService.set('authorizationData',
                    {
                        token: response.access_token,
                        userName: loginData.userName,
                        id: response.id,
                        fullName: response.fullName,
                        address: response.address,
                        email: response.email,
                        phoneNumber: response.phoneNumber,
                        refreshToken: "",
                        useRefreshTokens: false,
                        isAdmin: isAdmin
                    });
            }
            _authentication.isAuth = true;
            _authentication.isAdmin = isAdmin;
            _authentication.fullName = response.fullName;
            _authentication.id = response.id;
            _authentication.address = response.address;
            _authentication.email = response.email;
            _authentication.phoneNumber = response.phoneNumber;
            _authentication.userName = loginData.userName;
            _authentication.useRefreshTokens = loginData.useRefreshTokens;

            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };

	var _logOut = function () {
		//return $http.post(serviceBase + 'api/account/logout').then(function (response) {
			localStorageService.remove('authorizationData');
			_authentication.isAuth = false;
			_authentication.userName = "";
			_authentication.fullName = "";
			_authentication.address = "";
			_authentication.email = "";
			_authentication.phoneNumber = "";
			_authentication.useRefreshTokens = false;
			_authentication.isAdmin = false;
			//return response;
		//});    
    };

    var _fillAuthData = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.fullName = authData.fullName;
            _authentication.id = authData.id;
            _authentication.address = authData.address;
            _authentication.email = authData.email;
            _authentication.phoneNumber = authData.phoneNumber;
            _authentication.userName = authData.userName;
            _authentication.useRefreshTokens = authData.useRefreshTokens;
            _authentication.isAdmin = authData.isAdmin;
        }

    };

    var _refreshToken = function () {
        var deferred = $q.defer();

        var authData = localStorageService.get('authorizationData');

        if (authData) {

            if (authData.useRefreshTokens) {

                var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + ngAuthSettings.clientId;

                localStorageService.remove('authorizationData');

                $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                    localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, fullName: response.fullName, refreshToken: response.refresh_token, useRefreshTokens: true });

                    deferred.resolve(response);

                }).error(function (err, status) {
                    _logOut();
                    deferred.reject(err);
                });
            }
        }

        return deferred.promise;
    };

    var _obtainAccessToken = function (externalData) {

        var deferred = $q.defer();

        $http.get(serviceBase + 'api/account/ObtainLocalAccessToken', { params: { provider: externalData.provider, externalAccessToken: externalData.externalAccessToken } }).success(function (response) {
            var isAdmin = response.isAdmin;
            localStorageService.set('authorizationData', {
                token: response.access_token,
                id:response.id,
                userName: response.userName,
                fullName: response.fullName,
                address: response.address,
                email: response.email,
                phoneNumber: response.phoneNumber,
                refreshToken: "",
                useRefreshTokens: false,
                isAdmin: isAdmin
            });

            _authentication.isAuth = true;
            _authentication.id = response.id;
            _authentication.fullName = response.fullName;
            _authentication.userName = response.userName;
            _authentication.address = response.address;
            _authentication.email = response.email;
            _authentication.phoneNumber = response.phoneNumber;
            _authentication.useRefreshTokens = false;
            _authentication.isAdmin = isAdmin;

            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };

    var _registerExternal = function (registerExternalData) {

        var deferred = $q.defer();

        $http.post(serviceBase + 'api/account/registerexternal', registerExternalData).success(function (response) {
            var isAdmin = response.isAdmin;
            localStorageService.set('authorizationData', {
                token: response.access_token,
                id: response.id,
                userName: response.userName,
                fullName: response.fullName,
                address: response.address,
                email: response.email,
                phoneNumber: response.phoneNumber,
                refreshToken: "",
                useRefreshTokens: false,
                isAdmin:isAdmin
            });
            _authentication.isAuth = true;
            _authentication.id = response.id;
            _authentication.userName = response.userName;
            _authentication.fullName = response.fullName;
            _authentication.address = response.address;
            _authentication.email = response.email;
            _authentication.phoneNumber = response.phoneNumber;
            _authentication.useRefreshTokens = false;
            _authentication.isAdmin = isAdmin;

            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    }; 

    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.saveChangePassword = _saveChangePassword; 
    authServiceFactory.requestPasswordReset = _requestPasswordReset;
    authServiceFactory.resetPassword = _resetPassword;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.refreshToken = _refreshToken;

    authServiceFactory.obtainAccessToken = _obtainAccessToken;
    authServiceFactory.externalAuthData = _externalAuthData;
    authServiceFactory.registerExternal = _registerExternal;

    return authServiceFactory;
}]);