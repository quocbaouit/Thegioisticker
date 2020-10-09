'use strict';
thegioistickerAdmin.controller('orderController', ['$scope', 'customerService', 'ordersService', '$timeout', 'Notification', '$location', 'authService', function ($scope, customerService, ordersService, $timeout, Notification, $location, authService) {
    $scope.orderDetail = [];
    $scope.detail = {};
    var table = {};
    $scope.order = {};
    $scope.customer = {};
    $scope.fields = [];
    $scope.imageUrls = [];
    showLoading();
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
                "url": "api/order/getPagingOrders",
                "type": "GET"
            },
            initComplete: function () {
                hideLoading();
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
                    "data": null, sortable: false, "targets": -1, "defaultContent": " <button type=\"button\" class=\"btn btn-icon edit-order\" aria-label=\"Product details\"><i class=\"icon icon-eye-outline s-4\"></i></button>",
                },
                {
                    "data": null, sortable: false, "targets": -2, "defaultContent": " <button type=\"button\" class=\"btn btn-icon delete-order\" aria-label=\"Product details\"><i class=\"icon icon-delete-circle s-4\"></i></button>",
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
    $('body').delegate('.edit-order', 'click', function (e) {
        e.preventDefault();
        var data = table.row($(this).parents('tr')).data();
        $scope.order = data;
        $scope.orderDetail = data.orderDetail;
        if ($scope.order.deliveryDate != null) {
            $scope.order.deliveryDate = new Date($scope.order.deliveryDate);
        }
        $('input.form-control, textarea.form-control').addClass('md-has-value');
        $timeout(function () {
            $timeout(function () {
                $('#repeatSelect').val($scope.order.orderStatus);
            }, 200);
            $('#repeatSelect').val($scope.order.orderStatus);
            $('#modal-orderpage').modal('show');

        }, 200);
    });
    $scope.saveOrder = function () {
        $scope.order.orderDetail = $scope.orderDetail;
        ordersService.saveOrder($scope.order).then(function (response) {
            $('#order-table').DataTable().ajax.reload();
            Notification.success("Lưu thành công");
            $('#modal-orderpage').modal('hide');
        },
			function (err) {
			    $scope.waringMessage = "Vui lòng kiểm tra lại";
			});
    };
    $('body').delegate('.delete-order', 'click', function (e) {
        e.preventDefault();
        var data = table.row($(this).parents('tr')).data();
        ordersService.delete(data).then(function (response) {
            Notification.success("Đã xóa thành công");
            $('#order-table').DataTable().ajax.reload();
        },
			function (err) {
			    $scope.waringMessage = "Vui lòng kiểm tra lại";
			});
    });
    $scope.editDetail = function (detail) {
        $scope.detail = detail;
        debugger;
        if ($scope.detail.fileType==1) {
            $scope.fields = JSON.parse($scope.detail.settingModal).fields;
        }
        if ($scope.detail.fileType == 3) {
            getListfile($scope.detail.transactionId);
        }
        $('input.form-control, textarea.form-control').addClass('md-has-value');
        $timeout(function () {
            $('#modal-lg-detail').modal('show');
        }, 200);
    }
    function getListfile(transactionId) {
        ordersService.getListFileName(transactionId).then(function (response) {
            $scope.imageUrls = response.data;
        },
            function (err) {
                Notification.error('Vui lòng kiểm tra lại.');
                hideLoader();
            });
    }
    var calculateSubTotal = function () {
        $scope.detail.subTotal = $scope.detail.quantity * $scope.detail.price;
    };
    var calculateTotal = function () {
        $scope.order.total = 0;
        angular.forEach($scope.orderDetail, function (value, key) {
            $scope.order.total = $scope.order.total + value.subTotal;
        });
    };
    $scope.$watch('order', calculateTotal, true);
    $scope.$watch('detail', calculateSubTotal, true);
    $scope.deleteDetail = function (detail) {
        var index = $scope.orderDetail.indexOf(detail);
        $scope.orderDetail.splice(index, 1)
    }
    $scope.createOrder = function () {
        $scope.order = {
            id: 0,
            question: '',
            answer: '',
        };
        $timeout(function () {
            $('#modal-orderpage').modal('show');
        }, 200);
    };

    $('body').delegate('.edit-customer', 'click', function (e) {
        e.preventDefault();
        var data = table.row($(this).parents('tr')).data();
        customerService.getcustomerById(data.customerId).then(function (response) {
            $scope.customer = response.data;
        },
			function (err) {
			    $scope.waringMessage = "Vui lòng kiểm tra lại";
			});
        $('input.form-control, textarea.form-control').addClass('md-has-value');
        $timeout(function () {
            $('#modal-lg-customer').modal('show');

        }, 200);
    });
    $scope.saveCustomer = function () {
        customerService.savecustomer($scope.customer).then(function (response) {
            Notification.success("Lưu thành công");
            $('#order-table').DataTable().ajax.reload();
            $('#modal-lg-customer').modal('hide');
        },
			function (err) {
			    $scope.waringMessage = "Vui lòng kiểm tra lại";
			});
    };
}]);