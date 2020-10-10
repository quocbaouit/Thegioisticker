'use strict';
thegioistickerAdmin.controller('homepageController', ['$scope', '$timeout', '$state', 'productService', '$location', 'authService', function ($scope, $timeout, $state, productService, $location, authService) {
    $('body').delegate('.edit-item1', 'click', function (e) {
        e.preventDefault();
        $state.go('admin.products');
    });
    $('body').delegate('.edit-item2', 'click', function (e) {
        e.preventDefault();
        $state.go('admin.blogs');
    });
    var table = $('#e-commerce-products-table').DataTable({
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
        ajax: "api/products/getPagingProductsRegular",
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
                "data": null, "targets": -1, "defaultContent": " <button type=\"button\" class=\"btn btn-icon edit-item1\" aria-label=\"details\"><i class=\"icon icon-pencil s-4\"></i></button>",
            },
           
        ],
        lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
        pageLength: 10,
        scrollY: 'auto',
        scrollX: false,
        responsive: true,
        autoWidth: false
    });
    //var table1 = $('#e-commerce-products-table1').DataTable({
    //    "language": {
    //        "lengthMenu": "Hiển thị _MENU_ số dòng trên trang",
    //        "zeroRecords": "Không tìm thấy dữ liệu",
    //        "info": "Hiển thị trang _PAGE_ của _PAGES_",
    //        "infoEmpty": "No records available",
    //        "infoFiltered": "(Đã lọc từ _MAX_ trong tổng số dòng)",
    //    },
    //    dom: 'rtip',
    //    processing: true,
    //    serverSide: true,
    //    searching: true,
    //    ordering: true,
    //    paging: true,
    //    ajax: "api/products/getPagingProductsHightLight",
    //    initComplete: function () {
    //        var api = this.api(),
    //            searchBox = $('#products-search-input');
    //        if (searchBox.length > 0) {
    //            searchBox.on('keyup', function (event) {
    //                api.search(event.target.value).draw();
    //            });
    //        }
    //    },
    //    columns: [
    //        { "data": "id", filterable: false, sortable: false },
    //        {
    //            "data": "image",
    //            render: function (data, type) {
    //                if (type === 'display') {
    //                    return '<img style="width:100px;height:100px" src="' + data + '" alt="Girl in a jacket">';
    //                }
    //                return data;
    //            }
    //        },
    //        { "data": "name" },
    //        { "data": "price" },
    //        {
    //            "data": "isActive",
    //            render: function (data, type) {
    //                if (type === 'display') {
    //                    if (data === true) {
    //                        return '<i class="icon-checkbox-marked-circle text-success"></i>';
    //                    }
    //                    return '<i class="icon-cancel text-danger"></i>';
    //                }
    //                if (type === 'filter') {
    //                    if (data) {
    //                        return '4';
    //                    }
    //                    return '0';
    //                }
    //                return data;
    //            }
    //        },
    //        {
    //            "data": "regularProducts",
    //            render: function (data, type) {
    //                if (type === 'display') {
    //                    if (data === true) {
    //                        return '<i class="icon-checkbox-marked-circle text-success"></i>';
    //                    }
    //                    return '<i class="icon-cancel text-danger"></i>';
    //                }
    //                if (type === 'filter') {
    //                    if (data) {
    //                        return '5';
    //                    }
    //                    return '0';
    //                }
    //                return data;
    //            }
    //        },
    //        {
    //            "data": "highlightProduct",
    //            render: function (data, type) {
    //                if (type === 'display') {
    //                    if (data === true) {
    //                        return '<i class="icon-checkbox-marked-circle text-success"></i>';
    //                    }
    //                    return '<i class="icon-cancel text-danger"></i>';
    //                }
    //                if (type === 'filter') {
    //                    if (data) {
    //                        return '6';
    //                    }
    //                    return '0';
    //                }
    //                return data;
    //            }
    //        },
    //        {
    //            "data": null, "targets": -1, "defaultContent": " <button type=\"button\" class=\"btn btn-icon edit-item1\" aria-label=\"details\"><i class=\"icon icon-pencil s-4\"></i></button>",
    //        },
           
    //    ],
    //    lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
    //    pageLength: 10,
    //    scrollY: 'auto',
    //    scrollX: false,
    //    responsive: true,
    //    autoWidth: false
    //});
    var table2 = $('#e-commerce-products-table2').DataTable({
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
        ajax: "api/blog/getPagingBlogsForHomePage",
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
                "data": null, sortable: false, "targets": -1, "defaultContent": " <button type=\"button\" class=\"btn btn-icon edit-item2\" aria-label=\"Product details\"><i class=\"icon icon-pencil s-4\"></i></button>",
            },
        ],
        lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
        pageLength: 10,
        scrollY: 'auto',
        scrollX: false,
        responsive: true,
        autoWidth: false
    });
    $('#e-commerce-products-table3').DataTable(
            {
                dom: 'rtip',
                columnDefs: [
                    {
                        // Target the id column
                        targets: 0,
                        width: '72px'
                    },
                    {
                        // Target the actions column
                        targets: 7,
                        responsivePriority: 1,
                        filterable: false,
                        sortable: false
                    }
                ],
                columnDefs: [
                    {
                        // Target the id column
                        targets: 0,
                        width: '72px'
                    },
                    {
                        // Target the actions column
                        targets: 7,
                        responsivePriority: 1,
                        filterable: false,
                        sortable: false
                    }
                ],
                columnDefs: [
                    {
                        // Target the id column
                        targets: 0,
                        width: '72px'
                    },
                    {
                        // Target the image column
                        targets: 1,
                        filterable: false,
                        sortable: false,
                        width: '80px'
                    },
                    {
                        // Target the price column
                        targets: 4,
                        render: function (data, type) {
                            if (type === 'display') {
                                return '<div class="layout-align-start-start layout-row">' + '<i class="s-4 icon-currency-usd text-muted"></i>' + '<span>' + data + '</span>' + '</div>';
                            }

                            return data;
                        }
                    },
                    {
                        // Target the quantity column
                        targets: 5,
                        render: function (data, type) {
                            if (type === 'display') {
                                if (parseInt(data) <= 5) {
                                    return '<i class="quantity-indicator icon-circle s-3 text-danger mr-1"></i><span>' + data + '</span>';
                                }
                                else if (parseInt(data) > 5 && parseInt(data) <= 25) {
                                    return '<i class="quantity-indicator icon-circle s-3 text-info mr-1"></i><span>' + data + '</span>';
                                }
                                else {
                                    return '<i class="quantity-indicator icon-circle s-3 text-success mr-1"></i><span>' + data + '</span>';
                                }
                            }

                            return data;
                        }
                    },
                    {
                        // Target the status column
                        targets: 6,
                        filterable: false,
                        render: function (data, type) {
                            if (type === 'display') {
                                if (data === 'true') {
                                    return '<i class="icon-checkbox-marked-circle text-success"></i>';
                                }

                                return '<i class="icon-cancel text-danger"></i>';
                            }

                            if (type === 'filter') {
                                if (data) {
                                    return '1';
                                }

                                return '0';
                            }

                            return data;
                        }
                    },
                    {
                        // Target the actions column
                        targets: 7,
                        responsivePriority: 1,
                        filterable: false,
                        sortable: false
                    }
                ],
                initComplete: function () {
                    var api = this.api(),
                        searchBox = $('#products-search-input');

                    // Bind an external input as a table wide search box
                    if (searchBox.length > 0) {
                        searchBox.on('keyup', function (event) {
                            api.search(event.target.value).draw();
                        });
                    }
                },
                lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
                pageLength: 10,
                scrollY: 'auto',
                scrollX: false,
                responsive: true,
                autoWidth: false
            }
        );
    $('#e-commerce-products-table4').DataTable(
            {
                dom: 'rtip',
                columnDefs: [
                    {
                        // Target the id column
                        targets: 0,
                        width: '72px'
                    },
                    {
                        // Target the actions column
                        targets: 7,
                        responsivePriority: 1,
                        filterable: false,
                        sortable: false
                    }
                ],
                columnDefs: [
                    {
                        // Target the id column
                        targets: 0,
                        width: '72px'
                    },
                    {
                        // Target the actions column
                        targets: 7,
                        responsivePriority: 1,
                        filterable: false,
                        sortable: false
                    }
                ],
                columnDefs: [
                    {
                        // Target the id column
                        targets: 0,
                        width: '72px'
                    },
                    {
                        // Target the image column
                        targets: 1,
                        filterable: false,
                        sortable: false,
                        width: '80px'
                    },
                    {
                        // Target the price column
                        targets: 4,
                        render: function (data, type) {
                            if (type === 'display') {
                                return '<div class="layout-align-start-start layout-row">' + '<i class="s-4 icon-currency-usd text-muted"></i>' + '<span>' + data + '</span>' + '</div>';
                            }

                            return data;
                        }
                    },
                    {
                        // Target the quantity column
                        targets: 5,
                        render: function (data, type) {
                            if (type === 'display') {
                                if (parseInt(data) <= 5) {
                                    return '<i class="quantity-indicator icon-circle s-3 text-danger mr-1"></i><span>' + data + '</span>';
                                }
                                else if (parseInt(data) > 5 && parseInt(data) <= 25) {
                                    return '<i class="quantity-indicator icon-circle s-3 text-info mr-1"></i><span>' + data + '</span>';
                                }
                                else {
                                    return '<i class="quantity-indicator icon-circle s-3 text-success mr-1"></i><span>' + data + '</span>';
                                }
                            }

                            return data;
                        }
                    },
                    {
                        // Target the status column
                        targets: 6,
                        filterable: false,
                        render: function (data, type) {
                            if (type === 'display') {
                                if (data === 'true') {
                                    return '<i class="icon-checkbox-marked-circle text-success"></i>';
                                }

                                return '<i class="icon-cancel text-danger"></i>';
                            }

                            if (type === 'filter') {
                                if (data) {
                                    return '1';
                                }

                                return '0';
                            }

                            return data;
                        }
                    },
                    {
                        // Target the actions column
                        targets: 7,
                        responsivePriority: 1,
                        filterable: false,
                        sortable: false
                    }
                ],
                initComplete: function () {
                    var api = this.api(),
                        searchBox = $('#products-search-input');

                    // Bind an external input as a table wide search box
                    if (searchBox.length > 0) {
                        searchBox.on('keyup', function (event) {
                            api.search(event.target.value).draw();
                        });
                    }
                },
                lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
                pageLength: 10,
                scrollY: 'auto',
                scrollX: false,
                responsive: true,
                autoWidth: false
            }
        );
}]);