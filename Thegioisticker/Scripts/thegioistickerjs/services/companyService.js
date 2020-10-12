'use strict';
sieuvietApp.factory('companyService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var companyServiceFactory = {};

    var _getcompanys = function (pageIndex, pageSize) {

        return $http.get(serviceBase + 'api/company/getBlogs?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '').then(function (results) {
            return results;
        });
    };
    var _getBlogById = function (companyId) {
        return $http.get(serviceBase + 'api/company/GetBlogById/' + companyId).then(function (results) {
            return results;
        });       
    };

    var _getAllContentPages = function () {
        return $http.get(serviceBase + 'api/contentPage/getAllContentPage').then(function (results) {
            return results;
        });
    };
    companyServiceFactory.getcompanys = _getcompanys;
    companyServiceFactory.getBlogById = _getBlogById;
    companyServiceFactory.getAllContentPages = _getAllContentPages;
    return companyServiceFactory;

}]);