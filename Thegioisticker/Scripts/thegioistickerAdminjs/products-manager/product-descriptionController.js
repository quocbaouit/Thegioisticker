'use strict';
thegioistickerAdmin.controller('productDescriptionController', ['$scope', '$timeout', 'Notification', 'productService', '$state', '$location', 'authService', '$window', '$stateParams', function ($scope, $timeout, Notification, productService, $state, $location, authService, $window, $stateParams) {

    showLoading();
    $scope.product = {};
    $scope.productId = $stateParams.productId;
    $('#summernoteProduct').summernote({
        placeholder: 'Nội Dung',
        tabsize: 2,
        height: 600,
        width: 1560
    });
    productService.getProductById($scope.productId).then(function (results) {
        $scope.product = results.data;
        var markupStr = results.data.description;
        $('#summernoteProduct').summernote('code', markupStr);
        hideLoading();
    }, function (error) {
        //alert(error.data.message);
    });
    $scope.saveProductDescription = function () {
        var markupStr = $('#summernoteProduct').summernote('code');
        $scope.product.description = markupStr;
        productService.updateProductDescription($scope.product).then(function (response) {
            Notification.success("Lưu thành công");
            $state.go('admin.products');
        },
            function (err) {
                $scope.waringMessage = "Vui lòng kiểm tra lại";
            });
    };
    $scope.close = function () {
        $state.go('admin.products');
    };

}]);