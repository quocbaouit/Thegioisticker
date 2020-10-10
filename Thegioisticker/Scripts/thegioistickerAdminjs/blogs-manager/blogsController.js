'use strict';
thegioistickerAdmin.controller('blogsController', ['$scope', '$timeout', 'Notification', 'blogService', '$state', '$location', 'authService', function ($scope, $timeout, Notification, blogService, $state, $location, authService) {
    var table = {};
    $scope.blog = {};
    $('#summernote').summernote({
        placeholder: 'Nội Dung',
        tabsize: 2,
        height: 600
    });
    $scope.initTable = function () {
        table = $('#blog-table').DataTable({
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
            ajax: "api/blog/getPagingBlogs",
            initComplete: function () {
                var api = this.api(),
                    searchBox = $('#blogs-search-input');
                if (searchBox.length > 0) {
                    searchBox.on('keyup', function (event) {
                        api.search(event.target.value).draw();
                    });
                }
            },
            columns: [
                { "data": "id", filterable: false, sortable: false },
                { "data": "title" },
                { "data": "author" },
                {
                    "data": "image",
                    render: function (data, type) {
                        if (type === 'display') {
                            return '<img style="width:100px;height:100px" src="' + data + '" alt="">';
                        }
                        return data;
                    }
                },
                { "data": "description" },
                {
                    "data": "isInHomePage",
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
                    "data": null, sortable: false, "targets": -3, "defaultContent": " <button type=\"button\" class=\"btn btn-icon view-content\" aria-label=\"Product details\"><i class=\"icon icon-eye-outline s-4\"></i></button>",
                },
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
        $scope.blog = data;
        var markupStr = $scope.blog.content;
        $('#summernote').summernote('code', markupStr);
        $('input.form-control, textarea.form-control').addClass('md-has-value');
        $timeout(function () {
            $('#modal-lg').modal('show');
        }, 200);
    });
    $scope.saveBlog = function () {
        var markupStr = $('#summernote').summernote('code');
        $scope.blog.content = markupStr;
        blogService.saveblog($scope.blog).then(function (response) {
            $('#blog-table').DataTable().ajax.reload();
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
        blogService.delete(data).then(function (response) {
            Notification.success("Đã xóa thành công");
            $('#blog-table').DataTable().ajax.reload();
        },
			function (err) {
			    $scope.waringMessage = "Vui lòng kiểm tra lại";
			});
    });
    $('body').delegate('.view-content', 'click', function (e) {
        debugger;
        e.preventDefault();
        var data = table.row($(this).parents('tr')).data();
        $("#view-content").empty();
        $("#view-content").append(data.content);
        $timeout(function () {
            $('#modal-lg-content').modal('show');
        }, 200);
    });
    $scope.createBlog = function () {
        $scope.blog = {
            id: 0,
            title: '',
            author: '',
            image: 'ddd',
            content: '',
            description:'',
        };
        $timeout(function () {
            $('#modal-lg').modal('show');
        }, 200);
    };
}]);