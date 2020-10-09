'use strict';
thegioistickerApp.controller('homeController', ['$scope', 'blogService', '$timeout', 'productService', 'localStorageService', 'Notification', 'sampleService', '$compile', 'invoiceService', function ($scope, blogService, $timeout, productService, localStorageService, Notification, sampleService, $compile, invoiceService) {
    $scope.activeHome = true;
    //$scope.samples = [];
    $scope.products = [];
    $scope.regularProducts = [];
    $scope.product = {};
    $scope.selectedSample = {};
    productService.getProductsRegular().then(function (results) {
        $scope.regularProducts = results.data;
    }, function (error) {
    });
    blogService.getBlogForHomePage().then(function (results) {
        $scope.blog1 = results.data[0];
        $scope.blog2 = results.data[1];
    }, function (error) {
    });
    $scope.testimonials = [
        {
            id: 1,
            name: 'Trần Thùy Linh',
            job: 'Account - HCMC',
            testimonial: 'Công nghệ in rất tiên tiến, thiết kế đẹp, mình rất hài lòng. Cảm ơn công ty đã làm rất chuyên nghiệp và tận tâm như vậy.',
            image: '/images/customer1.jpg'
        },
        {
            id: 2,
            name: 'Đỗ Trung',
            job: 'Marketing - HCMC',
            testimonial: 'Mình thực sự rất hài lòng với dịch vụ của công ty Nhanh – đẹp – rẻ. Chúc công ty ngày càng phát triển.',
            image: '/images/customer2.jpg'
        },
        {
            id: 3,
            name: 'Thảo Trương',
            job: 'Graphic Designer - HCMC',
            testimonial: 'Tôi hoàn toàn tin tưởng và hài lòng với chất lượng sản phẩm.',
            image: '/images/customer4.jpg'
        }, {
            id: 4,
            name: 'Anh Ngô Đại',
            job: 'Giáo Viên',
            testimonial: 'Dịch vụ của bạn rất tốt. Tôi rất hài lòng ',
            image: '/images/customer3.jpg'
        }
    ]
    function initSlider(product) {
        $('.detail-slider .slider-for').slick('destroy');
        $('.detail-slider .slider-nav').slick('destroy');
        var divElement = angular.element(document.querySelector('.detail-slider'));
        divElement.empty();
        var sliderFor = '<div class="slider slider-for">';
        angular.forEach(product, function (value, key) {
            sliderFor = sliderFor + '<div class="img-outline ng-scope"><img ng-click="showLibrary(' + value.id + ')" style="cursor:pointer;max-height:395px;" class="img-responsive" src="' + value.image + '"></div>';
        });
        sliderFor = sliderFor + '</div>';
        var sliderNav = '<div class="slider slider-nav img-slider">';
        angular.forEach(product, function (value, key) {
            sliderNav = sliderNav + '<div class="img-small ng-scope"><img  class="img-responsive bd-color-setting" src="' + value.image + '"></div>';
        });
        sliderNav = sliderNav + '</div>';
        var slide = sliderFor + sliderNav;
        var htmlElement = angular.element(slide);
        divElement.append(htmlElement);
        $compile(divElement)($scope);
        $('.detail-slider .slider-for').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            autoplay: true,
            fade: true,
            asNavFor: '.detail-slider .slider-nav'
        });
        $('.detail-slider .slider-nav').slick({
            slidesToShow: 5, // 3,
            slidesToScroll: 1,
            autoplay: true,
            asNavFor: '.detail-slider .slider-for',
            dots: false,
            centerMode: true,
            focusOnSelect: true
        });
    }
    sampleService.getSampleByShapeId(1).then(function (results) {
        $scope.samples = results.data;
        initSlider(results.data);
    }, function (error) {
    });
    sampleService.getAllSample().then(function (results) {
        $scope.samples = results.data;
        $scope.products = $scope.samples;
    }, function (error) {
    });
    $scope.searchByCategory = function (event, categoryId) {
        event.preventDefault();
        $scope.products = $scope.samples;
        $scope.products = $scope.products.filter(function (element) {
            return element.shapeId == categoryId;
        });
        initSlider($scope.products);
    }
    $('body').delegate('.categories li', 'click', function (e) {
        e.preventDefault();
        $('.categories li.active').removeClass('active');
        $(this).addClass('active');
    });
    $scope.viewDetail = function (seoUrl) {
        window.location.href = '/chi-tiet-san-pham/' + seoUrl + '';
    };
    $scope.viewDetailBlog = function (Id) {
        window.location.href = '/thong-tin-chi-tiet?Id=' + Id + '';
    }
    $scope.newLetterText = '';
    $scope.newLetter = function () {
        if ($scope.newLetterText == '') {
            Notification.error('Vui lòng nhập email.');
            return false;

        }
        Notification.success('Đã Đăng ký thành công.');
    }
}]);