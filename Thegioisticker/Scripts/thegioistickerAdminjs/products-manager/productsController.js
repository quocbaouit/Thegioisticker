'use strict';
thegioistickerAdmin.controller('productsController', ['$scope', 'Notification', '$timeout', '$state', '$location', 'authService', 'productService', function ($scope,Notification, $timeout, $state, $location, authService, productService) {
    $scope.product = {};
    showLoading();
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
            //{ "data": "description" },
            {
                "data": "price",
                render: $.fn.dataTable.render.number(',')
            },
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
            //{
            //    "data": "regularProducts",
            //    render: function (data, type) {
            //        if (type === 'display') {
            //            if (data === true) {
            //                return '<i class="icon-checkbox-marked-circle text-success"></i>';
            //            }
            //            return '<i class="icon-cancel text-danger"></i>';
            //        }
            //        if (type === 'filter') {
            //            if (data) {
            //                return '5';
            //            }
            //            return '0';
            //        }
            //        return data;
            //    }
            //},
            {
                "data": "description",
                render: function (data, type) {
                    if (type === 'display') {
                        return '<a class="edit-description" style="color:green" href="javascript:void(0)">' + 'Mô tả' + '</a>';
                    }
                    return data;
                }

            },
            {
                "data": null,
                render: function (data, type) {
                    if (type === 'display') {
                        return '<a class="select-sample" style="color:green" href="javascript:void(0)">' + 'Chọn Mẫu' + '</a>';
                    }
                    return data;
                }

            },
            {
                "data": null, "targets": -1, "defaultContent": " <button type=\"button\" class=\"btn btn-icon edit-product\" aria-label=\"details\"><i class=\"icon icon-pencil s-4\"></i></button>",
            },
            {
                "data": null, sortable: false, "targets": -2, "defaultContent": " <button type=\"button\" class=\"btn btn-icon delete-product\" aria-label=\"details\"><i class=\"icon icon-delete-circle s-4\"></i></button>",
            }
        ],
        lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
        pageLength: 10,
        scrollY: 'auto',
        scrollX: false,
        responsive: true,
        autoWidth: false,
    });
    $('body').delegate('.edit-product', 'click', function (e) {
        e.preventDefault();
        var data = table.row($(this).parents('tr')).data();
        $scope.product = data;
        $('input.form-control, textarea.form-control').addClass('md-has-value');
        $timeout(function () {
            $('#modal-product').modal('show');
        }, 200);
    });
    $scope.saveProduct = function () {
        if (!$scope.hasUpload) {
            var fv = $('#product-form').data('formValidation');
            var $container = $('#validate-product');
            fv.validateContainer($container);
            var isValidStep = fv.isValidContainer($container);
            if (isValidStep === false || isValidStep === null) {
                return false;
            }

        }
        showLoading();
        productService.saveProduct($scope.product).then(function (response) {          
            $('#product-table').DataTable().ajax.reload();
            Notification.success("Lưu thành công");
            $('#modal-product').modal('hide');
            hideLoading();
            
        },
			function (err) {
			    $scope.waringMessage = "Vui lòng kiểm tra lại";
            });
        $scope.hasUpload = false;
    };
    $('body').delegate('.delete-product', 'click', function (e) {
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
            seoUrl: '',
            metaTitle: '',
            metaDescription:'',
            price: 0,
            promotionPrice: 0,
            productCategoryId:1,
            isActive: true,
        };
        $timeout(function () {
            $('#modal-product').modal('show');
        }, 200);
    };
    $('body').delegate('.edit-description', 'click', function (e) {
        e.preventDefault();
        var data = table.row($(this).parents('tr')).data();
        $state.go('admin.productdescription', { productId: data.id });
    });
    $('body').delegate('.select-sample', 'click', function (e) {
        e.preventDefault();
        var data = table.row($(this).parents('tr')).data();
        $state.go('admin.selectsamples', { productId: data.id });
    });
   
    //File
    $scope.uploading = false;
    $scope.countFiles = '';
    $scope.hasUpload = false;
    $scope.data = []; //For displaying file name on browser
    $scope.formdata = new FormData();
    $scope.getFiles = function (file) {
        angular.forEach(file, function (value, key) {
            $scope.formdata.append(key, value);
            $scope.data.push({ FileName: value.name, FileLength: value.size });

        });
        $scope.countFiles = $scope.data.length == 0 ? '' : $scope.data.length + ' files selected';
        $scope.hasUpload = true;
        $scope.$apply();
        $scope.formdata.append('countFiles', $scope.countFiles);

    };
    $scope.setFiles = function (element) {
        $scope.$apply(function (scope) {
            $scope.files = [];
            for (var i = 0; i < element.files.length; i++) {
                scope.files.push(element.files[i])
            }
        });
    };
    $scope.uploadFiles = function () {
        //var fv = $('#f1').data('formValidation');
        //var $container = $('#f1-step1');
        //fv.validateContainer($container);
        //var isValidStep = fv.isValidContainer($container);
        //if (isValidStep === false || isValidStep === null) {
        //    return false;
        //}
        $scope.uploading = true;
        productService.uploadFiles($scope)
            .then(function (data) {
                $scope.uploading = false;
                if (data != '') {
                    $scope.product.image = data;
                    Notification.primary('Tải file thành công.');
                    $scope.formdata = new FormData();
                    $scope.data = [];
                    $scope.countFiles = '';
                    $scope.$apply;
                    $scope.saveProduct();
                } else {
                    Notification.error('Đã có lỗi xảy ra.');
                    console.log(data);
                }
            }, function (error) {
                $scope.uploading = false;
                Notification.error('Đã có lỗi xảy ra.');
                console.log(error);
            }
            );
    };

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#picture').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#imgInp").change(function () {
        readURL(this);
    });
    //End File

    //validation
    initValidate();
    function initValidate() {
        $timeout(function () {
            $('#product-form').on('init.field.fv', function (e, data) {
                var $parent = data.element.parents('.form-group'),
                    $icon = data.element.data('fv.icon'),
                    $label = $parent.children('label');
                $icon.insertAfter($label);
            });
            $('#product-form').formValidation({
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
                    seoUrl: {
                        validators: {
                            notEmpty: { message: 'Vui lòng nhập seoUrl' }
                        }
                    },
                    metaTitle: {
                        validators: {
                            notEmpty: { message: 'Vui lòng nhập metaTitle' }
                        }
                    },
                    metaDescription: {
                        validators: {
                            notEmpty: { message: 'Vui lòng nhập metaDescription' }
                        }
                    },
                    price: {
                        validators: {
                            notEmpty: { message: 'Vui lòng nhập giá' },
                            callback: {
                                message: 'Giá phải lớn hơn 0',
                                callback: function (value, validator, $field) {
                                    if (parseFloat(value) > 0) {
                                        return true;
                                    }
                                    return false;
                                }
                            }
                        }
                    },
                    // file: {
                    //     validators: {
                    //         notEmpty: { message: 'Vui lòng chọn file.' },
                    //        callback: {
                    //            message: 'Vui lòng chọn file.',
                    //            callback: function (value, validator, $field) {
                    //                debugger;
                    //                if ($scope.countFiles != '') {
                    //                    return true;
                    //                }
                    //                return false;
                    //            }
                    //        }
                    //    }
                    //}
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