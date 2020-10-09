'use strict';
thegioistickerApp.factory('customerService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var customerServiceFactory = {};

    var _getCustomerByUserId = function (userId) {

        return $http.get(serviceBase + 'api/customer/getCustomerByUserId?userId=' + userId + '').then(function (results) {
            return results;
        });
    };
    var _savecustomer = function (customer) {
        return $http.post(serviceBase + 'api/customer/saveCustomer', customer).then(function (response) {
            return response;
        });
    };
    customerServiceFactory.getCustomerByUserId = _getCustomerByUserId;
    customerServiceFactory.savecustomer = _savecustomer;
    return customerServiceFactory;

}]);