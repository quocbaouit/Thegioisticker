thegioistickerApp.directive('invoiceForm', ['$document', '$timeout', 'sampleService', '$compile', 'invoiceService', 'localStorageService', function ($document, $timeout, sampleService, $compile, invoiceService, localStorageService) {
    return {
        restrict: 'E',
        templateUrl: '/Scripts/directives/invoice-form.html?v32100',
        replace: true,
        scope: {
            shoppingCart: '=',
            mode: '=',
        },
        link: function (scope, element, attr) {
            scope.fileUrl = [];
            scope.product = {};
            scope.selectedSample = {};
            scope.stickers = [];
            scope.price = 0;
            scope.subTotal = 0;
            scope.square = 0;
            scope.invoicePrintPrice = '';
            scope.invoiceMachining = '';
            scope.invoiceCut = '';
            initValidate();
            function initValidate() {
                $timeout(function () {
                    $('#f1').on('init.field.fv', function (e, data) {
                        var $parent = data.element.parents('.form-group'),
                            $icon = data.element.data('fv.icon'),
                            $label = $parent.children('label');
                        $icon.insertAfter($label);
                    });
                    $('#f1').formValidation({
                        icon: {
                            valid: 'fa fa-check',
                            invalid: 'fa fa-times',
                            validating: 'fa fa-refresh'
                        },
                        excluded: ':disabled',
                        live: 'disabled',
                        fields: {
                            width: {
                                validators: {
                                    notEmpty: { message: 'Vui lòng nhập chiều ngang' }
                                }
                            },
                            height: {
                                validators: {
                                    notEmpty: { message: 'Vui lòng nhập chiều cao' }
                                }
                            },
                            quantity: {
                                validators: {
                                    notEmpty: { message: 'Vui lòng nhập số lượng' },
                                    callback: {
                                        message: 'Số lượng tối thiểu là 100.',
                                        callback: function (value, validator, $field) {
                                            if (parseFloat(value) >= 100) {
                                                return true;
                                            }
                                            return false;
                                        }
                                    }
                                }
                            }
                        }
                    })
                        .on('err.field.fv', function (e, data) {
                            data.fv.disableSubmitButtons(false);
                        })
                        .on('err.validator.fv', function (e, data) {
                            data.element.data('fv.messages')
                                .find('.help-block[data-fv-for="' + data.field + '"]').hide()
                                .filter('[data-fv-validator="' + data.validator + '"]').show();
                        })
                        .on('success.field.fv', function (e, data) {
                            data.fv.disableSubmitButtons(false);
                        })
                        .on('success.form.fv', function (e) {
                            e.preventDefault();
                        });

                    $('#f2').on('init.field.fv', function (e, data) {
                        var $parent = data.element.parents('.form-group'),
                            $icon = data.element.data('fv.icon'),
                            $label = $parent.children('label');
                        $icon.insertAfter($label);
                    });
                    $('#f2').formValidation({
                        icon: {
                            valid: 'fa fa-check',
                            invalid: 'fa fa-times',
                            validating: 'fa fa-refresh'
                        },
                        excluded: ':disabled',
                        live: 'disabled',
                        fields: {
                            width: {
                                validators: {
                                    notEmpty: { message: 'Vui lòng nhập chiều ngang' }
                                }
                            },
                            height: {
                                validators: {
                                    notEmpty: { message: 'Vui lòng nhập chiều cao' }
                                }
                            },
                            quantity: {
                                validators: {
                                    notEmpty: { message: 'Vui lòng nhập số lượng' },
                                    callback: {
                                        message: 'Số lượng tối thiểu là 100.',
                                        callback: function (value, validator, $field) {
                                            if (parseFloat(value) >= 100) {
                                                return true;
                                            }
                                            return false;
                                        }
                                    }
                                }
                            }
                        }
                    })
                        .on('err.field.fv', function (e, data) {
                            data.fv.disableSubmitButtons(false);
                        })
                        .on('err.validator.fv', function (e, data) {
                            data.element.data('fv.messages')
                                .find('.help-block[data-fv-for="' + data.field + '"]').hide()
                                .filter('[data-fv-validator="' + data.validator + '"]').show();
                        })
                        .on('success.field.fv', function (e, data) {
                            data.fv.disableSubmitButtons(false);
                        })
                        .on('success.form.fv', function (e) {
                            e.preventDefault();
                        });
                })
            }
            scope.options = [
                { id: 2, value: 'decalgiay', label: 'Decal giấy', price: 1000 },
                { id: 3, value: 'decalnhua', label: 'Decal nhựa', price: 2000 },
                { id: 4, value: 'decalxibong', label: 'Decal xi bóng', price: 2000 },
                { id: 5, value: 'decalximo', label: 'Decal xi mờ', price: 2000 },
                { id: 6, value: 'decal7mau', label: 'Decal 7 màu', price: 3000 },
                { id: 7, value: 'decalbe', label: 'Decal bế', price: 9000 },
                { id: 8, value: 'decalkraft', label: 'Decal Kraft', price: 1500 },
            ];
            scope.machinings = [
                { value: 'canmangbong', label: 'Cán màng bóng' },
                { value: 'canmangmo', label: 'Cán màng mờ' },
                { value: 'khongcanmang', label: 'Không cán màng' },
            ];
            scope.cuts = [
                { value: 'bedemi', label: 'Bế demi' },
                { value: 'khongbe', label: 'Không bế' },
            ];
            scope.files = [
                { value: 0, label: '' },
                { value: 1, label: 'Upload file thiết kế' },
                { value: 2, label: 'Chọn mẫu' },
                { value: 3, label: 'Thiết kế theo yêu cầu' }
            ];
            scope.shapes = [
                { id: 5, value: 'hinhchunhat', label: 'Hình chữ nhật', image: '/images/shapes/hinhchunhat.png' },
                { id: 6, value: 'hinhchunhatbogoc', label: 'Hình chữ nhật bo góc', image: '/images/shapes/hinhchunhatbogoc.png' },
                { id: 7, value: 'hinhhoa', label: 'Hình hoa', image: '/images/shapes/hinhhoa.png' },
                { id: 3, value: 'hinhvuong', label: 'Hình vuông', image: '/images/shapes/hinhvuong.png' },
                { id: 4, value: 'hinhvuongbogoc', label: 'Hình vuông bo góc', image: '/images/shapes/hinhvuongbogoc.png' },
                { id: 1, value: 'hinhtron', label: 'Hình tròn', image: '/images/shapes/hinhtron.png' },
                { id: 10, value: 'hinhtraitim', label: 'Hình trái tim', image: '/images/shapes/hinhtraitim.png' },
                { id: 9, value: 'hinhlucgiac', label: 'Hình lục giác', image: '/images/shapes/hinhlucgiac.png' },
                { id: 8, value: 'hinhno', label: 'Hình nơ', image: '/images/shapes/hinhno.png' },
                { id: 2, value: 'hinhoval', label: 'Hình oval', image: '/images/shapes/hinhoval.png' },
                { id: 11, value: 'hinhmau1', label: 'Hình Mẫu 1', image: '/images/shapes/hinhmau1.png' },
                { id: 12, value: 'hinhmau2', label: 'Hình Mẫu 2', image: '/images/shapes/hinhmau2.png' },
                { id: 13, value: 'hinhmau3', label: 'Hình Mẫu 3', image: '/images/shapes/hinhmau3.png' },
                { id: 14, value: 'hinhmau4', label: 'Hình Mẫu 4', image: '/images/shapes/hinhmau4.png' },
                { id: 15, value: 'hinhmau5', label: 'Hình Mẫu 5', image: '/images/shapes/hinhmau5.png' },
                { id: 16, value: 'hinhmau6', label: 'Hình Mẫu 6', image: '/images/shapes/hinhmau6.png' }
            ];
            scope.shoppingCart.material = scope.options[0];
            scope.shoppingCart.machining = scope.machinings[0];
            scope.shoppingCart.cut = scope.cuts[0];
            scope.shoppingCart.file = scope.files[0];
            scope.shoppingCart.cutType = scope.shapes[0];
            $timeout(function () {
            });
            invoiceService.getInvoices().then(function (results) {
                scope.stickers = results.data;
                calculateTotals();
                hideLoader();
            }, function (error) {
                //alert(error.data.message);
            });
            function getA4quantity(width, height, quantity) {
                return Math.ceil(parseFloat((width * height / 60000 * quantity)).toFixed(2));
            }
            var calculateTotals = function () {
                scope.invoicePrintPrice = '';
                scope.invoiceMachining = '';
                scope.invoiceCut = '';
                scope.subTotal = '';
                scope.price = scope.subTotal / quantity;
                var sticker = {};
                var invoicePrintPrice = 0;
                var invoiceMachining = 0;
                var invoiceCut = 0;
                var invoiceMaterialPrice = scope.shoppingCart.material.price;
                var width = isNaN(parseFloat(scope.shoppingCart.width)) ? 0 : parseFloat(scope.shoppingCart.width);
                var height = isNaN(parseFloat(scope.shoppingCart.height)) ? 0 : parseFloat(scope.shoppingCart.height);
                var quantity = isNaN(parseFloat(scope.shoppingCart.quantity)) ? 0 : parseFloat(scope.shoppingCart.quantity);
                if (width > 0 && height > 0 && quantity > 0) {
                    var a4quantity = getA4quantity(width, height, quantity);
                    sticker = scope.stickers.find(obj => {
                        return obj.quantity === a4quantity;
                    });
                    if (sticker == undefined) {
                        invoicePrintPrice = 1500;
                        invoiceCut = 1500;
                        invoiceMachining = 300;
                        invoiceMaterialPrice = scope.shoppingCart.material.price;
                    } else {
                        invoicePrintPrice = sticker.printPrice;
                        invoiceCut = sticker.cutPrice;
                        invoiceMachining = sticker.machiningPrice;
                        invoiceMaterialPrice = scope.shoppingCart.material.price;
                    }
                    if (scope.shoppingCart.machining.value == "khongcanmang") {
                        invoiceMachining = 0;
                    }
                    if (scope.shoppingCart.cut.value == "khongbe") {
                        invoiceCut = 0;
                    }
                    scope.invoicePrintPrice = (invoicePrintPrice + invoiceMaterialPrice) * a4quantity;
                    scope.invoiceMachining = invoiceMachining * a4quantity;
                    scope.invoiceCut = invoiceCut * a4quantity;
                    scope.subTotal = (invoicePrintPrice + invoiceMaterialPrice + invoiceMachining + invoiceCut) * a4quantity;
                    scope.price = scope.subTotal / quantity;
                }
            };
            scope.$watch('shoppingCart', calculateTotals, true);
        },
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
            var now = moment();
            $scope.onFileChange = function (itemSelected) {
                if (itemSelected.value == 1) {
                    $('#upload-pupup').modal('show');
                }
                if (itemSelected.value == 2) {
                    $('#library-pupup').modal('show');
                 
                }
                if (itemSelected.value == 3) {
                    $('#design-pupup').modal('show');
                }
            };
        }]
    }
}]);