'use strict';
thegioistickerApp.controller('userController', ['$scope', 'customerService', '$timeout', 'localStorageService', 'Notification', function ($scope, customerService, $timeout, localStorageService, Notification) {
    $scope.customer = {
        id: 0,
        userId: '',
        fullName: '',
        address: '',
        email: '',
        phoneNumber: '',
    };
    $scope.orderDetail = [];
    $scope.detail = {};
    var table = {};
    $scope.order = {};
    $scope.DeleveryOptions = ['Khi Nhận Hàng', 'Chuyển Khoản'];
    $scope.orderStatusOptions = [
      { value: 0, name: 'Chưa Giao Hàng' },
      { value: 1, name: 'Đang Giao Hàng' },
      { value: 2, name: 'Đã Giao Hàng' }
    ];

    $scope.availableOptions = [
      { id: 0, name: 'Chưa Giao Hàng' },
      { id: 1, name: 'Đang Giao Hàng' },
      { id: 2, name: 'Đã Giao Hàng' }
    ]
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
        $scope.initTable();
    },
           function (err) {
               Notification.error('Vui lòng kiểm tra lại');
           });

    $scope.updateCustomer = function () {
        var fv = $('#f1').data('formValidation');
        var $container = $('#f1-step1');
        fv.validateContainer($container);
        var isValidStep = fv.isValidContainer($container);
        if (isValidStep === false || isValidStep === null) {
            return false;
        }
        customerService.savecustomer($scope.customer).then(function (response) {
            Notification.success('Cập nhật thông tin thành công');
        },
           function (err) {
               Notification.error('Vui lòng kiểm tra lại');
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
    $scope.initTable = function () {
        table = $('#order-table').DataTable({
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
            ajax: {
                "url": "api/customer/getPagingOrders",
                "type": "GET",
                "data": {
                    "customerId": $scope.customer.id,
                }
            },
            initComplete: function () {
                var api = this.api(),
                    searchBox = $('#orders-search-input');
                if (searchBox.length > 0) {
                    searchBox.on('keyup', function (event) {
                        api.search(event.target.value).draw();
                    });
                }
            },
            columns: [
                { "data": "id", filterable: false, sortable: false },
                {
                    "data": "customerName",
                    render: function (data, type) {
                        if (type === 'display') {
                            return '<a class="edit-customer" style="color:green" href="javascript:void(0)">' + data + '</a>';
                        }
                        return data;
                    }

                },
                {
                    "data": "total",
                    render: $.fn.dataTable.render.number(',')
                },
                { "data": "payMentMethol" },
                {
                    "data": "orderStatus",
                    render: function (data, type) {

                        if (type === 'display') {
                            if (data == 0) {
                                return 'Chưa Giao Hàng';
                            }
                            else if (data == 1) {
                                return 'Đang Giao Hàng';
                            }
                            else {
                                return 'Đã Giao Hàng';
                            }
                        }

                        return data;
                    }
                },
                 { "data": "note" },
                  {
                      "data": "dateCreated",
                      render: function (data, type, row) {
                          if (data == null) return '';
                          if (type === "sort" || type === "type") {
                              return data;
                          }
                          return moment(data).format("DD-MM-YYYY HH:mm");
                      }
                  },
                {
                    "data": "deliveryDate",
                    render: function (data, type, row) {
                        if (data == null) return '';
                        if (type === "sort" || type === "type") {
                            return data;
                        }
                        return moment(data).format("DD-MM-YYYY HH:mm");
                    }
                },
                {
                    "data": null, sortable: false, "targets": -1, "defaultContent": " <button type=\"button\" class=\"btn btn-icon edit-item\" aria-label=\"Product details\"><i class=\"fa fa-eye\"></i></button>",
                },
               
            ],
            lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
            pageLength: 10,
            scrollY: 'auto',
            scrollX: false,
            responsive: true,
            autoWidth: false
        });
        hideLoader();
    }

    $('body').delegate('.edit-item', 'click', function (e) {
        e.preventDefault();
        var data = table.row($(this).parents('tr')).data();
        $scope.order = data;
        debugger;
        $scope.orderDetail = data.orderDetail;
        if ($scope.order.deliveryDate != null) {
            $scope.order.deliveryDate = new Date($scope.order.deliveryDate);
        }      
        $timeout(function () {
            $timeout(function () {
                $('#repeatSelect').val($scope.order.orderStatus);
            }, 200);
            $('#repeatSelect').val($scope.order.orderStatus);
            $('#modal-lg').modal('show');

        }, 200);
    });

}]);