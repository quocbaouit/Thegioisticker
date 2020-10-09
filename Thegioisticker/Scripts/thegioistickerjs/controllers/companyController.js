'use strict';
thegioistickerApp.controller('companyController', ['$scope', '$timeout', 'companyService', 'localStorageService', 'Notification', function ($scope, $timeout, companyService, localStorageService, Notification) {
    $scope.company = [];
    if (window.location.pathname != '/lien-he') {
        getAllContentPages();
    }
    initValidateContact();
    function getAllContentPages() {
        showLoader();
        companyService.getAllContentPages().then(function (results) {
            $("#gioithieu").empty();
            $("#gioithieu").append(results.data[0].content);

            $("#tuyendung").empty();
            $("#tuyendung").append(results.data[1].content);

            $("#quydinhchung").empty();
            $("#quydinhchung").append(results.data[2].content);

            $("#thanhtoangiaohang").empty();
            $("#thanhtoangiaohang").append(results.data[3].content);

            $("#baomat").empty();
            $("#baomat").append(results.data[4].content);
            hideLoader();
        }, function (error) {
            //alert(error.data.message);
        });
    }
   
    $scope.sendContact = function () {
        var fv = $('#f11').data('formValidation');
        var $container = $('#f11-step1');
        fv.validateContainer($container);
        var isValidStep = fv.isValidContainer($container);
        if (isValidStep === false || isValidStep === null) {
            return false;
        }
        Notification.success('Đã gởi thành công.');

    }

    function initValidateContact() {
        $timeout(function () {
            $('#f11').on('init.field.fv', function (e, data) {
                var $parent = data.element.parents('.form-group'),
                    $icon = data.element.data('fv.icon'),
                    $label = $parent.children('label');
                $icon.insertAfter($label);
            });
            $('#f11').formValidation({
                icon: {
                    valid: 'fa fa-check',
                    invalid: 'fa fa-times',
                    validating: 'fa fa-refresh'
                },
                excluded: ':disabled',
                live: 'disabled',
                fields: {
                    name: {
                        validators: {
                            notEmpty: { message: 'Vui lòng nhập tên' },
                        }
                    },
                    email: {
                        validators: {
                            notEmpty: { message: 'Vui lòng nhập email' }
                        }
                    },
                    msg: {
                        validators: {
                            notEmpty: { message: 'Vui lòng nhập nội dung' }
                        }
                    },
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
}]);