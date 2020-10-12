'use strict';
thegioistickerApp.factory('sampleService', ['$http', 'ngAuthSettings', '$q', function ($http, ngAuthSettings, $q) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var sampleServiceFactory = {};
    var _getSamples = function (pageIndex, pageSize,category) {

        return $http.get(serviceBase + 'api/samples/getSamples?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&category=' + category+ '').then(function (results) {
            return results;
        });
    };

    var _getAllSample = function () {
        return $http.get(serviceBase + 'api/samples/getAllSample').then(function (results) {
            return results;
        });
    };
    var _getListFileName = function (transactionId) {
        return $http.get(serviceBase + 'api/upload/getListFileName/' + transactionId).then(function (results) {
            return results;
        });
    };
    var _getSampleByShapeId = function (shapeId) {
        return $http.get(serviceBase + 'api/samples/getSamplesByShape/' + shapeId).then(function (results) {
            return results;
        });
    };
    sampleServiceFactory.getAllSample = _getAllSample;
    sampleServiceFactory.getSampleByShapeId = _getSampleByShapeId;
    sampleServiceFactory.getListFileName = _getListFileName;
    sampleServiceFactory.getSamples = _getSamples;
    return sampleServiceFactory;
}]);