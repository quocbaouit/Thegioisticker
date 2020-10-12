'use strict';
thegioistickerAdmin.controller('costsController', ['$scope', 'Notification', '$timeout', '$state', '$location', 'authService', 'costService', function ($scope, Notification, $timeout, $state, $location, authService, costService) {
    $scope.product = {};
    showLoading();
    
    var table = $('#cost-table').DataTable({
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
        ajax: "api/decalPrice/getPagingDecalPrices",
        initComplete: function () {
            hideLoading();
            var api = this.api(),
                searchBox = $('#products-search-input');
            if (searchBox.length > 0) {
                searchBox.on('keyup', function (event) {
                    api.search(event.target.value).draw();
                });
            }
        },
        columns: [
            { "data": "id", filterable: false, sortable: false },
            { "data": "description" },
            { "data": "quantity" },
            {
                "data": "printPrice",
                render: $.fn.dataTable.render.number(',')
            },
            {
                "data": "cutPrice",
                render: $.fn.dataTable.render.number(',')
            },
            {
                "data": "machiningPrice",
                render: $.fn.dataTable.render.number(',')
            },
            {
                "data": null, "targets": -1, "defaultContent": " <button type=\"button\" class=\"btn btn-icon edit-cost\" aria-label=\"details\"><i class=\"icon icon-pencil s-4\"></i></button>",
            },
            //{
            //    "data": null, sortable: false, "targets": -2, "defaultContent": " <button type=\"button\" class=\"btn btn-icon delete-cost\" aria-label=\"details\"><i class=\"icon icon-delete-circle s-4\"></i></button>",
            //}
        ],
        lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
        pageLength: 50,
        scrollY: 'auto',
        scrollX: false,
        responsive: true,
        autoWidth: false
    });
    $('body').delegate('.edit-cost', 'click', function (e) {
        e.preventDefault();
        var data = table.row($(this).parents('tr')).data();
        $scope.product = data;
        $('input.form-control, textarea.form-control').addClass('md-has-value');
        $timeout(function () {
            $('#modal-cost').modal('show');
        }, 200);
    });
    $scope.saveProduct = function () {
        var fv = $('#cost-form').data('formValidation');
        var $container = $('#validate-cost');
        fv.validateContainer($container);
        var isValidStep = fv.isValidContainer($container);
        if (isValidStep === false || isValidStep === null) {
            return false;
        }
        costService.saveCost($scope.product).then(function (response) {
            $('#cost-table').DataTable().ajax.reload();
            Notification.success("Lưu thành công");
            $('#modal-cost').modal('hide');
        },
			function (err) {
			    $scope.waringMessage = "Vui lòng kiểm tra lại";
			});
    };
    $('body').delegate('.delete-cost', 'click', function (e) {
        e.preventDefault();
        var data = table.row($(this).parents('tr')).data();
        data.isDelete = true;
        costService.saveCost(data).then(function (response) {
            Notification.success("Đã xóa thành công");
            $('#cost-table').DataTable().ajax.reload();
        },
			function (err) {
			    $scope.waringMessage = "Vui lòng kiểm tra lại";
			});
    });
    $scope.createProduct = function () {
        $scope.product = {
            id: 0,
            image: 'abcdef',
            name: '',
            price: 0,
            promotionPrice: 0,
            productCategoryId:1,
            isActive: true,
        };
        $timeout(function () {
            $('#modal-cost').modal('show');
        }, 200);
    };

    //validation
    initValidate();
    function initValidate() {
        $timeout(function () {
            $('#cost-form').on('init.field.fv', function (e, data) {
                var $parent = data.element.parents('.form-group'),
                    $icon = data.element.data('fv.icon'),
                    $label = $parent.children('label');
                $icon.insertAfter($label);
            });
            $('#cost-form').formValidation({
                icon: {
                    valid: 'fa fa-check',
                    invalid: 'fa fa-times',
                    validating: 'fa fa-refresh'
                },
                excluded: ':disabled',
                live: 'disabled',
                fields: {
                    description: {
                        validators: {
                            notEmpty: { message: 'Vui lòng nhập mô tả' }
                        }
                    },
                    quantity: {
                        validators: {
                            notEmpty: { message: 'Vui lòng nhập số lượng' }
                        }
                    },
                    printPrice: {
                        validators: {
                            notEmpty: { message: 'Vui lòng nhập giá in' }
                        }
                    },
                    cutPrice: {
                        validators: {
                            notEmpty: { message: 'Vui lòng nhập giá bế' }
                        }
                    },
                    machiningPrice: {
                        validators: {
                            notEmpty: { message: 'Vui lòng giá cán màng' }
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
    //end validation
}]);