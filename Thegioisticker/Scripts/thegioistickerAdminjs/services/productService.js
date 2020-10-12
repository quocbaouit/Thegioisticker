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
    var _updateProductDescription = function (product) {
        return $http.post(serviceBase + 'api/products/updateProductDescription', product).then(function (response) {
            return response;
        });

    };
    var _uploadFiles = function ($scope) {
        var request = {
            method: 'POST',
            url: serviceBase + 'api/uploadTolocal?imageType=2',
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
    var _getProductSamplesByProductId = function (productId) {
        return $http.get(serviceBase + 'api/products/getProductSamplesByProductId/' + productId).then(function (results) {
            return results;
        });
    };
    var _createProductSample = function (productSample) {
        return $http.post(serviceBase + 'api/products/createProductSample', productSample).then(function (response) {
            return response;
        });

    };
    productServiceFactory.getProductById = _getProductById;
    productServiceFactory.getProducts = _getProducts;
    productServiceFactory.getPagingProducts = _getPagingProducts; 
    productServiceFactory.saveProduct = _saveProduct;
    productServiceFactory.updateProductDescription = _updateProductDescription;
    productServiceFactory.uploadFiles = _uploadFiles;
    productServiceFactory.getProductSamplesByProductId = _getProductSamplesByProductId;
    productServiceFactory.createProductSample = _createProductSample;
    return productServiceFactory;

}]);