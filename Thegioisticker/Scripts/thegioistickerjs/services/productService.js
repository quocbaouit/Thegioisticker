﻿'use strict';
thegioistickerApp.factory('productService', ['$http', 'ngAuthSettings', '$q', function ($http, ngAuthSettings, $q) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var productServiceFactory = {};

    var _getProducts = function (pageIndex, pageSize, categoryId) {

        return $http.get(serviceBase + 'api/products/GetProductsForSale?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&categoryId=' + categoryId + '').then(function (results) {
            return results;
        });
    };
    var _getProductCategory = function () {
        return $http.get(serviceBase + 'api/products/getProductCategory').then(function (results) {
            return results;
        });
    }; 
    var _getProductById = function (productId) {
        return $http.get(serviceBase + 'api/products/GetProductById/' + productId).then(function (results) {
            return results;
        });
    };
    var _getProductBySeoUrl = function (seoUrl) {
        return $http.get(serviceBase + 'api/products/getProductBySeoUrl/' + seoUrl).then(function (results) {
            return results;
        });
    };
    var _getProductByCode = function (code) {
        return $http.get(serviceBase + 'api/products/GetProductByCode/' + code).then(function (results) {
            return results;
        });
    };
    var _getProductsRegular = function () {
        return $http.get(serviceBase + 'api/products/getProductsRegular').then(function (results) {
            return results;
        });
    };
    var _getProductsHightLight = function () {
        return $http.get(serviceBase + 'api/products/getProductsHightLight').then(function (results) {
            return results;
        });
    };
    var _getProductsByCategory = function (category) {
        return $http.get(serviceBase + 'api/products/getProductsByCategory/' + category).then(function (results) {
            return results;
        });
    };
    var _getSampleByProductById = function (id) {
        return $http.get(serviceBase + 'api/products/getSampleByProductById/' + id).then(function (results) {
            return results;
        });
    };
    var _getSampleByProductBySeoUrl = function (seoUrl) {
        return $http.get(serviceBase + 'api/products/getSampleByProductBySeoUrl/' + seoUrl).then(function (results) {
            return results;
        });
    };
    var _getListFileName = function (transactionId) {
        return $http.get(serviceBase + 'api/upload/getListFileName/' + transactionId).then(function (results) {
            return results;
        });
    };
    var _uploadFiles = function ($scope) {
        var request = {
            method: 'POST',
            url: serviceBase + 'api/upload/?identifier=' + $scope.product.transactionId+'',
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
    }
    
    productServiceFactory.getProducts = _getProducts;
    productServiceFactory.getProductCategory = _getProductCategory;
    productServiceFactory.getProductById = _getProductById;
    productServiceFactory.getListFileName = _getListFileName;
    productServiceFactory.getProductsRegular = _getProductsRegular;
    productServiceFactory.getProductsHightLight = _getProductsHightLight;
    productServiceFactory.getProductByCode = _getProductByCode;
    productServiceFactory.getProductsByCategory = _getProductsByCategory;
    productServiceFactory.uploadFiles = _uploadFiles;
    productServiceFactory.getSampleByProductById = _getSampleByProductById;
    productServiceFactory.getProductBySeoUrl = _getProductBySeoUrl;
    productServiceFactory.getSampleByProductBySeoUrl = _getSampleByProductBySeoUrl;
    return productServiceFactory;

}]); 