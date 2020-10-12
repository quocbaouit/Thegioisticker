'use strict';
thegioistickerAdmin.controller('employeeController', ['$scope', 'customerService', 'Notification', '$timeout', '$location', 'authService', 'employeeService', function ($scope, customerService, Notification, $timeout, $location, authService, employeeService) {
    var table = {};
    $scope.customer = {};
    $scope.initTable = function () {
        showLoading();
        table = $('#employee-table').DataTable({
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
            ajax: "api/employee/getPagingEmployees",
            initComplete: function () {
                hideLoading();
                var api = this.api(),
                    searchBox = $('#customers-search-input');
                if (searchBox.length > 0) {
                    searchBox.on('keyup', function (event) {
                        api.search(event.target.value).draw();
                    });
                }
            },
            columns: [
                { "data": "id", filterable: false, sortable: false, visible: false, },
                { "data": "fullName" },
                { "data": "email" },
                { "data": "address" },
                { "data": "phoneNumber" },
                { "data": "roleName" },
                {
                    "data": null, sortable: false, "targets": -1, "defaultContent": " <button type=\"button\" class=\"btn btn-icon edit-employee\" aria-label=\"Product details\"><i class=\"icon icon-pencil s-4\"></i></button>",
                },
                {
                    "data": null, sortable: false, "targets": -2, "defaultContent": " <button type=\"button\" class=\"btn btn-icon delete-employee\" aria-label=\"Product details\"><i class=\"icon icon-delete-circle s-4\"></i></button>",
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
    $('body').delegate('.edit-employee', 'click', function (e) {
        e.preventDefault();
        var data = table.row($(this).parents('tr')).data();
        $scope.registration = data;
        if ($scope.registration.roleName == 'Quản Trị Hệ Thống') {
            $scope.registration.role = 'admin';
        }
        if ($scope.registration.roleName == 'Nhân Viên Kinh Doanh') {
            $scope.registration.role = 'business';
        }
        if ($scope.registration.roleName == 'Nhân Viên Viết Bài') {
            $scope.registration.role = 'contentWriter';
        }
        $('input.form-control, textarea.form-control').addClass('md-has-value');
        $timeout(function () {
            $('#modal-employee').modal('show');
        }, 200);
    });
    $scope.saveEmployee= function () {
        employeeService.saveEmployee($scope.customer).then(function (response) {
            $('#employee-table').DataTable().ajax.reload();
            Notification.success("Lưu thành công");
            $('#modal-employee').modal('hide');
        },
			function (err) {
			    $scope.waringMessage = "Vui lòng kiểm tra lại";
			});
    };
    $('body').delegate('.delete-employee', 'click', function (e) {
        e.preventDefault();
        debugger;
        var data = table.row($(this).parents('tr')).data();
        var deleteEmployee = { userId: data.id }
        employeeService.delete(deleteEmployee).then(function (response) {
            Notification.success("Đã xóa thành công");
            $('#employee-table').DataTable().ajax.reload();
        },
			function (err) {
			    $scope.waringMessage = "Vui lòng kiểm tra lại";
			});
    });
    $scope.waringMessage = '';
    $scope.message = "";
    $scope.savedSuccessfully = false;
    $scope.message = "";
    $scope.roles = [
        { value: 'admin', label: 'Quản Trị Hệ Thống' },
        { value: 'business', label: 'Nhân Viên Kinh Doanh' },
        { value: 'contentWriter', label: 'Nhân Viên Viết Bài' },
    ];

    $scope.registration = {
        fullName: "",
        userName: "",
        password: "",
        confirmPassword: "",
        email: "",
        address: "",
        phoneNumber: "",
        role: "admin",
        roleName: "Quản Trị Hệ Thống",
    };
    $scope.registration.role = $scope.roles[0];
    $scope.signUp = function () {
        if ($scope.registration.fullName == '') {
            $scope.waringMessage = "Họ và tên không được trống";
            return;
        }
        if ($scope.registration.userName == '') {
            $scope.waringMessage = "Tên đăng nhập không được trống";
            return;
        }
        var saveEmployee = {
            id: $scope.registration.id,
            fullName: $scope.registration.fullName,
            userName: $scope.registration.userName,
            password: '123456',
            confirmPassword: '123456',
            email: $scope.registration.email,
            address: $scope.registration.address,
            phoneNumber: $scope.registration.phoneNumber,
            role: $scope.registration.role,
            roleName: '',
        };
        if ($scope.registration.role == 'admin' ) {
            saveEmployee.roleName = 'Quản Trị Hệ Thống';
        }
        if ($scope.registration.role == 'business' ) {
            saveEmployee.roleName = 'Nhân Viên Kinh Doanh';
        }
        if ($scope.registration.role == 'contentWriter' ) {
            saveEmployee.roleName = 'Nhân Viên Viết Bài' ;
        }
        authService.saveRegistration(saveEmployee).then(function (response) {
            $scope.waringMessage = "Tạo tài khoản thành công";
            $('#employee-table').DataTable().ajax.reload();
            $timeout(function () {
                $('#modal-employee').modal('hide');
            }, 1000);
        },
            function (response) {
                var errors = [];
                for (var key in response.data.modelState) {
                    for (var i = 0; i < response.data.modelState[key].length; i++) {
                        errors.push(response.data.modelState[key][i]);
                    }
                }
                $scope.waringMessage = "Đã có lỗi xảy ra:" + errors.join(' ');
            });
    };
    $scope.createEmployee = function () {
        $scope.registration = {
            fullName: "",
            userName: "",
            password: "",
            confirmPassword: "",
            email: "",
            address: "",
            phoneNumber: "",
            role: 'admin',
            roleName: "Quản Trị Hệ Thống",
        };
        $timeout(function () {
            $('#modal-employee').modal('show');
        }, 500);
    };
}]);