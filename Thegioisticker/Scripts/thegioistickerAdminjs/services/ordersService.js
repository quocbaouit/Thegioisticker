'use strict';
thegioistickerAdmin.factory('ordersService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var orderServiceFactory = {};

    var _getorders = function () {
        return $http.get(serviceBase + 'api/order').then(function (results) {
            return results;
        });
    };
    var _getorderById = function (orderId) {
        return $http.get(serviceBase + 'api/order/GetOrderById/' + orderId).then(function (results) {
            return results;
        });
    };
    var _getPagingorders = function () {
        return $http.get(serviceBase + 'api/order/getPagingorder').then(function (results) {
            return results;
        });
    };
    var _saveOrder = function (order) {
        return $http.post(serviceBase + 'api/order/adminSaveOrder', order).then(function (response) {
            return response;
        });
    };
    var _delete = function (order) {
        return $http.post(serviceBase + 'api/order/deleteOrder', order).then(function (response) {
            return response;
        });
    };
    var _deleteDetail = function (orderDetail) {
        return $http.post(serviceBase + 'api/order/deleteOrderDetail', orderDetail).then(function (response) {
            return response;
        });    
    };
    var _getListFileName = function (transactionId) {
        return $http.get(serviceBase + 'api/upload/getListFileName/' + transactionId).then(function (results) {
            return results;
        });
    };

    orderServiceFactory.getorderById = _getorderById;
    orderServiceFactory.getorders = _getorders;
    orderServiceFactory.getPagingorders = _getPagingorders;
    orderServiceFactory.saveOrder = _saveOrder;
    orderServiceFactory.delete = _delete;
    orderServiceFactory.deleteDetail = _deleteDetail;
    orderServiceFactory.getListFileName = _getListFileName;

    return orderServiceFactory;

}]);