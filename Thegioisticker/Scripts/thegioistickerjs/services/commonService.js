'use strict';
thegioistickerApp.factory('commonService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var commonServiceFactory = {};

    var _getcommons = function (pageIndex, pageSize) {

        return $http.get(serviceBase + 'api/commons/GetcommonsForSale?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '').then(function (results) {
            return results;
        });
    };
    commonServiceFactory.getcommons = _getcommons;

    return commonServiceFactory;

}]);