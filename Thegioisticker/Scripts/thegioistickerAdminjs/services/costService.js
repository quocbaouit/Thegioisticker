'use strict';
thegioistickerAdmin.factory('costService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var costServiceFactory = {};

    var _getProducts = function () {
        return $http.get(serviceBase + 'api/decalPrice').then(function (results) {
            return results;
        });
    };
    var _getProductById = function (costId) {
        return $http.get(serviceBase + 'api/decalPrice/GetProductById/' + costId).then(function (results) {
            return results;
        });
    };
    var _getPagingDecalPrices = function () {
        return $http.get(serviceBase + 'api/decalPrice/getPagingDecalPrices').then(function (results) {
            return results;
        });
    };
    var _saveCost = function (cost) {
        return $http.post(serviceBase + 'api/decalPrice/saveDecalPrice', cost).then(function (response) {
            return response;
        });

    };
    costServiceFactory.getProductById = _getProductById;
    costServiceFactory.getProducts = _getProducts;
    costServiceFactory.getPagingDecalPrices = _getPagingDecalPrices;
    costServiceFactory.saveCost = _saveCost;

    return costServiceFactory;

}]);