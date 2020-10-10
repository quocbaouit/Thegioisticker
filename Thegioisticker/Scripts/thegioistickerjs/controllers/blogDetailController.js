'use strict';
thegioistickerApp.controller('blogDetailController', ['$scope', '$timeout', 'blogService', 'localStorageService', 'Notification', function ($scope, $timeout, blogService, localStorageService, Notification) {
    var myParam = location.search.split('Id=')[1];
    $scope.content = '';
    blogService.getBlogById(myParam).then(function (results) {
        debugger;
        $scope.content = results.data.content;
        $("#view-content").empty();
        $("#view-content").append($scope.content);
        hideLoader();
    }, function (error) {
        //alert(error.data.message);
    });
}]);