'use strict';
thegioistickerAdmin.factory('blogService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var blogServiceFactory = {};

    var _getblogs = function () {
        return $http.get(serviceBase + 'api/blog').then(function (results) {
            return results;
        });
    };
    var _getblogById = function (blogId) {
        return $http.get(serviceBase + 'api/blog/GetBlogById/' + blogId).then(function (results) {
            return results;
        });
    };
    var _getPagingblogs = function () {
        return $http.get(serviceBase + 'api/blog/getPagingblog').then(function (results) {
            return results;
        });
    };
    var _saveblog = function (blog) {
        return $http.post(serviceBase + 'api/blog/saveBlog', blog).then(function (response) {
            return response;
        });
    };
    var _delete = function (blog) {
        return $http.post(serviceBase + 'api/blog/deleteBlog', blog).then(function (response) {
            return response;
        });
    };
    blogServiceFactory.getblogById = _getblogById;
    blogServiceFactory.getblogs = _getblogs;
    blogServiceFactory.getPagingblogs = _getPagingblogs;
    blogServiceFactory.saveblog = _saveblog;
    blogServiceFactory.delete = _delete;

    return blogServiceFactory;

}]);