thegioistickerApp.controller("RootController", ['$window', 'localStorageService', 'Notification', 'authService', '$rootScope', '$scope', '$location', '$timeout', 'invoiceService', 'sampleService', 'productService', 'settingService',
    function (
        $window,
        localStorageService,
        Notification,
        authService,
        $rootScope,
        $scope,
        $location,
        $timeout,
        invoiceService,
        sampleService,
        productService,
        settingService
        ) {
        $scope.isShowCart = true;
        if (window.location.pathname == '/gio-hang' || window.location.pathname == '/hoan-tat-don-hang' || window.location.pathname == '/thanh-toan') {
            $scope.isShowCart = false;
        }
        $scope.checkActive = function (url) {
            var baseUrl = window.location.pathname;
            if (baseUrl.toLowerCase() == url.toLowerCase()) return true;
            return false;  
        };
        $scope.numPerPage = 8;
        $scope.noOfPages = 1;
        $scope.currentPage = 1;
        $scope.currentCategory = 1;
        $scope.settings = [];
        $scope.cart = [];
        $scope.shapes = [];
        $scope.subTotal = 0;
        $scope.stickers = [];
        $scope.isLoaded = false;
        $scope.printingCategory = [];
        $scope.shoppingCart = {
            material: {},
            width: '',
            height: '',
            quantity: '',
            machining: {},
            cut: {},
            cutType: '',
            file: ''
        };
        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }
        getRegular();
        if (window.location.pathname == '/' || window.location.pathname == '/thu-vien-decal' || window.location.pathname == '/chi-tiet-san-pham') {
            getInvoice();
        }
        setTimeout(function () {
            //hideLoader();
        }, 1000);
        function getRegular() {
            productService.getProductsRegular().then(function (results) {
                $scope.printingCategory = results.data;  
                $scope.options = results.data;
            }, function (error) {
                //alert(error.data.message);
            });
        }
        function getInvoice() {
            invoiceService.getAllSticker().then(function (results) {
                $scope.stickers = results.data;
                calculateTotals();
            }, function (error) {
            });
        }    
        $scope.calculateCart = function () {
            if (localStorageService.get('shoppingCart') != null) {
                $scope.cart = localStorageService.get('shoppingCart').products;
                $scope.dataCount = $scope.cart.length;
                var total = 0;
                for (var i = 0, len = $scope.cart.length; i < len; i++) {
                    total = total + $scope.cart[i].subTotal;
                }
                $scope.subTotal1 = total;
            }

        };
        $scope.calculateCart();
        $scope.isCreateExtenal = false;
        $scope.authentication = authService.authentication;
        $scope.isHomePage = false;
        if (window.location.pathname == '/' || window.location.pathname == '/home' || window.location.pathname == '/Home' || window.location.pathname == '/home/index' || window.location.pathname == '/Home/Index' || window.location.pathname == '/home/Index' || window.location.pathname == '/Home/index') {
            $scope.isHomePage = true;
        }
        $scope.isActive = function (viewLocation) {
            var result = window.location.pathname.indexOf(viewLocation) == 0;
            return result;
        };
        $scope.removeShoppingCart = function (item) {
            var index = $scope.cart.indexOf(item);
            $scope.cart.splice(index, 1);
            var listProducts = $scope.cart;
            var count = $scope.cart.length;
            $('[data-count]').attr('data-count', count);
            localStorageService.set('shoppingCart', { products: listProducts });
            $scope.calculateCart();
            Notification.primary('Đã xóa khỏi giỏ hàng thành công');
        }
        var calculateTotals = function () {
            var total = 0;
            for (var i = 0, len = $scope.cart.length; i < len; i++) {
                total = total + $scope.cart[i].subTotal;
            }
            $scope.subTotal = total;
            var listProducts = $scope.cart;
            var count = $scope.cart.length;
            $('[data-count]').attr('data-count', count);
            localStorageService.set('shoppingCart', { products: listProducts });
        };
        $scope.$watch('cart', calculateTotals, true);
        $scope.logOut = function () {
            authService.logOut();
            Notification.primary('Bạn đã đăng xuất thành công');
            $location.path('/');
        }
        $scope.showRegisterForm = function () {
            $('.loginBox').fadeOut('fast', function () {
                $('.registerBox').fadeIn('fast');
                $('.login-footer').fadeOut('fast', function () {
                    $('.register-footer').fadeIn('fast');
                });
                $('.modal-title').html('Đăng ký bằng');
            });
            $('.error').removeClass('alert alert-danger').html('');

        }
        $scope.showforgotForm = function () {
            $('.loginBox').fadeOut('fast', function () {
                $('.forgotBox').fadeIn('fast');
                $('.registerBox').fadeOut('fast');
                $('.login-footer').fadeOut('fast', function () {
                    $('.register-footer').fadeIn('fast');
                });
                $('.modal-title').html('Quên mật khẩu');
            });
            $('.error').removeClass('alert alert-danger').html('');

        }
        $scope.showLoginForm = function () {
            $('#loginModal .registerBox').fadeOut('fast', function () {
                $('.forgotBox').fadeOut('fast');
                $('.loginBox').fadeIn('fast');
                $('.register-footer').fadeOut('fast', function () {
                    $('.login-footer').fadeIn('fast');
                });

                $('.modal-title').html('Đăng nhập bằng');
            });
            $('.error').removeClass('alert alert-danger').html('');
        }
        $scope.openLoginModal = function () {
            $scope.showLoginForm();
            setTimeout(function () {
                $('#loginModal').modal('show');
            }, 230);

        }
        $scope.openRegisterModal = function () {
            $scope.showRegisterForm();
            setTimeout(function () {
                $('#loginModal').modal('show');
            }, 230);

        }
        $scope.shakeModal = function (msg) {
            $('#loginModal .modal-dialog').addClass('shake');
            $('.error').addClass('alert alert-danger').html(msg);
            $('input[type="password"]').val('');
            setTimeout(function () {
                $('#loginModal .modal-dialog').removeClass('shake');
            }, 1000);
        }
        //Add To Shopping Card
        $scope.product = {};
        $scope.price = 0;
        $scope.subTotalProduct = 0;
        $scope.square = 0;
        $scope.fileDescription = '';
        $scope.invoicePrintPrice = '';
        $scope.invoiceMachining = '';
        $scope.invoiceCut = '';
       
        $scope.selectedMaterial = '';
        $scope.fileUrl = [];
        $scope.materials = [
            { id:2,value: 'decalsua', label: 'Decal sữa' },
            { id: 3,value: 'decaltrong', label: 'Decal trong' },
            { id: 4,value: 'decalgiay', label: 'Decal giấy' },
            { id: 5,value: 'decalkraft', label: 'Decal Kraft' },
            { id: 6,value: 'decalxi', label: 'Decal xi bạc' },
            { id: 7,value: 'decal7mau', label: 'Decal 7 màu' },
            { id: 8,value: 'tembe', label: 'Tem bảo hành, tem vỡ,tem bế' },
            { id: 20,value: 'decalsuacc', label: 'Decal sữa cao cấp' }
        ];
        $scope.machinings = [
            { value: 'canmang', label: 'Cán màng' },
            { value: 'khongcanmang', label: 'Không cán màng' },
        ];

        $scope.cuts = [
            { value: 'bethang', label: 'Bế thẳng' },
            { value: 'bedd', label: 'Bế đặc biệt(hình tròn, hình khó)' },
        ];
        $scope.fileType = {
            name: 'design'
        };
        $scope.shoppingCart.material = $scope.materials[0];
        $scope.shoppingCart.machining = $scope.machinings[0];
        $scope.shoppingCart.cut = $scope.cuts[0];
        function resetShoppingCart() {
            $scope.shoppingCart = {
                material: {},
                width: '',
                height: '',
                quantity: '',
                machining: {},
                cut: {},
                cutType: '',
                file: ''
            };
            $scope.shoppingCart.material = $scope.materials[0];
            $scope.shoppingCart.machining = $scope.machinings[0];
            $scope.shoppingCart.cut = $scope.cuts[0];
            $scope.subTotalProduct = 0;
            $scope.price = 0;
        }
        $scope.materialChange = function () {
            if ($scope.shoppingCart.material.value == 'tembe' || $scope.shoppingCart.material.value == 'decal7mau' || $scope.shoppingCart.material.value == 'decalxi' || $scope.shoppingCart.material.value == 'decalkraft') {
                $scope.machining = [
                    { value: 'khongcanmang', label: 'Không cán màng' },
                ];
            } else {
                $scope.machining = [
                    { value: 'canmang', label: 'Cán màng' },
                    { value: 'khongcanmang', label: 'Không cán màng' },
                ];
            }
            $scope.shoppingCart.machining = $scope.machining[0];
        }
        var calculateTotals = function () {
            var sticker = {};
            var width = isNaN(parseFloat($scope.shoppingCart.width)) ? 0 : parseFloat($scope.shoppingCart.width);
            var height = isNaN(parseFloat($scope.shoppingCart.height)) ? 0 : parseFloat($scope.shoppingCart.height);
            var quantity = isNaN(parseFloat($scope.shoppingCart.quantity)) ? 0 : parseFloat($scope.shoppingCart.quantity);
            if (width > 0 && height > 0 && quantity > 0) {
                $scope.square = (width * height * quantity) / 1000000;
                sticker = $scope.stickers.find(obj => {
                    return obj.code === $scope.shoppingCart.material.value && obj.squareTo == 0
                });
                if ($scope.square < sticker.squareFrom) {
                    sticker = $scope.stickers.find(obj => {
                        return obj.code === $scope.shoppingCart.material.value && obj.squareFrom <= $scope.square && $scope.square < obj.squareTo
                    });
                }
                var curtainPrice = 0;
                var nonCurtainPrice = 0;
                if ($scope.shoppingCart.machining.value == "canmang") {
                    curtainPrice = sticker.curtainPrice * $scope.square;
                    $scope.price = sticker.curtainPrice;
                } else {
                    curtainPrice = 0;
                }
                if ($scope.shoppingCart.machining.value == "khongcanmang") {
                    var nonCurtainPrice = sticker.noneCurtainPrice * $scope.square;
                    $scope.price = sticker.noneCurtainPrice;
                } else {
                    nonCurtainPrice = 0;
                }
                var specialPrice = $scope.shoppingCart.cut.value == "bedd" ? sticker.specialPrice * $scope.square : 0;
                var noneDefaultPrice = curtainPrice + nonCurtainPrice + specialPrice;
                if (sticker.defaultPrice) {
                    $scope.subTotalProduct = sticker.defaultPrice;
                    $scope.price = sticker.defaultPrice;
                } else {
                    $scope.subTotalProduct = noneDefaultPrice;
                }
            }
        };
        $scope.$watch('shoppingCart', calculateTotals, true);
        function validateCart(cart) {
            var errorMessage = '';
            if (cart.width == 0 || cart.width === '') {
                if (errorMessage != '') {
                    errorMessage = errorMessage + '<br/>';
                }
                errorMessage = errorMessage + 'vui lòng nhập chiều ngang';
            }
            if (cart.height == 0 || cart.height === '') {
                if (errorMessage != '') {
                    errorMessage = errorMessage + '<br/>';
                }
                errorMessage = errorMessage + 'vui lòng nhập chiều cao';
            }
            if (cart.quantity == 0 || cart.quantity === '') {
                if (errorMessage != '') {
                    errorMessage = errorMessage + '<br/>';
                }
                errorMessage = errorMessage + 'vui lòng nhập số lượng';
            }
            if (errorMessage != '') {
                showAlert(errorMessage);
                return false;
            }
            hideAlert();
            return true;
        }
        $scope.addToshoppingCart = function () {
            if (!validateCart($scope.shoppingCart)) {
                return false;
            }
            $scope.product.transactionId = guid();
            $scope.product.id = $scope.shoppingCart.material.id;
            $scope.product.name = $scope.shoppingCart.material.label;
            $scope.product.quantity = $scope.shoppingCart.quantity;
            $scope.product.price = $scope.price;
            $scope.product.subTotal = $scope.subTotalProduct;
            $scope.product.width = $scope.shoppingCart.width;
            $scope.product.height = $scope.shoppingCart.height;
            $scope.product.machining = $scope.shoppingCart.machining.label;
            $scope.product.cut = $scope.shoppingCart.cut.label;
            $scope.product.fileDescription = '';
            $scope.product.fileType = 1;
            $scope.product.fileId = 0;
            $scope.product.settingModal = '';
            $scope.product.image = '';
            var item = $scope.product;
            $scope.cart.push(item);
            var listProducts = $scope.cart;
            localStorageService.set('shoppingCart', { products: listProducts });
            Notification.success("Thêm vào giỏ hàng thành công");
            $scope.calculateCart();
            resetShoppingCart();
        };
        //End To Shopping Card
        //File
        $scope.uploading = false;
        $scope.countFiles = '';
        $scope.data = []; //For displaying file name on browser
        $scope.formdata = new FormData();       
        $scope.getFiles = function (file) {
            var sumSize = 0;
            angular.forEach(file, function (value, key) {
                sumSize = sumSize + value.size;
                var totalSizeMB = sumSize / Math.pow(1024, 2);
                if (totalSizeMB > 100) {
                    Notification("file in quá lớn vui lòng chọn lại");
                    $scope.formdata = new FormData();
                    $scope.data = [];
                    $scope.countFiles = '';
                    $scope.$apply;
                    return false;
                }
                $scope.formdata.append(key, value);
                $scope.data.push({ FileName: value.name, FileLength: value.size });
            });
            $scope.countFiles = $scope.data.length == 0 ? '' : $scope.data.length + ' files selected';
            $scope.$apply();
            $scope.formdata.append('countFiles', $scope.countFiles);

        };
        $scope.uploadFiles = function () {
            if ($scope.cart.length >= 10) {
                Notification.error("Không thể thêm dịch vụ.</br>Có quá nhiều dịch vụ trong đơn hàng này.");
                return false;
            }
            $scope.product.transactionId = guid();
            $scope.uploading = true;
            showLoader();
            productService.uploadFiles($scope)
                .then(function (data) {
                    $scope.uploading = false;
                    if (data === '') {
                        Notification.primary('Tải file thành công.');
                        $scope.formdata = new FormData();
                        $scope.data = [];
                        $scope.countFiles = '';
                        $scope.$apply;
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
        $scope.onFileChange = function (itemSelected) {
            if (itemSelected.value == 1) {
                $('#upload-pupup').modal('show');
            }
            if (itemSelected.value == 2) {
                $('#library-pupup').modal('show');
            }
            if (itemSelected.value == 3) {
                $('#design-pupup').modal('show');
            }

        };
        //End File
    }]);