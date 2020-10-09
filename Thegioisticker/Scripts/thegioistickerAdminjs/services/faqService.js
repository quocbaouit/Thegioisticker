'use strict';
thegioistickerAdmin.factory('faqService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var faqServiceFactory = {};

    var _getfaqs = function () {
        return $http.get(serviceBase + 'api/faq').then(function (results) {
            return results;
        });
    };
    var _getfaqById = function (faqId) {
        return $http.get(serviceBase + 'api/faq/GetFaqById/' + faqId).then(function (results) {
            return results;
        });
    };
    var _getPagingfaqs = function () {
        return $http.get(serviceBase + 'api/faq/getPagingfaq').then(function (results) {
            return results;
        });
    };
    var _savefaq = function (faq) {
        return $http.post(serviceBase + 'api/faq/saveFaq', faq).then(function (response) {
            return response;
        });
    };
    var _delete = function (faq) {
        return $http.post(serviceBase + 'api/faq/deleteFaq', faq).then(function (response) {
            return response;
        });
    };
    faqServiceFactory.getfaqById = _getfaqById;
    faqServiceFactory.getfaqs = _getfaqs;
    faqServiceFactory.getPagingfaqs = _getPagingfaqs;
    faqServiceFactory.savefaq = _savefaq;
    faqServiceFactory.delete = _delete;

    return faqServiceFactory;

}]);