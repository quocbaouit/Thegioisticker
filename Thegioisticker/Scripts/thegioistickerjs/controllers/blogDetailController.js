'use strict';
thegioistickerApp.controller('blogDetailController', ['$scope', '$timeout', 'blogService', 'localStorageService', 'Notification', '$rootScope', function ($scope, $timeout, blogService, localStorageService, Notification, $rootScope) {
    //var myParam = location.search.split('Id=')[1];
    //var myParam = location.pathname.split('thong-tin-chi-tiet/')[1];
    //$scope.content = '';
    //getBlog();
    //function getBlog() {
    //    showLoader();
    //    blogService.getBlogBySeoUrl(myParam).then(function (results) {
    //        debugger;
    //        $scope.content = results.data.content;
    //        $rootScope.metaDescription = results.data.metaDescription;
    //        $rootScope.metaTitle = results.data.metaTitle;
    //        $("#view-content").empty();
    //        $("#view-content").append($scope.content);
    //        hideLoader();
    //    }, function (error) {
    //        //alert(error.data.message);
    //    });
    //}   
}]);