'use strict';
thegioistickerAdmin.controller('selectSamplesController', ['$scope', 'Notification', '$timeout', '$state', '$location', 'authService', 'sampleService', 'productService', '$stateParams', function ($scope, Notification, $timeout, $state, $location, authService, sampleService, productService, $stateParams) {
    $scope.product = {};
    $scope.productSample = [];
    $scope.productId = $stateParams.productId;
    showLoading();
    var table = {};
    $scope.initTable = function () {
        table = $('#sample-table').DataTable({
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
            ajax: "api/samples/getPagingSamples/" + $scope.productId+"",
            rowCallback: function (row, data) {
                angular.forEach($scope.productSample, function (value, key) {
                    if (value.sampleId == data.id)
                        $(row).addClass('selected');
                });
                //if (something == true) {
                //table.row(row).select();
                //}
            },
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
                { "data": "description" },
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
            ],
            lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
            pageLength: 10000,
            scrollY: 'auto',
            scrollX: false,
            responsive: true,
            autoWidth: false
        });
        $('#sample-table tbody').on('click', 'tr', function () {
            $(this).toggleClass('selected');
        });
    }
    $('body').delegate('.edit-sample', 'click', function (e) {
        e.preventDefault();
        var data = table.row($(this).parents('tr')).data();
        $scope.product = data;
        $('input.form-control, textarea.form-control').addClass('md-has-value');
        $timeout(function () {
            $('#modal-sample').modal('show');
        }, 200);
    });
    $scope.saveProductSample = function () {
        //if (table.rows('.selected').data().length == 0) {
        //    Notification.error("Vui lòng chọn mẫu");
        //    return;
        //}
        showLoading();
        var productSample = [];
        angular.forEach(table.rows('.selected').data(), function (value, key) {            
            var saveObj = { productId: $scope.productId, sampleId: value.id }
            productSample.push(saveObj);
        });
        productService.createProductSample(productSample).then(function (response) {
            Notification.success("Lưu thành công");
            $state.go('admin.products');
        }, function (err) {
                Notification.error("Vui lòng kiểm tra lại");
                hideLoading();
            });
    };
    $scope.back = function () {
            $state.go('admin.products');
    };
    //productService.getProductSamplesByProductId($scope.productId).then(function (results) {
    //    $scope.productSample = results.data;
    //    $scope.initTable();

    //}, function (error) {
    //    //alert(error.data.message);
    //});
    productService.getProductById($scope.productId).then(function (results) {
        $scope.product = results.data;
        $scope.productSample = results.data.productSample;
        $scope.initTable();
    }, function (error) {
        //alert(error.data.message);
    });

}]);