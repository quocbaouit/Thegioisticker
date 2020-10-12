'use strict';
thegioistickerAdmin.factory('sampleService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var sampleServiceFactory = {};

    var _getSamples = function () {
        return $http.get(serviceBase + 'api/sample').then(function (results) {
            return results;
        });
    };
    var _getSampleById = function (sampleId) {
        return $http.get(serviceBase + 'api/samples/GetSampleById/' + sampleId).then(function (results) {
            return results;
        });
    };
    var _getPagingSamples = function () {
        return $http.get(serviceBase + 'api/samples/getPagingSample').then(function (results) {
            return results;
        });
    };
    var _saveSample = function (sample) {
        return $http.post(serviceBase + 'api/samples/CreateSample', sample).then(function (response) {
            return response;
        });

    };
    var _uploadFiles = function ($scope) {
        var request = {
            method: 'POST',
            url: serviceBase + 'api/uploadTolocal?imageType=3',
            data: $scope.formdata,
            headers: {
                'Content-Type': undefined
            }
        };

        // SEND THE FILES.
        return $http(request)
            .then(
                function (response) {
                    if (typeof response.data === 'string') {
                        return response.data;
                    } else {
                        return $q.reject(response.data);
                    }
                },
                function (response) {
                    return $q.reject(response.data);
                }
            );
    };
    sampleServiceFactory.getSampleById = _getSampleById;
    sampleServiceFactory.getSamples = _getSamples;
    sampleServiceFactory.getPagingSamples = _getPagingSamples;
    sampleServiceFactory.saveSample = _saveSample;
    sampleServiceFactory.uploadFiles = _uploadFiles;

    return sampleServiceFactory;

}]);