'use strict';
thegioistickerAdmin.controller('samplesController', ['$scope', 'Notification', '$timeout', '$state', '$location', 'authService', 'sampleService', 'shapeService', function ($scope, Notification, $timeout, $state, $location, authService, sampleService, shapeService) {
    $scope.product = {};
    $scope.shapes = [];
    showLoading();
    //shapeService.getShapes().then(function (results) {
    //    //$scope.shapes = results.data;
    //}, function (error) {
    //    //alert(error.data.message);
    //});
    $scope.shapes = [
        { value: 5, label: 'Hình chữ nhật' },
        { value: 6, label: 'Hình chữ nhật bo góc' },
        { value: 7, label: 'Hình hoa' },
        { value: 3, label: 'Hình vuông' },
        { value: 4, label: 'Hình vuông bo góc' },
        { value: 1, label: 'Hình tròn' },
        { value: 10, label: 'Hình trái tim' },
        { value: 9, label: 'Hình lục giác' },
        { value: 8, label: 'Hình nơ' },
        { value: 2, label: 'Hình oval' },
        { value: 11, label: 'Hình Mẫu 1' },
        { value: 12, label: 'Hình Mẫu 2' },
        { value: 13, label: 'Hình Mẫu 3' },
        { value: 14, label: 'Hình Mẫu 4' },
        { value: 15, label: 'Hình Mẫu 5' },
        { value: 16, label: 'Hình Mẫu 6' }
    ];
    $scope.settingModal = {
        name: 'setting',
        fields:
            [
                { key: 'congty', value: '', text: 'Tên Công Ty' },
                { key: 'sodt', value: '', text: 'Số Điện Thoại' },
                { key: 'email', value: '', text: 'Email' },
                { key: 'diachi', value: '', text: 'Địa Chỉ' },
                { key: 'tieude', value: '', text: 'Tiêu Đề' }
            ]
    };
    var table = $('#sample-table').DataTable({
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
        ajax: "api/samples/getPagingSamples/0",
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
            { "data": "shape.name" },
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
                "data": null, "targets": -1, "defaultContent": " <button type=\"button\" class=\"btn btn-icon edit-sample\" aria-label=\"details\"><i class=\"icon icon-pencil s-4\"></i></button>",
            },
            {
                "data": null, sortable: false, "targets": -2, "defaultContent": " <button type=\"button\" class=\"btn btn-icon delete-sample\" aria-label=\"details\"><i class=\"icon icon-delete-circle s-4\"></i></button>",
            }
        ],
        lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
        pageLength: 10,
        scrollY: 'auto',
        scrollX: false,
        responsive: true,
        autoWidth: false
    });
    $('body').delegate('.edit-sample', 'click', function (e) {
        e.preventDefault();
        var data = table.row($(this).parents('tr')).data();
        $scope.product = data;
        $('input.form-control, textarea.form-control').addClass('md-has-value');
        $timeout(function () {
            $('#modal-sample').modal('show');
        }, 200);
    });
    $scope.saveSample = function () {
        var fv = $('#sample-form').data('formValidation');
        var $container = $('#validate-sample');
        fv.validateContainer($container);
        var isValidStep = fv.isValidContainer($container);
        if (isValidStep === false || isValidStep === null) {
            return false;
        }
        var saveProduct = {
            id: $scope.product.id,
            name: $scope.product.name,
            code: 'sample',
            description: $scope.product.description,
            image: $scope.product.image,
            jsonDesign: JSON.stringify($scope.settingModal),
            regularProducts: true,
            shapeId: $scope.product.shapeId,
            isActive: true,
        };
        sampleService.saveSample(saveProduct).then(function (response) {
            $('#sample-table').DataTable().ajax.reload();
            Notification.success("Lưu thành công");
            $('#modal-sample').modal('hide');
        },
            function (err) {
                $scope.waringMessage = "Vui lòng kiểm tra lại";
            });
    };
    $('body').delegate('.delete-sample', 'click', function (e) {
        e.preventDefault();
        var data = table.row($(this).parents('tr')).data();
        data.isDelete = true;
        sampleService.saveSample(data).then(function (response) {
            Notification.success("Đã xóa thành công");
            $('#sample-table').DataTable().ajax.reload();
        },
            function (err) {
                $scope.waringMessage = "Vui lòng kiểm tra lại";
            });
    });
    $scope.createSample = function () {
        $scope.product = {
            id: 0,
            name: '',
            code: 'sample',
            image: '',
            jsonDesign: '',
            description:'',
            regularProducts: true,
            shapeId: 5,
            isActive: true,
        };
        $timeout(function () {
            $('#modal-sample').modal('show');
        }, 500);
    };
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
        $scope.uploading = true;
        sampleService.uploadFiles($scope)
            .then(function (data) {
                $scope.uploading = false;
                if (data != '') {
                    $scope.product.image = data;
                    Notification.primary('Tải file thành công.');
                    $scope.formdata = new FormData();
                    $scope.data = [];
                    $scope.countFiles = '';
                    $scope.$apply;
                    $scope.saveSample();
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
            $('#sample-form').on('init.field.fv', function (e, data) {
                var $parent = data.element.parents('.form-group'),
                    $icon = data.element.data('fv.icon'),
                    $label = $parent.children('label');
                $icon.insertAfter($label);
            });
            $('#sample-form').formValidation({
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