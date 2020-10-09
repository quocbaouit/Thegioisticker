'use strict';
thegioistickerApp.controller('productDetailController', ['$scope', '$timeout', 'productService', 'localStorageService', 'Notification', 'invoiceService', 'sampleService', '$compile', function ($scope, $timeout, productService, localStorageService, Notification, invoiceService, sampleService, $compile) {
    var url = new URL(location.href);
    var searchParams = new URLSearchParams(url.search);
    var url = location.pathname.split('chi-tiet-san-pham/')[1];
    $scope.samples = [];
    $scope.products = [];
    $scope.productsId = [];
    productService.getProductBySeoUrl(url).then(function (results) {
        $scope.product = results.data;
        $scope.shoppingCart.material = $scope.product;
        //$scope.shoppingCart.material = $scope.printingCategory.find(function (element) {
        //    return element.id == $scope.product.id;
        //});
        $("#view-content").empty();
        $("#view-content").append($scope.product.description);
        $scope.productsId = results.data.productSample;
        initSample();
        hideLoader();
    }, function (error) {
        //alert(error.data.message);
    });
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
    function initSlider(product) {
        $('.detail-slider .slider-for').slick('destroy');
        $('.detail-slider .slider-nav').slick('destroy');
        var divElement = angular.element(document.querySelector('.detail-slider'));
        divElement.empty();
        var sliderFor = '<div class="slider slider-for">';
        angular.forEach(product, function (value, key) {
            sliderFor = sliderFor + '<div class="img-outline ng-scope"><img style="cursor:pointer;" class="img-responsive" src="' + value.image + '"></div>';
            //sliderFor = sliderFor + '<div class="img-outline ng-scope"><img ng-click="showLibrary(' + value.id + ')" style="cursor:pointer;" class="img-responsive" src="' + value.image + '"></div>';
        });
        sliderFor = sliderFor + '</div>';
        var sliderNav = '<div class="slider slider-nav img-slider">';
        angular.forEach(product, function (value, key) {
            sliderNav = sliderNav + '<div class="img-small ng-scope"><img  class="img-responsive bd-color-setting" src="' + value.image + '"></div>';
        });
        sliderNav = sliderNav + '</div>';
        var slide = sliderFor + sliderNav;
        var htmlElement = angular.element(slide);
        divElement.append(htmlElement);
        $compile(divElement)($scope);
        $('.detail-slider .slider-for').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            autoplay: true,
            fade: true,
            asNavFor: '.detail-slider .slider-nav'
        });
        $('.detail-slider .slider-nav').slick({
            slidesToShow: 3, // 3,
            slidesToScroll: 1,
            autoplay: true,
            asNavFor: '.detail-slider .slider-for',
            dots: false,
            centerMode: true,
            focusOnSelect: true
        });
    }
    function initSample() {
        productService.getSampleByProductBySeoUrl(url).then(function (results) {
            $scope.products = results.data;
            initSlider($scope.products);
            hideLoader();
        }, function (error) {
            //alert(error.data.message);
        });
    }
    
    $('body').delegate('.categories li', 'click', function (e) {
        e.preventDefault();
        $('.categories li.active').removeClass('active');
        $(this).addClass('active');
    });
    $scope.viewDetail = function (Id) {
        window.location.href = '/chi-tiet-san-pham/' + Id + '';
    };
}]);