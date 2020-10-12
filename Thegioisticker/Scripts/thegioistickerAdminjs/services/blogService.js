'use strict';
thegioistickerAdmin.factory('blogService', ['$http', 'ngAuthSettings', '$q', function ($http, ngAuthSettings, $q) {

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
    var _uploadFiles = function ($scope) {
        var request = {
            method: 'POST',
            url: serviceBase + 'api/uploadTolocal?imageType=1',
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
    blogServiceFactory.getblogById = _getblogById;
    blogServiceFactory.getblogs = _getblogs;
    blogServiceFactory.getPagingblogs = _getPagingblogs;
    blogServiceFactory.saveblog = _saveblog;
    blogServiceFactory.delete = _delete;
    blogServiceFactory.uploadFiles = _uploadFiles;
    return blogServiceFactory;

}]);