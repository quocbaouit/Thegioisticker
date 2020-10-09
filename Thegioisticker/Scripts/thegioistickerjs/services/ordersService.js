'use strict';
thegioistickerApp.factory('ordersService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var ordersServiceFactory = {};

    var _getOrders = function () {
        return $http.get(serviceBase + 'api/order').then(function (results) {
            return results;
        });
    };
    var _saveOrder = function (orders) {
        return $http.post(serviceBase + 'api/order/CreateOrder', orders).then(function (response) {
            return response;
        });

    };

    ordersServiceFactory.getOrders = _getOrders;
    ordersServiceFactory.saveOrder = _saveOrder;

    return ordersServiceFactory;

}]);