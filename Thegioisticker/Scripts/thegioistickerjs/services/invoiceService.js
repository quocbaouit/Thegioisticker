﻿'use strict';
thegioistickerApp.factory('invoiceService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var invoiceServiceFactory = {};

    var _getInvoices = function () {

        return $http.get(serviceBase + 'api/decalPrice/getDecalPrices').then(function (results) {
            return results;
        });
    };
    invoiceServiceFactory.getInvoices = _getInvoices;

    return invoiceServiceFactory;

}]);