'use strict';
thegioistickerAdmin.factory('settingService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var settingServiceFactory = {};

    var _getsettings = function () {
        return $http.get(serviceBase + 'api/setting').then(function (results) {
            return results;
        });
    };
    var _getsettingById = function (settingId) {
        return $http.get(serviceBase + 'api/setting/GetSettingById/' + settingId).then(function (results) {
            return results;
        });
    };
    var _getPagingsettings = function () {
        return $http.get(serviceBase + 'api/setting/getPagingsetting').then(function (results) {
            return results;
        });
    };
    var _saveSetting = function (setting) {
        return $http.post(serviceBase + 'api/setting/saveSetting', setting).then(function (response) {
            return response;
        });
    };
    var _delete = function (setting) {
        return $http.post(serviceBase + 'api/setting/deleteSetting', setting).then(function (response) {
            return response;
        });
    };
    settingServiceFactory.getsettingById = _getsettingById;
    settingServiceFactory.getsettings = _getsettings;
    settingServiceFactory.getPagingsettings = _getPagingsettings;
    settingServiceFactory.saveSetting = _saveSetting;
    settingServiceFactory.delete = _delete;

    return settingServiceFactory;

}]);