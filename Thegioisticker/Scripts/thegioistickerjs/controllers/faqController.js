'use strict';
thegioistickerApp.controller('faqController', ['$scope', '$timeout', 'faqService', 'localStorageService', 'Notification', function ($scope, $timeout, faqService, localStorageService, Notification) {
    $scope.faqs = [];
    getfaqs();
    function getfaqs() {
        showLoader();
        faqService.getfaqs().then(function (results) {
            $scope.faqs = results.data;
            hideLoader();
        }, function (error) {
            //alert(error.data.message);
        });
    }
}]);