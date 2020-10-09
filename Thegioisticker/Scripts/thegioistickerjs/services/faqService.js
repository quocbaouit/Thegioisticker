'use strict';
thegioistickerApp.factory('faqService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var faqServiceFactory = {};

    var _getfaqs = function (pageIndex, pageSize) {

        return $http.get(serviceBase + 'api/faq/getFaqs').then(function (results) {
            return results;
        });
    };
    faqServiceFactory.getfaqs = _getfaqs;

    return faqServiceFactory;

}]);