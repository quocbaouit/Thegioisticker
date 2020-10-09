'use strict';
thegioistickerAdmin.factory('companyService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var companyServiceFactory = {};

    var _getcompanys = function (pageIndex, pageSize) {

        return $http.get(serviceBase + 'api/company/getBlogs?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '').then(function (results) {
            return results;
        });
    };
    var _getContentPageById = function (contentId) {
        return $http.get(serviceBase + 'api/contentPage/GetContentPageById/' + contentId).then(function (results) {
            return results;
        });       
    };

    var _getAllContentPages = function () {
        return $http.get(serviceBase + 'api/contentPage/getAllContentPage').then(function (results) {
            return results;
        });
    };
    var _saveContentPages = function (contentPage) {
        return $http.post(serviceBase + 'api/contentPage/saveContentPage', contentPage).then(function (response) {
            return response;
        });
    };
    companyServiceFactory.getcompanys = _getcompanys;
    companyServiceFactory.getContentPageById = _getContentPageById;
    companyServiceFactory.getAllContentPages = _getAllContentPages;
    companyServiceFactory.saveContentPages = _saveContentPages;
    return companyServiceFactory;
}]);