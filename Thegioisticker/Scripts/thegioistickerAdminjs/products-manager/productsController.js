'use strict';
thegioistickerAdmin.controller('productsController', ['$scope', 'Notification', '$timeout', '$state', '$location', 'authService', 'productService', function ($scope,Notification, $timeout, $state, $location, authService, productService) {
    $scope.product = {};
    var table = $('#product-table').DataTable({
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
        ajax: "api/products/getPagingProducts",
        initComplete: function () {
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
            {
                "data": "image",
                render: function (data, type) {
                    if (type === 'display') {
                        return '<img style="width:100px;height:100px" src="' + data + '" alt="Girl in a jacket">';
                    }
                    return data;
                }
            },
            { "data": "name" },
            { "data": "price" },
            {
                "data": "isActive",
                render: function (data, type) {
                    if (type === 'display') {
                        if (data === true) {
                            return '<i class="icon-checkbox-marked-circle text-success"></i>';
                        }
                        return '<i class="icon-cancel text-danger"></i>';
                    }
                    if (type === 'filter') {
                        if (data) {
                            return '4';
                        }
                        return '0';
                    }
                    return data;
                }
            },
            {
                "data": "regularProducts",
                render: function (data, type) {
                    if (type === 'display') {
                        if (data === true) {
                            return '<i class="icon-checkbox-marked-circle text-success"></i>';
                        }
                        return '<i class="icon-cancel text-danger"></i>';
                    }
                    if (type === 'filter') {
                        if (data) {
                            return '5';
                        }
                        return '0';
                    }
                    return data;
                }
            },
            {
                "data": "highlightProduct",
                render: function (data, type) {
                    if (type === 'display') {
                        if (data === true) {
                            return '<i class="icon-checkbox-marked-circle text-success"></i>';
                        }
                        return '<i class="icon-cancel text-danger"></i>';
                    }
                    if (type === 'filter') {
                        if (data) {
                            return '6';
                        }
                        return '0';
                    }
                    return data;
                }
            },
            {
                "data": null, "targets": -1, "defaultContent": " <button type=\"button\" class=\"btn btn-icon edit-item\" aria-label=\"details\"><i class=\"icon icon-pencil s-4\"></i></button>",
            },
            {
                "data": null, sortable: false, "targets": -2, "defaultContent": " <button type=\"button\" class=\"btn btn-icon delete-item\" aria-label=\"details\"><i class=\"icon icon-delete-circle s-4\"></i></button>",
            }
        ],
        lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
        pageLength: 10,
        scrollY: 'auto',
        scrollX: false,
        responsive: true,
        autoWidth: false
    });
    $('body').delegate('.edit-item', 'click', function (e) {
        e.preventDefault();
        var data = table.row($(this).parents('tr')).data();
        $scope.product = data;
        $('input.form-control, textarea.form-control').addClass('md-has-value');
        $timeout(function () {
            $('#modal-lg').modal('show');
        }, 200);
    });
    $scope.saveProduct = function () {
        productService.saveProduct($scope.product).then(function (response) {
            $('#product-table').DataTable().ajax.reload();
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
        data.isDelete = true;
        productService.saveProduct(data).then(function (response) {
            Notification.success("Đã xóa thành công");
            $('#product-table').DataTable().ajax.reload();
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
            $('#modal-lg').modal('show');
        }, 200);
    };
}]);