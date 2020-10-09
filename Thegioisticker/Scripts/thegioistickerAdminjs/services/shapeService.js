'use strict';
thegioistickerAdmin.factory('shapeService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var shapeServiceFactory = {};

    var _getShapes = function () {
        return $http.get(serviceBase + 'api/shapes/getAllShape').then(function (results) {
            return results;
        });
    };
    var _getProductById = function (shapeId) {
        return $http.get(serviceBase + 'api/shapes/GetProductById/' + shapeId).then(function (results) {
            return results;
        });
    };
    var _getPagingProducts = function () {
        return $http.get(serviceBase + 'api/shapes/getPagingProduct').then(function (results) {
            return results;
        });
    };
    var _saveProduct = function (shape) {
        return $http.post(serviceBase + 'api/shapes/CreateProduct', shape).then(function (response) {
            return response;
        });

    };
    shapeServiceFactory.getProductById = _getProductById;
    shapeServiceFactory.getShapes = _getShapes;
    shapeServiceFactory.getPagingProducts = _getPagingProducts;
    shapeServiceFactory.saveProduct = _saveProduct;

    return shapeServiceFactory;

}]);