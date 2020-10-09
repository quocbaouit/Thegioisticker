'use strict';
thegioistickerAdmin.controller('couponsController', ['$scope', '$timeout', 'Notification', 'couponService', '$state', '$location', 'authService', function ($scope, $timeout, Notification, couponService, $state, $location, authService) {
    var table = {};
    $scope.coupon = {};
    $scope.typea = [
        { value: 1, label: "Tiền Mặt" },
        { value: 2, label: "Phần trăm" },
    ];
    $scope.initTable = function () {
        showLoading();
        table = $('#coupon-table').DataTable({
            "language": {
                "lengthMenu": "Hiển thị _MENU_ số dòng trên trang",
                "zeroRecords": "Không tìm thấy dữ liệu",
                "info": "Hiển thị trang _PAGE_ của _PAGES_",
                "infoEmpty": "No records available",
                "infoFiltered": "(Đã lọc từ _MAX_ trong tổng số dòng)",
            },
            dom: 'rtip',
            processing: true,
            serverSide: true,
            searching: true,
            ordering: true,
            paging: true,
             ajax: "api/coupon/getPagingCoupons",
             initComplete: function () {
                 hideLoading();
                var api = this.api(),
                    searchBox = $('#coupons-search-input');
                if (searchBox.length > 0) {
                    searchBox.on('keyup', function (event) {
                        api.search(event.target.value).draw();
                    });
                }
            },
            columns: [
                { "data": "id", filterable: false, sortable: false },
                { "data": "name" },
                { "data": "code" },
                
                {
                    "data": "type",
                    render: function (data, type) {
                        if (type === 'display') {
                            var displayText = '';

                            if (data==1) {
                                displayText = 'Số tiền';
                            }
                            if (data == 2) {
                                displayText = 'Phần trăm';
                            }
                            return '' + displayText + '';
                        }
                        return data;
                    }
                },
                { "data": "amount" },
                //{ "data": "limit" },
                { "data": "limitUsed" },
                { "data": "used" },
                {
                    "data": null, sortable: false, "targets": -1, "defaultContent": " <button type=\"button\" class=\"btn btn-icon edit-coupon\" aria-label=\"Product details\"><i class=\"icon icon-pencil s-4\"></i></button>",
                },
                {
                    "data": null, sortable: false, "targets": -2, "defaultContent": " <button type=\"button\" class=\"btn btn-icon delete-coupon\" aria-label=\"Product details\"><i class=\"icon icon-delete-circle s-4\"></i></button>",
                }
            ],
            lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
            pageLength: 10,
            scrollY: 'auto',
            scrollX: false,
            responsive: true,
            autoWidth: false
        });
    }
    $scope.initTable();
    $('body').delegate('.edit-coupon', 'click', function (e) {
        e.preventDefault();
        var fv = $('#coupon-form').data('formValidation');
        fv.resetForm();
        var data = table.row($(this).parents('tr')).data();
        $scope.coupon = data;
        $('input.form-control, textarea.form-control').addClass('md-has-value');
        $timeout(function () {
            $('#modal-coupon').modal('show');
        }, 200);     
    });
    $scope.savecoupon = function () {
        var fv = $('#coupon-form').data('formValidation');
        var $container = $('#validate-coupon');
        fv.validateContainer($container);
        var isValidStep = fv.isValidContainer($container);
        if (isValidStep === false || isValidStep === null) {
            return false;
        }
        couponService.savecoupon($scope.coupon).then(function (response) {
            $('#coupon-table').DataTable().ajax.reload();
            Notification.success("Lưu thành công");
            $('#modal-coupon').modal('hide');
        },
			function (err) {
			    $scope.waringMessage = "Vui lòng kiểm tra lại";
			});
    };
    $('body').delegate('.delete-coupon', 'click', function (e) {
        e.preventDefault();
        var data = table.row($(this).parents('tr')).data();
        couponService.delete(data).then(function (response) {
            Notification.success("Đã xóa thành công");
            $('#coupon-table').DataTable().ajax.reload();
        },
			function (err) {
			    $scope.waringMessage = "Vui lòng kiểm tra lại";
			});
    });
    $scope.createcoupon = function () {
        var fv = $('#coupon-form').data('formValidation');
        fv.resetForm();
        $scope.coupon = {
            id: 0,
            name: '',
            type:1,
            code: '',
            amount: 0,
            limitUsed: 0
        };
        $timeout(function () {
            $('#modal-coupon').modal('show');
        }, 200);
    };
    //validation
    initValidate();
    function initValidate() {
        $timeout(function () {
            $('#coupon-form').on('init.field.fv', function (e, data) {
                var $parent = data.element.parents('.form-group'),
                    $icon = data.element.data('fv.icon'),
                    $label = $parent.children('label');
                $icon.insertAfter($label);
            });
            $('#coupon-form').formValidation({
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
                            notEmpty: { message: 'Vui lòng nhập tên' }
                        }
                    },
                    code: {
                        validators: {
                            notEmpty: { message: 'Vui lòng nhập mã giảm giá' }
                        }
                    },
                    amount: {
                        validators: {
                            notEmpty: { message: 'Vui lòng nhập số tiền được giảm' }
                        }
                    },
                    limitUsed: {
                        validators: {
                            notEmpty: { message: 'Vui lòng nhập giới hạn sử dụng' }
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
    //end validation
}]);