'use strict';
thegioistickerApp.controller('productDetailController', ['$scope', '$timeout', 'productService', 'localStorageService', 'Notification', 'invoiceService', function ($scope, $timeout, productService, localStorageService, Notification, invoiceService) {
    var url = new URL(location.href);
    var searchParams = new URLSearchParams(url.search);
    var id = searchParams.get('id');
    var width = searchParams.get('width');
    var height = searchParams.get('height');
    var quantity = searchParams.get('quantity');
    var machining = searchParams.get('machining');
    var cut = searchParams.get('cut');
    $scope.uploading = false;
    $scope.countFiles = '';
    $scope.data = []; //For displaying file name on browser
    $scope.formdata = new FormData();
    $scope.getFiles = function (file) {
        angular.forEach(file, function (value, key) {
            $scope.formdata.append(key, value);
            $scope.data.push({ FileName: value.name, FileLength: value.size });

        });
        $scope.countFiles = $scope.data.length == 0 ? '' : $scope.data.length + ' files selected';
        $scope.$apply();
        $scope.formdata.append('countFiles', $scope.countFiles);

    };

    $scope.recentProducts = [];
    $scope.product = {};
    $scope.stickers = [];
    $scope.price = 0;
    $scope.subTotal = 0;
    $scope.square = 0;
    $scope.invoicePrintPrice = '';
    $scope.invoiceMachining = '';
    $scope.invoiceCut = '';
    $scope.shoppingCart = {
        material: {},
        width: width,
        height: height,
        quantity: quantity,
        machining: {},
        cut: {},
        cutType: '',
        file: ''
    };
    $scope.selectedMaterial = '';
    $scope.fileUrl = [];
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
    $scope.options3 = [
        { value: 1, label: 'Gởi file thiết kế sau' },
        { value: 2, label: 'Chọn mẫu của siêu việt' },
        { value: 3, label: 'Upload file thiết kế' }
    ];

    $scope.options4 = [
        { value: 'hinhchunhat', label: 'Hình chữ nhật' },
        { value: 'hinhchunhatbogoc', label: 'Hình chữ nhật bo góc' },
        { value: 'hinhhoa', label: 'Hình hoa' },
        { value: 'hinhvuong', label: 'Hình vuông' },
        { value: 'hinhvuongbogoc', label: 'Hình vuông bo góc' },
        { value: 'hinhtron', label: 'Hình tròn' },
        { value: 'hinhtraitim', label: 'Hình trái tim' },
        { value: 'hinhlucgiac', label: 'Hình lục giác' },
        { value: 'hinhno', label: 'Hình nơ' },
        { value: 'hinhoval', label: 'Hình oval' },
        { value: 'hinhmau1', label: 'Hình Mẫu 1' },
        { value: 'hinhmau2', label: 'Hình Mẫu 2' },
        { value: 'hinhmau3', label: 'Hình Mẫu 3' },
        { value: 'hinhmau4', label: 'Hình Mẫu 4' },
        { value: 'hinhmau5', label: 'Hình Mẫu 5' },
        { value: 'hinhmau6', label: 'Hình Mẫu 6' }
    ];

    var selectedMaterial = $scope.options.find(obj => {
        return obj.id == id;
    });
    var selectedMachining = $scope.options1.find(obj => {
        return obj.value == machining;
    });
    var selectedcut = $scope.options2.find(obj => {
        return obj.value == cut;
    });
    if (selectedMaterial) {
        $scope.shoppingCart.material = selectedMaterial;
    } else {
        $scope.shoppingCart.material = $scope.options[0];
    }
    if (selectedMachining) {
        $scope.shoppingCart.machining = selectedMachining;
    } else {
        $scope.shoppingCart.machining = $scope.options1[0];
    }
    if (selectedcut) {
        $scope.shoppingCart.cut = selectedcut
    } else {
        $scope.shoppingCart.cut = $scope.options2[0];
    }
    $scope.shoppingCart.file = $scope.options3[0];
    $scope.shoppingCart.cutType = $scope.options4[0];
    invoiceService.getInvoices().then(function (results) {
        $scope.stickers = results.data;
        calculateTotals();
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
    productService.getProductById(id).then(function (results) {
        $scope.product = {
            id: results.data.id,
            name: results.data.name,
            description: results.data.description,
            price: results.data.price,
            promotionPrice: results.data.promotionPrice,
            subTotal: 0,
            category: 'Decal',
            image: results.data.image,
            largeImage: results.data.image
        };
        if (localStorageService.get('recentProducts') != null) {
            $scope.recentProducts = localStorageService.get('recentProducts').recentProducts;
        }
        var target = $scope.recentProducts.find(temp => temp.id == $scope.product.id)
        if (!target) {
            $scope.recentProducts.unshift($scope.product);
            var recentProducts = $scope.recentProducts;
            localStorageService.set('recentProducts', { recentProducts });
        }
        hideLoader();
    }, function (error) {
        //alert(error.data.message);
    });

    $scope.addToshoppingCart = function (type) {
        var fv = $('#f1').data('formValidation');
        var $container = $('#f1-step1');
        fv.validateContainer($container);
        var isValidStep = fv.isValidContainer($container);
        if (isValidStep === false || isValidStep === null) {
            return false;
        }
        //if ($scope.shoppingCart.length == 0) {
        //    Notification.error('không có sản phẩm nào trong giỏ hàng');
        //    return;
        //}
        $scope.product.transactionId = guid();
        $scope.product.quantity = $scope.shoppingCart.quantity;
        $scope.product.price = $scope.price;
        $scope.product.subTotal = $scope.subTotal;
        $scope.product.width = $scope.shoppingCart.width;
        $scope.product.height = $scope.shoppingCart.height;
        $scope.product.machining = $scope.shoppingCart.machining.label;
        $scope.product.cut = $scope.shoppingCart.cut.label;
        $scope.product.cutType = $scope.shoppingCart.cutType.label;
        $scope.product.file = $scope.shoppingCart.file.label;
        $scope.product.fileUrl = $scope.fileUrl;

        var item = $scope.product;
        //var target = $scope.cart.find(temp=>temp.id == item.id)
        //if (target) {
        //    Notification.error('Sản phẩm này đã tồn tại.');
        //}
        //else {            
        $scope.cart.push(item);
        //}      
        var listProducts = $scope.cart;
        var count = $scope.cart.length;
        $('[data-count]').attr('data-count', count);
        localStorageService.set('shoppingCart', { products: listProducts });
        if (type == 1) {
            window.location.href = "/gio-hang";
        } else {
            Notification.primary('Thêm vào giỏ hàng thành công');
        }

    };
    $scope.viewDetail = function (Id) {
        window.location.href = '/chi-tiet-san-pham?id=' + Id + '';
    };
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
                        notEmpty: { message: 'Vui òng nhập chiều ngang' }
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
                                debugger;
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

    $scope.uploadFiles = function () {
        $scope.uploading = true;
        productService.uploadFiles($scope)
            .then(function (data) {
                $scope.uploading = false;
                if (data === '') {
                    Notification.primary('Tải file thành công.');
                    $scope.formdata = new FormData();
                    $scope.data = [];
                    $scope.countFiles = '';
                    $scope.$apply;
                } else {
                    Notification.error('Đã có lỗi xảy ra.');
                    console.log(data);
                }
            }, function (error) {
                $scope.uploading = false;
                Notification.error('Đã có lỗi xảy ra.');
                console.log(error);
            }
            );
    };
}]);