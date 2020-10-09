'use strict';
thegioistickerApp.controller('productController', ['$scope', '$timeout', 'productService', 'localStorageService', 'Notification', function ($scope, $timeout, productService, localStorageService, Notification) {
    $scope.products = [];
    $scope.numPerPage = 12;
    $scope.noOfPages = 1;
    $scope.currentPage = 1;
    $scope.categoryId = 0;    
    $scope.myselect = {};
    $scope.categories = [];
    productService.getProductCategory().then(function (results) {
        $scope.categories = results.data;  
        $scope.myselect = $scope.categories[0];
        
    }, function (error) {
        //alert(error.data.message);
    });
    $('body').delegate('.categories li', 'click', function (e) {
        e.preventDefault();
        $('.categories li.active').removeClass('active');
        $(this).addClass('active');
    });
    $scope.setPage = function () {
        productService.getProducts($scope.currentPage, $scope.numPerPage, $scope.categoryId).then(function (results) {
            $scope.noOfPages = results.data.pager.totalPages;
            $scope.totalProduct = results.data.pager.totalItems;
            $scope.products = [];
            angular.forEach(results.data.items, function (value, key) {
                var product = {
                    id: value.id,
                    name: value.name,
                    description: value.description,
                    price: value.price,
                    quantity: 1,
                    quantityForView: 1,
                    promotionPrice: value.promotionPrice,
                    total: 0,
                    categoryId: 1,
                    category: 'rau quả',
                    image: value.image,
                    largeImage: value.image
                }
                $scope.products.push(product);
            });
            $("html, body").animate({ scrollTop: 0 }, "slow");
            hideLoader();

        }, function (error) {
            //alert(error.data.message);
        });
       
    };
    $scope.$watch('currentPage', $scope.setPage);
    $scope.searchByCategory = function (categoryId) {
        $scope.categoryId = categoryId;
        $scope.setPage();
    }
    $scope.recentProducts = [];
    if (localStorageService.get('recentProducts') !== null) {
        var products = localStorageService.get('recentProducts').recentProducts;
        $scope.recentProducts = products;
    }
    $('body').delegate('.add-to-cart', 'click', function (e) {
        var cart = $('.shopping-cart');
        var imgtodrag = $(this).parent().parent('.item').find("img").eq(0);
        if (imgtodrag) {
            var imgclone = imgtodrag.clone()
                .offset({
                    top: imgtodrag.offset().top,
                    left: imgtodrag.offset().left
                })
                .css({
                    'opacity': '0.7',
                    'position': 'absolute',
                    'height': '150px',
                    'width': '150px',
                    'z-index': '100'
                })
                .appendTo($('body'))
                .animate({
                    'top': cart.offset().top + 10,
                    'left': cart.offset().left + 10,
                    'width': 75,
                    'height': 75
                }, 1000, 'easeInOutExpo');

            setTimeout(function () {
                cart.effect("shake", {
                    times: 2
                }, 200);
            }, 1500);

            imgclone.animate({
                'width': 0,
                'height': 0
            }, function () {
                $(this).detach()
            });
        }
    });
    $scope.viewDetail = function (seoUlr) {
        window.location.href = '/chi-tiet-san-pham/' + seoUlr + '';
    };
}]);