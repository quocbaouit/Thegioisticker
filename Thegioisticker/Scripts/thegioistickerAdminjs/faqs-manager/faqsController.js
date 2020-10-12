'use strict';
thegioistickerAdmin.controller('faqsController', ['$scope', '$timeout', 'Notification', 'faqService', '$state', '$location', 'authService', function ($scope, $timeout, Notification, faqService, $state, $location, authService) {
    var table = {};
    $scope.faq = {};
    $scope.initTable = function () {
        showLoading();
         table = $('#faq-table').DataTable({
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
            ajax: "api/faq/getPagingFaqs",
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
                { "data": "question" },
                { "data": "answer" },
                {
                    "data": null, sortable: false, "targets": -1, "defaultContent": " <button type=\"button\" class=\"btn btn-icon edit-faq\" aria-label=\"Product details\"><i class=\"icon icon-pencil s-4\"></i></button>",
                },
                {
                    "data": null, sortable: false, "targets": -2, "defaultContent": " <button type=\"button\" class=\"btn btn-icon delete-faq\" aria-label=\"Product details\"><i class=\"icon icon-delete-circle s-4\"></i></button>",
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
    $('body').delegate('.edit-faq', 'click', function (e) {
        e.preventDefault();
        var data = table.row($(this).parents('tr')).data();
        $scope.faq = data;
        $('input.form-control, textarea.form-control').addClass('md-has-value');
        $timeout(function () {
            $('#modal-faq').modal('show');
        }, 200);     
    });
    $scope.saveFaq = function () {
        faqService.savefaq($scope.faq).then(function (response) {
            $('#faq-table').DataTable().ajax.reload();
            Notification.success("Lưu thành công");
            $('#modal-faq').modal('hide');
        },
			function (err) {
			    $scope.waringMessage = "Vui lòng kiểm tra lại";
			});
    };
    $('body').delegate('.delete-faq', 'click', function (e) {
        e.preventDefault();
        var data = table.row($(this).parents('tr')).data();
        faqService.delete(data).then(function (response) {
            Notification.success("Đã xóa thành công");
            $('#faq-table').DataTable().ajax.reload();
        },
			function (err) {
			    $scope.waringMessage = "Vui lòng kiểm tra lại";
			});
    });
    $scope.createFaq = function () {
        $scope.faq = {
            id: 0,
            question: '',
            answer:'',
        };
        $timeout(function () {
            $('#modal-faq').modal('show');
        }, 200);
    };
}]);