'use strict';
thegioistickerApp.controller('faqController', ['$scope', '$timeout', 'faqService', 'localStorageService', 'Notification', function ($scope, $timeout, faqService, localStorageService, Notification) {
    $scope.faqs =[];
    faqService.getfaqs().then(function (results) {
        debugger;
        $scope.faqs = results.data;
        hideLoader();
    }, function (error) {
        //alert(error.data.message);
    });
    

}]);