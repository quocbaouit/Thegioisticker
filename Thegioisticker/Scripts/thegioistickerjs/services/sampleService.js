'use strict';
thegioistickerApp.factory('sampleService', ['$http', 'ngAuthSettings', '$q', function ($http, ngAuthSettings, $q) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var sampleServiceFactory = {};

    var _getAllSample = function () {
        return $http.get(serviceBase + 'api/samples/getAllSample').then(function (results) {
            return results;
        });
    };
    
    sampleServiceFactory.getAllSample = _getAllSample;
    return sampleServiceFactory;
}]);