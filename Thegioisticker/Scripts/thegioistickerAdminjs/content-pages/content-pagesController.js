'use strict';
thegioistickerAdmin.controller('contentPagesController', ['$scope', '$location', 'authService', '$timeout', '$state', function ($scope, $location, authService, $timeout, $state) {
    var table = {};
    $scope.faq = {};
    $scope.initTable = function () {
        showLoading();
        table = $('#content-table').DataTable({
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
            ajax: "api/contentPage/getPagingContentPages",
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
                { "data": "title" },
                {
                    "data": null, sortable: false, "targets": -1, "defaultContent": " <button type=\"button\" class=\"btn btn-icon edit-contentPage\" aria-label=\"Product details\"><i class=\"icon icon-pencil s-4\"></i></button>",
                },
                //{
                //    "data": null, sortable: false, "targets": -2, "defaultContent": " <button type=\"button\" class=\"btn btn-icon delete-contentPage\" aria-label=\"Product details\"><i class=\"icon icon-delete-circle s-4\"></i></button>",
                //}
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
    $('body').delegate('.edit-contentPage', 'click', function (e) {
        e.preventDefault();
        var data = table.row($(this).parents('tr')).data();
        $state.go('admin.contentedit', { contentId: data.id });
    });
}]);