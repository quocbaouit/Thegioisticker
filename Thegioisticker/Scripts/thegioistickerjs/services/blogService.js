'use strict';
thegioistickerApp.factory('blogService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var blogServiceFactory = {};

    var _getblogs = function (pageIndex, pageSize) {

        return $http.get(serviceBase + 'api/blog/getBlogs?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '').then(function (results) {
            return results;
        });
    };
    var _getBlogById = function (blogId) {
        return $http.get(serviceBase + 'api/blog/GetBlogById/' + blogId).then(function (results) {
            return results;
        });       
    };
    var _getBlogBySeoUrl = function (seoUrl) {
        return $http.get(serviceBase + 'api/blog/GetBlogBySeoUrl/' + seoUrl).then(function (results) {
            return results;
        });
    };
    var _getBlogForHomePage = function () {
        return $http.get(serviceBase + 'api/blog/getBlogForHomePage').then(function (results) {
            return results;
        });
    };
    blogServiceFactory.getblogs = _getblogs;
    blogServiceFactory.getBlogById = _getBlogById;
    blogServiceFactory.getBlogBySeoUrl = _getBlogBySeoUrl;
    blogServiceFactory.getBlogForHomePage = _getBlogForHomePage;
    return blogServiceFactory;

}]);