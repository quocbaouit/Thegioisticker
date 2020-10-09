'use strict';
thegioistickerAdmin.factory('customerService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var customerServiceFactory = {};

    var _getcustomers = function () {
        return $http.get(serviceBase + 'api/customer').then(function (results) {
            return results;
        });
    };
    var _getcustomerById = function (customerId) {
        return $http.get(serviceBase + 'api/customer/GetcustomerById/' + customerId).then(function (results) {
            return results;
        });
    };
    var _getPagingcustomers = function () {
        return $http.get(serviceBase + 'api/customer/getPagingcustomer').then(function (results) {
            return results;
        });
    };
    var _savecustomer = function (customer) {
        return $http.post(serviceBase + 'api/customer/saveCustomer', customer).then(function (response) {
            return response;
        });
    };
    var _delete = function (customer) {
        return $http.post(serviceBase + 'api/customer/deletecustomer', customer).then(function (response) {
            return response;
        });
    };
    customerServiceFactory.getcustomerById = _getcustomerById;
    customerServiceFactory.getcustomers = _getcustomers;
    customerServiceFactory.getPagingcustomers = _getPagingcustomers;
    customerServiceFactory.savecustomer = _savecustomer;
    customerServiceFactory.delete = _delete;

    return customerServiceFactory;

}]);