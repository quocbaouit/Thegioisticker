'use strict';
thegioistickerAdmin.factory('productService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var productServiceFactory = {};

    var _getProducts = function () {
        return $http.get(serviceBase + 'api/product').then(function (results) {
            return results;
        });
    };
    var _getProductById = function (productId) {
        return $http.get(serviceBase + 'api/products/GetProductById/' + productId).then(function (results) {
            return results;
        });
    };
    var _getPagingProducts = function () {
        return $http.get(serviceBase + 'api/products/getPagingProduct').then(function (results) {
            return results;
        });
    };
    var _saveProduct = function (product) {
        return $http.post(serviceBase + 'api/products/CreateProduct', product).then(function (response) {
            return response;
        });

    };
    productServiceFactory.getProductById = _getProductById;
    productServiceFactory.getProducts = _getProducts;
    productServiceFactory.getPagingProducts = _getPagingProducts;
    productServiceFactory.saveProduct = _saveProduct;

    return productServiceFactory;

}]);