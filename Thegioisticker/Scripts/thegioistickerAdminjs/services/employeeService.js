'use strict';
thegioistickerAdmin.factory('employeeService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

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
    var _saveEmployee = function (customer) {
        return $http.post(serviceBase + 'api/employee/saveEmployee', customer).then(function (response) {
            return response;
        });
    };
    var _updateAccount = function (employee) {
        return $http.post(serviceBase + 'api/account/updateAccount', employee).then(function (response) {
            return response;
        });
    };
    var _delete = function (customer) {
        return $http.post(serviceBase + 'api/employee/deleteEmployee', customer).then(function (response) {
            return response;
        });
    };
    customerServiceFactory.getcustomerById = _getcustomerById;
    customerServiceFactory.getcustomers = _getcustomers;
    customerServiceFactory.getPagingcustomers = _getPagingcustomers;
    customerServiceFactory.updateAccount = _updateAccount;
    customerServiceFactory.saveEmployee = _saveEmployee;
    customerServiceFactory.delete = _delete;

    return customerServiceFactory;

}]);