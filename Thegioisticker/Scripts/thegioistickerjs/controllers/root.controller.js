thegioistickerApp.controller("RootController", ['$window', 'localStorageService', 'Notification', 'authService', '$rootScope', '$scope', '$location', '$timeout', 'invoiceService', 'sampleService', 'productService',
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
        productService     
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
        $scope.menus = [
            {
                name: 'CÁC SẢN PHẨM TEM', url: '/sticker', childs: [
                    { name: 'Tem nhãn decal giấy', url: '/decal-giay' },
                    { name: 'Tem nhãn decal giấy kraft', url: '/decal-draft' },
                    { name: 'Tem nhãn decal nhựa sữa', url: '/decal-nhua-sua' },
                    { name: 'Tem nhãn decal nhựa sữa cao cấp', url: '/decal-nhua-cao-cap' },
                    { name: 'Tem nhãn decal nhựa trong', url: 'decal-nhua-trong' },
                    { name: 'Tem nhãn decal xi bạc', url: 'decal-xi-bac' },
                    { name: 'Tem nhãn decal xi vàng', url: 'decal-xi-vang' },
                    { name: 'Tem nhãn decal bảy màu', url: 'decal-bay-mau' },
                    { name: 'Tem bảo hành-tem bể-tem vỡ', url: '/tem-bao-hanh' },
                    { name: 'Decal metalize', url: 'decal-metalize' },
                    { name: 'Tem nhãn decal 1 màu đen', url: 'decal-mau-den' }
                ]
            },
            { name: 'THƯ VIỆN ONLINE', url: '/sticker-online', childs: [] },
            { name: 'CÁC SẢN PHẨM KHÁC', url: '/san-pham-in', childs: [{ name: 'Túi giấy', url: '/tui-giay' }, { name: 'In pp', url: '/in-pp' }] },
            { name: 'KHUYẾN MÃI', url: '/khuyen-mai', childs: [] },
            { name: 'TRỢ GIÚP', url: '/tro-giup', childs: [] },
            { name: 'LIÊN HỆ', url: '/lien-he', childs: [] }
        ];
        //getSetting();
        getRegular();
        if (window.location.pathname == '/' || window.location.pathname == '/thu-vien-decal' || window.location.pathname == '/chi-tiet-san-pham') {
            getShape();
            getInvoice();
            getSample();
        }
        setTimeout(function () {
            //hideLoader();
        }, 1000);
        function getSetting() {
            settingService.getsettings().then(function (results) {
                $scope.settings = results.data;              
            }, function (error) {
                //alert(error.data.message);
            });
        }
        function getRegular() {
            productService.getProductsRegular().then(function (results) {
                $scope.printingCategory = results.data;  
                $scope.options = results.data;
                if ($scope.shoppingCart.material.id == undefined)
                $scope.shoppingCart.material = $scope.options[0];
            }, function (error) {
                //alert(error.data.message);
            });
        }
        function getShape() {
            $scope.shapes =
                [
                  { id: 1, name: 'Hình Tròn', code: 'hinhtron', image: '/images/shapes/hinhtron.png' }
                , { id: 2, name: 'Hình Oval', code: 'hinhoval', image: '/images/shapes/hinhoval.png' }
                , { id: 3, name: 'Hình Vuông', code: 'hinhvuong', image: '/images/shapes/hinhvuong.png' }
                , { id: 4, name: 'Hình Vuông Bo Góc', code: 'hinhvuongbogoc', image: '/images/shapes/hinhvuongbogoc.png' }
                , { id: 5, name: 'Hình Chữ Nhật', code: 'hinhchunhat', image: '/images/shapes/hinhchunhat.png' }
                , { id: 6, name: 'Hình Chữ Nhật Bo Góc', code: 'hinhchunhatbogoc', image: '/images/shapes/hinhchunhatbogoc.png' }
                , { id: 7, name: 'Hình Hoa', code: 'hinhhoa', image: '/images/shapes/hinhhoa.png' }
                , { id: 8, name: 'Hình Nơ', code: 'hinhno', image: '/images/shapes/hinhno.png' }
                , { id: 9, name: 'Hình Lục Giác', code: 'hinhlucgiac', image: '/images/shapes/hinhlucgiac.png' }
                , { id: 10, name: 'Hình Trái Tim', code: 'hinhtraitim', image: '/images/shapes/hinhtraitim.png' }
                , { id: 11, name: 'Hình Mẫu 1', code: 'hinhmau1', image: '/images/shapes/hinhmau1.png' }
                , { id: 12, name: 'Hình Mẫu 2', code: 'hinhmau2', image: '/images/shapes/hinhmau2.png' }
                , { id: 13, name: 'Hình Mẫu 3', code: 'hinhmau3', image: '/images/shapes/hinhmau3.png' }
                , { id: 14, name: 'Hình Mẫu 4', code: 'hinhmau4', image: '/images/shapes/hinhmau4.png' }
                //, { id: 15, name: 'Hình Mẫu 5', code: 'hinhmau5', image: '/images/shapes/hinhmau5.png' }
                //, { id: 16, name: 'Hình Mẫu 6', code: 'hinhmau6', image: '/images/shapes/hinhmau6.png' }
                ]
            //shapeService.getShapes().then(function (results) {
            //    $scope.shapes = results.data;
            //}, function (error) {
            //    //alert(error.data.message);
            //});
        }
        function getInvoice() {
            invoiceService.getInvoices().then(function (results) {
                $scope.stickers = results.data;
                calculateTotals();
            }, function (error) {
                //alert(error.data.message);
            });
        }    
        function getSample() {
            sampleService.getAllSample().then(function (results) {
                $scope.samples = results.data;
            }, function (error) {
                //alert(error.data.message);
            });

        } 
        if (localStorageService.get('shoppingCart') != null) {
            $scope.cart = localStorageService.get('shoppingCart').products;
            $scope.dataCount = $scope.cart.length;
            var total = 0;
            for (var i = 0, len = $scope.cart.length; i < len; i++) {
                total = total + $scope.cart[i].subTotal;
            }
            $scope.subTotal1 = total;
        }
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
        $scope.samples = [];
        $scope.sampleGalery = [];
        $scope.step = 1;
        $scope.product = {};
        $scope.stickers = [];
        $scope.price = 0;
        $scope.subTotal = 0;
        $scope.square = 0;
        $scope.fileDescription = '';
        $scope.invoicePrintPrice = '';
        $scope.invoiceMachining = '';
        $scope.invoiceCut = '';
       
        $scope.selectedMaterial = '';
        $scope.fileUrl = [];
        $scope.machinings = [
            { value: 'canmangbong', label: 'Cán màng bóng' },
            { value: 'canmangmo', label: 'Cán màng mờ' },
            { value: 'khongcanmang', label: 'Không cán màng' },
        ];
        $scope.cuts = [
            { value: 'bedemi', label: 'Bế demi' },
            { value: 'khongbe', label: 'Không bế' },
        ];
        $scope.fileType = {
            name: 'design'
        };
        $scope.shoppingCart.machining = $scope.machinings[0];
        $scope.shoppingCart.cut = $scope.cuts[0];
        $scope.settingModal = {
            name: 'setting',
            fields:
                [
                    { key: 'congty', value: '', text: 'Tên Công Ty' },
                    { key: 'sodt', value: '', text: 'Số Điện Thoại' },
                    { key: 'email', value: '', text: 'Email' },
                    { key: 'diachi', value: '', text: 'Địa Chỉ' },
                    { key: 'ghichu', value: '', text: 'Ghi Chú' }
                ]
        };             
        function getA4quantity(width, height, quantity) {
            return Math.ceil(parseFloat((width * height / 60000 * quantity)).toFixed(2));
        }
        var calculateTotals = function () {
            $scope.invoicePrintPrice = '';
            $scope.invoiceMachining = '';
            $scope.invoiceCut = '';
            $scope.subTotal = '';
            $scope.price = $scope.subTotal / quantity;
            var sticker = {};
            var invoicePrintPrice = 0;
            var invoiceMachining = 0;
            var invoiceCut = 0;
            var invoiceMaterialPrice = $scope.shoppingCart.material.price;
            var width = isNaN(parseFloat($scope.shoppingCart.width)) ? 0 : parseFloat($scope.shoppingCart.width);
            var height = isNaN(parseFloat($scope.shoppingCart.height)) ? 0 : parseFloat($scope.shoppingCart.height);
            var quantity = isNaN(parseFloat($scope.shoppingCart.quantity)) ? 0 : parseFloat($scope.shoppingCart.quantity);
            if (width > 0 && height > 0 && quantity > 0) {
                var a4quantity = getA4quantity(width, height, quantity);
                sticker = $scope.stickers.find(function (element) {
                    return element.quantity == a4quantity;
                });
                if (sticker == undefined) {
                    invoicePrintPrice = 1320;
                    invoiceCut = 1800;
                    invoiceMachining = 330;
                    invoiceMaterialPrice = $scope.shoppingCart.material.price;
                } else {
                    invoicePrintPrice = sticker.printPrice;
                    invoiceCut = sticker.cutPrice;
                    invoiceMachining = sticker.machiningPrice;
                    invoiceMaterialPrice = $scope.shoppingCart.material.price;
                }
                if ($scope.shoppingCart.machining.value == "khongcanmang") {
                    invoiceMachining = 0;
                }
                if ($scope.shoppingCart.cut.value == "khongbe") {
                    invoiceCut = 0;
                }
                $scope.invoicePrintPrice = (invoicePrintPrice + invoiceMaterialPrice) * a4quantity;
                $scope.invoiceMachining = invoiceMachining * a4quantity;
                $scope.invoiceCut = invoiceCut * a4quantity;
                $scope.subTotal = (invoicePrintPrice + invoiceMaterialPrice + invoiceMachining + invoiceCut) * a4quantity;
                $scope.price = $scope.subTotal / quantity;
            }
        };
        $scope.$watch('shoppingCart', calculateTotals, true);
        $scope.addToshoppingCartFromSample = function (fileId) {
            if ($scope.cart.length >= 10) {
                Notification.error("Không thể thêm dịch vụ.</br>Có quá nhiều dịch vụ trong đơn hàng này.");
                return false;
            }
            var fv = $('#f2').data('formValidation');
            var $container = $('#f2-step2');
            fv.validateContainer($container);
            var isValidStep = fv.isValidContainer($container);
            if (isValidStep === false || isValidStep === null) {
                return false;
            }
            $scope.product.transactionId = guid();
            $scope.product.id = $scope.shoppingCart.material.id;
            $scope.product.name = $scope.shoppingCart.material.name;
            $scope.product.quantity = $scope.shoppingCart.quantity;
            $scope.product.price = $scope.price;
            $scope.product.subTotal = $scope.subTotal;
            $scope.product.width = $scope.shoppingCart.width;
            $scope.product.height = $scope.shoppingCart.height;
            $scope.product.machining = $scope.shoppingCart.machining.label;
            $scope.product.cut = $scope.shoppingCart.cut.label;
            $scope.product.cutType = $scope.shoppingCart.cutType.label;
            $scope.product.fileType = consSampple;
            $scope.product.fileId = fileId;
            $scope.product.fileDescription = '';
            $scope.product.settingModal = JSON.stringify($scope.settingModal);
            $scope.product.image = getSampleImageBySampleId(fileId).image;

            var item = $scope.product;
            $scope.cart.push(item);
            var listProducts = $scope.cart;
            var count = $scope.cart.length;
            $('[data-count]').attr('data-count', count);
            localStorageService.set('shoppingCart', { products: listProducts });
            window.location.href = "/gio-hang";
        };
        function getSampleImageBySampleId(sampleId) {
            return $scope.samples.find(function (element) {
                return element.id == sampleId;
            });
        }
        $scope.addToshoppingCartFromDesign = function () {
            if ($scope.cart.length >= 10) {
                Notification.error("Không thể thêm dịch vụ.</br>Có quá nhiều dịch vụ trong đơn hàng này.");
                return false;
            }
            var fv = $('#f4').data('formValidation');
            var $container = $('#f4-step2');
            fv.validateContainer($container);
            var isValidStep = fv.isValidContainer($container);
            if (isValidStep === false || isValidStep === null) {
                return false;
            }
            $scope.product.transactionId = guid();
            $scope.product.id = $scope.shoppingCart.material.id;
            $scope.product.name = $scope.shoppingCart.material.name;
            $scope.product.quantity = $scope.shoppingCart.quantity;
            $scope.product.price = $scope.price;
            $scope.product.subTotal = $scope.subTotal;
            $scope.product.width = $scope.shoppingCart.width;
            $scope.product.height = $scope.shoppingCart.height;
            $scope.product.machining = $scope.shoppingCart.machining.label;
            $scope.product.cut = $scope.shoppingCart.cut.label;
            $scope.product.cutType = $scope.shoppingCart.cutType.label;
            $scope.product.fileDescription = $scope.fileDescription;
            $scope.product.fileType = consDesign;
            $scope.product.settingModal = '';
            $scope.product.image = '';

            var item = $scope.product;
            $scope.cart.push(item);
            var design = {};
            design.transactionId = $scope.product.transactionId;
            design.id = 19;
            design.name = 'Thiết Kế Theo Yêu Cầu';
            design.quantity = 1;
            design.price = 100000;
            design.subTotal = 100000;
            design.width = 0;
            design.height = 0;
            design.machining = '';
            design.cut = '';
            design.cutType = '';
            design.fileDescription = '';
            design.fileType = 2;
            design.settingModal = '';

            $scope.cart.push(design);
            var listProducts = $scope.cart;
            var count = $scope.cart.length;
            $('[data-count]').attr('data-count', count);
            localStorageService.set('shoppingCart', { products: listProducts });
            window.location.href = "/gio-hang";
        };
        $scope.addToshoppingCartFromUpload = function () {
            $scope.product.id = $scope.shoppingCart.material.id;
            $scope.product.name = $scope.shoppingCart.material.name;
            $scope.product.quantity = $scope.shoppingCart.quantity;
            $scope.product.price = $scope.price;
            $scope.product.subTotal = $scope.subTotal;
            $scope.product.width = $scope.shoppingCart.width;
            $scope.product.height = $scope.shoppingCart.height;
            $scope.product.machining = $scope.shoppingCart.machining.label;
            $scope.product.cut = $scope.shoppingCart.cut.label;
            $scope.product.cutType = $scope.shoppingCart.cutType.label;
            $scope.product.fileDescription = $scope.fileDescription;
            $scope.product.fileType = consUpload;
            $scope.product.fileId = 0;
            $scope.product.settingModal = '';
            $scope.product.image = '';

            var item = $scope.product;
            $scope.cart.push(item);
            var listProducts = $scope.cart;
            var count = $scope.cart.length;
            $('[data-count]').attr('data-count', count);
            localStorageService.set('shoppingCart', { products: listProducts });
            window.location.href = "/gio-hang";
        };
        $scope.shopNow = function () {
            var fv = $('#f1').data('formValidation');
            var $container = $('#f1-step1');
            fv.validateContainer($container);
            var isValidStep = fv.isValidContainer($container);
            if (isValidStep === false || isValidStep === null) {
                return false;
            }
            if ($scope.fileType.name == 'upload') {
                $('#upload-pupup').modal('show');
                return;
            }
            if ($scope.fileType.name == 'sample') {
                $('#library-pupup').modal('show');
                return;
            }
            if ($scope.fileType.name == 'design') {
                $('#design-pupup').modal('show');
                return;
            }
        }
        $scope.showLibrary = function (itemSelected) {
            //$scope.selectedSample = $scope.samples.find(obj => {
            //    return obj.id === itemSelected;
            //});
            $scope.selectedSample = $scope.samples.find(function (element) {
                return element.id == itemSelected;
            });
            $scope.step = 1;
            $('#library-pupup').modal('hide');
            $timeout(function () {
                $('#shopping-pupup').modal('show');
            },500);

        };     
        $scope.nextStep = function () {
            $scope.step = 2;
        }
        $scope.nextStepUpload = function () {
            var fv = $('#f3').data('formValidation');
            var $container = $('#f3-step1');
            fv.validateContainer($container);
            var isValidStep = fv.isValidContainer($container);
            if (isValidStep === false || isValidStep === null) {
                return false;
            }
            $scope.step = 2;
        }
        $scope.prevStep = function () {
            $scope.step = 1;
        };
        $scope.closeModal = function () {
            $scope.step = 1;
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
            var fv = $('#f3').data('formValidation');
            var $container = $('#f3-step2');
            fv.validateContainer($container);
            var isValidStep = fv.isValidContainer($container);
            if (isValidStep === false || isValidStep === null) {
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
                    $scope.addToshoppingCartFromUpload();
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
        //validation
        initValidate();
        function initValidate() {
            $timeout(function () {
                $('#f1').on('init.field.fv', function (e, data) {
                    var $parent = data.element.parents('.form-group'),
                        $icon = data.element.data('fv.icon'),
                        $label = $parent.children('label');
                    $icon.insertAfter($label);
                });
                $('#f1').formValidation({
                    icon: {
                        valid: 'fa fa-check',
                        invalid: 'fa fa-times',
                        validating: 'fa fa-refresh'
                    },
                    excluded: ':disabled',
                    live: 'disabled',
                    fields: {
                        width: {
                            validators: {
                                notEmpty: { message: 'Vui lòng nhập chiều ngang' }
                            }
                        },
                        height: {
                            validators: {
                                notEmpty: { message: 'Vui lòng nhập chiều cao' }
                            }
                        },
                        quantity: {
                            validators: {
                                notEmpty: { message: 'Vui lòng nhập số lượng' },
                                callback: {
                                    message: 'Số lượng tối thiểu là 100.',
                                    callback: function (value, validator, $field) {
                                        if (parseFloat(value) >= 100) {
                                            return true;
                                        }
                                        return false;
                                    }
                                }
                            }
                        }
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

                $('#f2').on('init.field.fv', function (e, data) {
                    var $parent = data.element.parents('.form-group'),
                        $icon = data.element.data('fv.icon'),
                        $label = $parent.children('label');
                    $icon.insertAfter($label);
                });
                $('#f2').formValidation({
                    icon: {
                        valid: 'fa fa-check',
                        invalid: 'fa fa-times',
                        validating: 'fa fa-refresh'
                    },
                    excluded: ':disabled',
                    live: 'disabled',
                    fields: {
                        width: {
                            validators: {
                                notEmpty: { message: 'Vui lòng nhập chiều ngang' }
                            }
                        },
                        height: {
                            validators: {
                                notEmpty: { message: 'Vui lòng nhập chiều cao' }
                            }
                        },
                        quantity: {
                            validators: {
                                notEmpty: { message: 'Vui lòng nhập số lượng' },
                                callback: {
                                    message: 'Số lượng tối thiểu là 100.',
                                    callback: function (value, validator, $field) {
                                        if (parseFloat(value) >= 100) {
                                            return true;
                                        }
                                        return false;
                                    }
                                }
                            }
                        }
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
                $('#f3').on('init.field.fv', function (e, data) {
                    var $parent = data.element.parents('.form-group'),
                        $icon = data.element.data('fv.icon'),
                        $label = $parent.children('label');
                    $icon.insertAfter($label);
                });
                $('#f3').formValidation({
                    icon: {
                        valid: 'fa fa-check',
                        invalid: 'fa fa-times',
                        validating: 'fa fa-refresh'
                    },
                    excluded: ':disabled',
                    live: 'disabled',
                    fields: {
                        width: {
                            validators: {
                                notEmpty: { message: 'Vui lòng nhập chiều ngang' }
                            }
                        },
                        height: {
                            validators: {
                                notEmpty: { message: 'Vui lòng nhập chiều cao' }
                            }
                        },
                        quantity: {
                            validators: {
                                notEmpty: { message: 'Vui lòng nhập số lượng' },
                                callback: {
                                    message: 'Số lượng tối thiểu là 100.',
                                    callback: function (value, validator, $field) {
                                        if (parseFloat(value) >= 100) {
                                            return true;
                                        }
                                        return false;
                                    }
                                }
                            }
                        },
                        file: {
                            validators: {
                                callback: {
                                    message: 'Vui lòng chọn file.',
                                    callback: function (value, validator, $field) {
                                        if ($scope.countFiles != '') {
                                            return true;
                                        }
                                        return false;
                                    }
                                }
                            }
                        }
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
                $('#f4').on('init.field.fv', function (e, data) {
                    var $parent = data.element.parents('.form-group'),
                        $icon = data.element.data('fv.icon'),
                        $label = $parent.children('label');
                    $icon.insertAfter($label);
                });
                $('#f4').formValidation({
                    icon: {
                        valid: 'fa fa-check',
                        invalid: 'fa fa-times',
                        validating: 'fa fa-refresh'
                    },
                    excluded: ':disabled',
                    live: 'disabled',
                    fields: {
                        width: {
                            validators: {
                                notEmpty: { message: 'Vui lòng nhập chiều ngang' }
                            }
                        },
                        height: {
                            validators: {
                                notEmpty: { message: 'Vui lòng nhập chiều cao' }
                            }
                        },
                        quantity: {
                            validators: {
                                notEmpty: { message: 'Vui lòng nhập số lượng' },
                                callback: {
                                    message: 'Số lượng tối thiểu là 100.',
                                    callback: function (value, validator, $field) {
                                        if (parseFloat(value) >= 100) {
                                            return true;
                                        }
                                        return false;
                                    }
                                }
                            }
                        }
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
        //popup galarey
        $scope.setPage = function () {
            //showLoader();
            sampleService.getSamples($scope.currentPage, $scope.numPerPage, $scope.currentCategory).then(function (results) {
                $scope.noOfPages = results.data.pager.totalPages;
                $scope.totalProduct = results.data.pager.totalItems;
                $scope.sampleGalery = results.data.items;
                $("html, body").animate({ scrollTop: 0 }, "slow");
                //hideLoader();
            }, function (error) {
            });

        };
        $scope.$watch('currentPage', $scope.setPage);
        $scope.searchByCategory = function (categoryId) {
            $scope.currentCategory = categoryId;
            $scope.numPerPage = 8;
            $scope.noOfPages = 1;
            $scope.currentPage = 1;
            $scope.setPage();
        }
        //end gallarey

    }]);