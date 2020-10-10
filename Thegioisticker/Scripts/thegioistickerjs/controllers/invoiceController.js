'use strict';
thegioistickerApp.controller('invoiceController', ['$scope', '$timeout', 'invoiceService', 'localStorageService', 'Notification', 'productService', function ($scope, $timeout, invoiceService, localStorageService, Notification, productService) {
    $scope.stickers = [];
    $scope.price = 0;
    $scope.subTotal = 0;
    $scope.square = 0;
    $scope.invoicePrintPrice = '';
    $scope.invoiceMachining = '';
    $scope.invoiceCut = '';
    $scope.shoppingCart = {
        material: {},
        width: '',
        height: '',
        quantity: '',
        machining: {},
        cut: {},
    };
    $scope.selectedMaterial = '';
    //productService.getProductsByCategory(1).then(function (results) {
    //    debugger;
    //    var mapped = [];
    //    results.data.forEach(function (entry) {
    //        console.log(entry);
    //        mapped.push({ id: entry.id, value: entry.code, label: entry.name, price: entry.price })
    //    });
    //    $scope.options = mapped;
    //    hideLoader();
    //}, function (error) {
    //    //alert(error.data.message);
    //});
    $scope.options = [

        { id: 2, value: 'decalgiay', label: 'Decal giấy', price: 1000 },
        { id: 3, value: 'decalnhua', label: 'Decal nhựa', price: 2000 },
        { id: 4, value: 'decalxibong', label: 'Decal xi bóng', price: 2000 },
        { id: 5, value: 'decalximo', label: 'Decal xi mờ', price: 2000 },
        { id: 6, value: 'decal7mau', label: 'Decal 7 màu', price: 3000 },
        { id: 7, value: 'decalbe', label: 'Decal bế', price: 9000 },
        { id: 8, value: 'decalkraft', label: 'Decal Kraft', price: 1500 },
    ];
    $scope.options1 = [
        { value: 'canmangbong', label: 'Cán màng bóng' },
        { value: 'canmangmo', label: 'Cán màng mờ' },
        { value: 'khongcanmang', label: 'Không cán màng' },
    ];
    $scope.options2 = [
        { value: 'bedemi', label: 'Bế demi' },
        { value: 'khongbe', label: 'Không bế' },
    ];
    $scope.shoppingCart.material = $scope.options[0];
    $scope.shoppingCart.machining = $scope.options1[0];
    $scope.shoppingCart.cut = $scope.options2[0];

    invoiceService.getInvoices().then(function (results) {
        $scope.stickers = results.data;
        hideLoader();
    }, function (error) {
        //alert(error.data.message);
    });
    function getA4quantity(width, height, quantity) {
        return Math.ceil(parseFloat((width * height / 60000 * quantity)).toFixed(2));
    }
    var calculateTotals = function () {
        $scope.invoicePrintPrice = '';
        $scope.invoiceMachining = '';
        $scope.invoiceCut = '';
        $scope.subTotal = '';
        $scope.price = $scope.subTotal / quantity;
        var sticker = {};
        var invoicePrintPrice = 0;
        var invoiceMachining = 0;
        var invoiceCut = 0;
        var invoiceMaterialPrice = $scope.shoppingCart.material.price;
        var width = isNaN(parseFloat($scope.shoppingCart.width)) ? 0 : parseFloat($scope.shoppingCart.width);
        var height = isNaN(parseFloat($scope.shoppingCart.height)) ? 0 : parseFloat($scope.shoppingCart.height);
        var quantity = isNaN(parseFloat($scope.shoppingCart.quantity)) ? 0 : parseFloat($scope.shoppingCart.quantity);
        if (width > 0 && height > 0 && quantity > 0) {
            var a4quantity = getA4quantity(width, height, quantity);
            sticker = $scope.stickers.find(obj => {
                return obj.quantity === a4quantity;
            });
            if (sticker == undefined) {
                invoicePrintPrice = 1500;
                invoiceCut = 1500;
                invoiceMachining = 300;
                invoiceMaterialPrice = $scope.shoppingCart.material.price;
            } else {
                invoicePrintPrice = sticker.printPrice;
                invoiceCut = sticker.cutPrice;
                invoiceMachining = sticker.machiningPrice;
                invoiceMaterialPrice = $scope.shoppingCart.material.price;
            }
            if ($scope.shoppingCart.machining.value == "khongcanmang") {
                invoiceMachining = 0;
            }
            if ($scope.shoppingCart.cut.value == "khongbe") {
                invoiceCut = 0;
            }
            $scope.invoicePrintPrice = (invoicePrintPrice + invoiceMaterialPrice) * a4quantity;
            $scope.invoiceMachining = invoiceMachining * a4quantity;
            $scope.invoiceCut = invoiceCut * a4quantity;
            $scope.subTotal = (invoicePrintPrice + invoiceMaterialPrice + invoiceMachining + invoiceCut) * a4quantity;
            $scope.price = $scope.subTotal / quantity;
        }
    };
    $scope.$watch('shoppingCart', calculateTotals, true);

    $scope.productDetai = function () {
        var id = $scope.shoppingCart.material.id;
        var width = isNaN(parseFloat($scope.shoppingCart.width)) ? 0 : parseFloat($scope.shoppingCart.width);
        var height = isNaN(parseFloat($scope.shoppingCart.height)) ? 0 : parseFloat($scope.shoppingCart.height);
        var quantity = isNaN(parseFloat($scope.shoppingCart.quantity)) ? 0 : parseFloat($scope.shoppingCart.quantity);
        var machining = $scope.shoppingCart.machining.value;
        var cut = $scope.shoppingCart.cut.value;
        //var urlencode = btoa('id=' + id + '&width=' + width + '&height=' + height + '&quantity=' + quantity + '&machining=' + machining + '&cut=' + cut + '')
        //window.location.href = '/chi-tiet-san-pham?code=' + urlencode + '';
        window.location.href = '/chi-tiet-san-pham?id=' + id + '&width=' + width + '&height=' + height + '&quantity=' + quantity + '&machining=' + machining + '&cut=' + cut + '';
    };
}]);