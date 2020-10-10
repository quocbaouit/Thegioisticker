'use strict';
thegioistickerAdmin.controller('customerController', ['$scope', 'customerService', 'Notification', '$timeout', '$location', 'authService', function ($scope, customerService, Notification, $timeout, $location, authService) {
    var table = {};
    $scope.customer = {};
    $scope.initTable = function () {
        table = $('#customer-table').DataTable({
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
            ajax: "api/customer/getPagingCustomers",
            initComplete: function () {
                var api = this.api(),
                    searchBox = $('#customers-search-input');
                if (searchBox.length > 0) {
                    searchBox.on('keyup', function (event) {
                        api.search(event.target.value).draw();
                    });
                }
            },
            columns: [
                { "data": "id", filterable: false, sortable: false },
                { "data": "fullName" },
                { "data": "email" },
                { "data": "address" },
                { "data": "phoneNumber" },
                {
                    "data": null, sortable: false, "targets": -1, "defaultContent": " <button type=\"button\" class=\"btn btn-icon edit-item\" aria-label=\"Product details\"><i class=\"icon icon-pencil s-4\"></i></button>",
                },
                {
                    "data": null, sortable: false, "targets": -2, "defaultContent": " <button type=\"button\" class=\"btn btn-icon delete-item\" aria-label=\"Product details\"><i class=\"icon icon-delete-circle s-4\"></i></button>",
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
    $('body').delegate('.edit-item', 'click', function (e) {
        e.preventDefault();
        var data = table.row($(this).parents('tr')).data();
        $scope.customer = data;
        $('input.form-control, textarea.form-control').addClass('md-has-value');
        $timeout(function () {
            $('#modal-lg').modal('show');
        }, 200);
    });
    $scope.saveCustomer = function () {
        customerService.savecustomer($scope.customer).then(function (response) {
            $('#customer-table').DataTable().ajax.reload();
            Notification.success("Lưu thành công");
            $('#modal-lg').modal('hide');
        },
			function (err) {
			    $scope.waringMessage = "Vui lòng kiểm tra lại";
			});
    };
    $('body').delegate('.delete-item', 'click', function (e) {
        e.preventDefault();
        var data = table.row($(this).parents('tr')).data();
        customerService.delete(data).then(function (response) {
            Notification.success("Đã xóa thành công");
            $('#customer-table').DataTable().ajax.reload();
        },
			function (err) {
			    $scope.waringMessage = "Vui lòng kiểm tra lại";
			});
    });
    $scope.createCustomer = function () {
        $scope.customer = {
            id: 0,
            fullName: '',
            email: '',
            address: '',
            phoneNumber: '',
        };
        $timeout(function () {
            $('#modal-lg').modal('show');
        }, 200);
    };
}]);