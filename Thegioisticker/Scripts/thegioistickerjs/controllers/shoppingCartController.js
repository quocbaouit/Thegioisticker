'use strict';
thegioistickerApp.controller('shoppingCartController', ['$scope', '$timeout', 'customerService', 'ordersService', 'productService', 'localStorageService', 'Notification', 'couponService', function ($scope, $timeout, customerService, ordersService, productService, localStorageService, Notification, couponService) {
    $scope.shoppingCart = [];
    $scope.subTotal = 0;
    $scope.couponValue = 0;
    $scope.isApplyCoupon = false;
    $scope.couponLabel = '';
    $scope.note = '';
    $scope.options = ['Khi Nhận Hàng', 'Chuyển Khoản'];
    $scope.myselect = 'Khi Nhận Hàng';
    $scope.couponText = 'VND';
    $scope.orderNumber = location.search.split('orderId=')[1];
    $scope.coupon = '';
    $scope.couponType = 0;
    $scope.customer = {
        id: 0,
        userId: '',
        fullName: '',
        address: '',
        email: '',
        phoneNumber: '',
    };
    $scope.selectedProduct = {};
    customerService.getCustomerByUserId($scope.authentication.id).then(function (response) {
        if (response.data == null) {
            $scope.customer.fullName = $scope.authentication.fullName;
            $scope.customer.userId = $scope.authentication.id;
        } else {
            $scope.customer = {
                id: response.data.id,
                userId: $scope.authentication.id,
                fullName: response.data.fullName,
                address: response.data.address,
                email: response.data.email,
                phoneNumber: response.data.phoneNumber,
            };
        }
        hideLoader();
    },
        function (err) {
            Notification.error('Vui lòng kiểm tra lại');
        });
    if (localStorageService.get('shoppingCart') != null) {
        var products = localStorageService.get('shoppingCart').products;
        $scope.shoppingCart = products;
    }
    var calculateTotals = function () {
        var total = 0;
        for (var i = 0, len = $scope.shoppingCart.length; i < len; i++) {
            total = total + $scope.shoppingCart[i].subTotal;
        }
        //$scope.couponValue = $scope.couponResult.amount;
        //$scope.isApplyCoupon = true;
        //$scope.couponLabel = $scope.couponResult.code;
        if ($scope.couponResult != undefined && $scope.couponResult.type == 2) {
            $scope.couponText = '% Đơn Hàng';
            total = total - (($scope.couponValue * total)/100);
        }
        if ($scope.couponResult != undefined && $scope.couponResult.type == 1) {
            $scope.couponText = 'VND';
            total = total - $scope.couponValue;
        }
     
        $scope.subTotal = total;
        var listProducts = $scope.shoppingCart;
        localStorageService.set('shoppingCart', { products: listProducts });
    };
    $scope.removeShopping = function (item) {
        var index = $scope.shoppingCart.indexOf(item);
        $scope.shoppingCart.splice(index, 1);

        var relatedItem = $scope.shoppingCart.find(function (element) {
            return element.transactionId == item.transactionId;
        });
        $scope.shoppingCart.splice(relatedItem, 1);

        var listProducts = $scope.shoppingCart;
        localStorageService.set('shoppingCart', { products: listProducts });
        Notification.primary('Đã xóa khỏi giỏ hàng thành công');
    }
    $scope.$watch('shoppingCart', calculateTotals, true);
    $scope.customer = {

    };
    $scope.proccessOrder = function () {
        var fv = $('#f1').data('formValidation');
        var $container = $('#f1-step1');
        fv.validateContainer($container);
        var isValidStep = fv.isValidContainer($container);
        if (isValidStep === false || isValidStep === null) {
            return false;
        }
        if ($scope.shoppingCart.length == 0) {
            Notification.error('không có sản phẩm nào trong giỏ hàng');
            return;
        }
        showLoader();
        var orders = {
            customer: $scope.customer,
            note: $scope.note,
            products: $scope.shoppingCart,
            couponName: $scope.coupon,
            discountValue: $scope.couponValue,
            payMentMethol: $scope.myselect,
            total: $scope.subTotal,
            couponType: $scope.couponType,
        };
        ordersService.saveOrder(orders).then(function (response) {
            console.log(20);
            $scope.orderNumber = response.data;
            Notification.success('Đơn hàng đã được tạo thành công');
            setTimeout(function () {
                localStorageService.remove('shoppingCart');
                //if (order.payMentMethol =='Chuyển Khoản') {
                //    window.location.href = '/hoan-tat-don-hang';
                //}
                window.location.href = '/hoan-tat-don-hang?orderId=' + btoa(response.data)+'';
            }, 500);
        },
            function (err) {
                Notification.error('Vui lòng kiểm tra lại đơn hàng.');
                hideLoader();
            });
    }

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
                fullName: {
                    validators: {
                        notEmpty: { message: 'Vui òng điền họ và tên' }
                    }
                },
                address: {
                    validators: {
                        notEmpty: { message: 'Vui lòng điền địa chỉ' }
                    }
                },
                email: {
                    validators: {
                        notEmpty: { message: 'Vui lòng điền email' }
                    }
                },
                phoneNumber: {
                    validators: {
                        notEmpty: { message: 'Vui lòng điền số điện thoại' }
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
    $scope.applyCoupon = function () {
        couponService.applyCounpon($scope.coupon).then(function (response) {
            if (response.status == 200 && response.data != null) {
                $scope.couponResult = response.data;
                $scope.couponValue = $scope.couponResult.amount;
                $scope.couponType = $scope.couponResult.type;
                $scope.isApplyCoupon = true;
                $scope.couponLabel = $scope.couponResult.code;
                calculateTotals();
                Notification.success('Áp dụng mã khuyến mãi thành công');
            }
        },
            function (err) {
                Notification.error('Mã khuyến mãi không đúng');
            });
    }
    $scope.showFilePopup = function (product) {
        if (product.fileType == 1) {
            
            $scope.selectedProduct = product;
            $scope.fields= JSON.parse($scope.selectedProduct.settingModal).fields
            $('#shopping-review-popup').modal('show');
        }
        if (product.fileType == 2) {
            $scope.selectedProduct = product;
            $('#design-review-popup').modal('show');
        }
        if (product.fileType == 3) {
            getListfile(product.transactionId);
            $scope.selectedProduct = product;
            $('#upload-review-popup').modal('show');
        }
        console.log(product);
    }
    function getListfile(transactionId) {
        productService.getListFileName(transactionId).then(function (response) {
            $scope.selectedProduct.imageUrls = response.data;
        },
            function (err) {
                Notification.error('Vui lòng kiểm tra lại.');
                hideLoader();
            });
    }
    $scope.removeCoupon = function () {
        $scope.couponValue = 0;
        $scope.isApplyCoupon = false;
        $scope.couponLabel = '';
        $scope.coupon = '';
        $scope.couponType = 0;
        calculateTotals();

    }

}]); 