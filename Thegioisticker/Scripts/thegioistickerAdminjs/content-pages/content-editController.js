'use strict';
thegioistickerAdmin.controller('contentEditController', ['$scope', '$timeout', 'Notification', 'companyService', '$state', '$location', 'authService', '$window', '$stateParams', function ($scope, $timeout, Notification, companyService, $state, $location, authService, $window, $stateParams) {
    $scope.contentId = $stateParams.contentId;
    var table = {};
    $scope.contentPage = {};
    $('#summernoteContent').summernote({
        placeholder: 'Nội Dung',
        tabsize: 2,
        height: 600,
        width: 1560
    });
    companyService.getContentPageById($scope.contentId).then(function (results) {
        $scope.contentPage = results.data;
        var markupStr = results.data.content;
        $('#summernoteContent').summernote('code', markupStr);
        hideLoading();
    }, function (error) {
        //alert(error.data.message);
    });
    $scope.saveContentPage = function () {
        var markupStr = $('#summernoteContent').summernote('code');
        $scope.contentPage.content = markupStr;
        companyService.saveContentPages($scope.contentPage).then(function (response) {
            Notification.success("Lưu thành công");
            $state.go('admin.contentpages');
        },
            function (err) {
                $scope.waringMessage = "Vui lòng kiểm tra lại";
            });
    };
    $scope.close = function () {
        $state.go('admin.contentpages');
    };
}]);