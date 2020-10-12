'use strict';
thegioistickerAdmin.controller('infoController', ['$scope', '$location', 'authService', '$timeout', 'settingService', 'Notification', function ($scope, $location, authService, $timeout, settingService, Notification) {
    var table = {};
    $scope.faq = {};
    showLoading();
    $scope.initTable = function () {
        table = $('#infopage-table').DataTable({
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
            ajax: "api/setting/getPagingSettings",
            initComplete: function () {
                hideLoading();
                var api = this.api(),
                    searchBox = $('#faqs-search-input');
                if (searchBox.length > 0) {
                    searchBox.on('keyup', function (event) {
                        api.search(event.target.value).draw();
                    });
                }
            },
            columns: [
                { "data": "id", filterable: false, sortable: false },
                { "data": "name" },
                { "data": "settingValue" },
                {
                    "data": null, sortable: false, "targets": -1, "defaultContent": " <button type=\"button\" class=\"btn btn-icon edit-info\" aria-label=\"Product details\"><i class=\"icon icon-pencil s-4\"></i></button>",
                },
                //{
                //    "data": null, sortable: false, "targets": -2, "defaultContent": " <button type=\"button\" class=\"btn btn-icon delete-info\" aria-label=\"Product details\"><i class=\"icon icon-delete-circle s-4\"></i></button>",
                //}
            ],
            lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
            pageLength: 20,
            scrollY: 'auto',
            scrollX: false,
            responsive: true,
            autoWidth: false
        });
    }
    $scope.initTable();
    $('body').delegate('.edit-info', 'click', function (e) {
        e.preventDefault();
        var data = table.row($(this).parents('tr')).data();
        $scope.faq = data;
        $('input.form-control, textarea.form-control').addClass('md-has-value');
        $timeout(function () {
            $('#modal-infopage').modal('show');
        }, 200);
    });
    $scope.saveInfo = function () {
        var fv = $('#info-form').data('formValidation');
        var $container = $('#validate-info');
        fv.validateContainer($container);
        var isValidStep = fv.isValidContainer($container);
        if (isValidStep === false || isValidStep === null) {
            return false;
        }
        settingService.saveSetting($scope.faq).then(function (response) {
            $('#info-table').DataTable().ajax.reload();
            Notification.success("Lưu thành công");
            $('#modal-infopage').modal('hide');
        },
            function (err) {
                $scope.waringMessage = "Vui lòng kiểm tra lại";
            });
    };
    //validation
    initValidate();
    function initValidate() {
        $timeout(function () {
            $('#info-form').on('init.field.fv', function (e, data) {
                var $parent = data.element.parents('.form-group'),
                    $icon = data.element.data('fv.icon'),
                    $label = $parent.children('label');
                $icon.insertAfter($label);
            });
            $('#info-form').formValidation({
                icon: {
                    valid: 'fa fa-check',
                    invalid: 'fa fa-times',
                    validating: 'fa fa-refresh'
                },
                excluded: ':disabled',
                live: 'disabled',
                fields: {
                    values: {
                        validators: {
                            notEmpty: { message: 'Vui lòng nhập giá trị' }
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