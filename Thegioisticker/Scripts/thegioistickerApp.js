;'use strict';
thegioistickerApp.factory('authInterceptorService', ['$q', '$injector','$location', 'localStorageService', function ($q, $injector,$location, localStorageService) {

    var authInterceptorServiceFactory = {};

    var _request = function (config) {

        config.headers = config.headers || {};
       
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            config.headers.Authorization = 'Bearer ' + authData.token;
        }

        return config;
    }

    var _responseError = function (rejection) {
        if (rejection.status === 401) {
            var authService = $injector.get('authService');
            var authData = localStorageService.get('authorizationData');

            if (authData) {
                if (authData.useRefreshTokens) {
                    $location.path('/refresh');
                    return $q.reject(rejection);
                }
            }
            authService.logOut();
            $location.path('/login');
        }
        return $q.reject(rejection);
    }

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
}]);
;'use strict';
thegioistickerApp.factory('authService', ['$http', '$q', 'localStorageService', 'ngAuthSettings', function ($http, $q, localStorageService, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        id:"",
        fullName: "",
        address: "",
        email: "",
        phoneNumber: "",
        userName: "",
        useRefreshTokens: false,
        isAdmin: false
    };

    var _externalAuthData = {
        provider: "",
        userName: "",
        externalAccessToken: ""
    };

    var _saveRegistration = function (registration) {

        _logOut();

        return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
            return response;
        });

    }; 
    var _saveChangePassword = function (changePassword) {
        return $http.post(serviceBase + 'api/account/changePassword', changePassword).then(function (response) {
            return response;
        });
    };
    var _resetPassword= function (resetNewPassword) {
        return $http.post(serviceBase + 'api/account/resetPassword', resetNewPassword).then(function (response) {
            return response;
        });
    };
    var _requestPasswordReset = function (resetPassword) {
        return $http.post(serviceBase + 'api/account/requestPasswordReset', resetPassword).then(function (response) {
            return response;
        });
    };

    var _login = function (loginData) {

        var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

        if (loginData.useRefreshTokens) {
            data = data + "&client_id=" + ngAuthSettings.clientId;
        }

        var deferred = $q.defer();

        $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
            var isAdmin = response.isAdmin;
            if (loginData.useRefreshTokens) {               
                localStorageService.set('authorizationData', {
                    token: response.access_token,
                    userName: loginData.userName,
                    id: response.id,
                    fullName: response.fullName,
                    address: response.address,
                    email: response.email,
                    phoneNumber: response.phoneNumber,
                    refreshToken: response.refresh_token,
                    useRefreshTokens: true,
                    isAdmin: isAdmin
                });
            }
            else {
                localStorageService.set('authorizationData',
                    {
                        token: response.access_token,
                        userName: loginData.userName,
                        id: response.id,
                        fullName: response.fullName,
                        address: response.address,
                        email: response.email,
                        phoneNumber: response.phoneNumber,
                        refreshToken: "",
                        useRefreshTokens: false,
                        isAdmin: isAdmin
                    });
            }
            _authentication.isAuth = true;
            _authentication.isAdmin = isAdmin;
            _authentication.fullName = response.fullName;
            _authentication.id = response.id;
            _authentication.address = response.address;
            _authentication.email = response.email;
            _authentication.phoneNumber = response.phoneNumber;
            _authentication.userName = loginData.userName;
            _authentication.useRefreshTokens = loginData.useRefreshTokens;

            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };

	var _logOut = function () {
		//return $http.post(serviceBase + 'api/account/logout').then(function (response) {
			localStorageService.remove('authorizationData');
			_authentication.isAuth = false;
			_authentication.userName = "";
			_authentication.fullName = "";
			_authentication.address = "";
			_authentication.email = "";
			_authentication.phoneNumber = "";
			_authentication.useRefreshTokens = false;
			_authentication.isAdmin = false;
			//return response;
		//});    
    };

    var _fillAuthData = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.fullName = authData.fullName;
            _authentication.id = authData.id;
            _authentication.address = authData.address;
            _authentication.email = authData.email;
            _authentication.phoneNumber = authData.phoneNumber;
            _authentication.userName = authData.userName;
            _authentication.useRefreshTokens = authData.useRefreshTokens;
            _authentication.isAdmin = authData.isAdmin;
        }

    };

    var _refreshToken = function () {
        var deferred = $q.defer();

        var authData = localStorageService.get('authorizationData');

        if (authData) {

            if (authData.useRefreshTokens) {

                var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + ngAuthSettings.clientId;

                localStorageService.remove('authorizationData');

                $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                    localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, fullName: response.fullName, refreshToken: response.refresh_token, useRefreshTokens: true });

                    deferred.resolve(response);

                }).error(function (err, status) {
                    _logOut();
                    deferred.reject(err);
                });
            }
        }

        return deferred.promise;
    };

    var _obtainAccessToken = function (externalData) {

        var deferred = $q.defer();

        $http.get(serviceBase + 'api/account/ObtainLocalAccessToken', { params: { provider: externalData.provider, externalAccessToken: externalData.externalAccessToken } }).success(function (response) {
            var isAdmin = response.isAdmin;
            localStorageService.set('authorizationData', {
                token: response.access_token,
                id:response.id,
                userName: response.userName,
                fullName: response.fullName,
                address: response.address,
                email: response.email,
                phoneNumber: response.phoneNumber,
                refreshToken: "",
                useRefreshTokens: false,
                isAdmin: isAdmin
            });

            _authentication.isAuth = true;
            _authentication.id = response.id;
            _authentication.fullName = response.fullName;
            _authentication.userName = response.userName;
            _authentication.address = response.address;
            _authentication.email = response.email;
            _authentication.phoneNumber = response.phoneNumber;
            _authentication.useRefreshTokens = false;
            _authentication.isAdmin = isAdmin;

            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };

    var _registerExternal = function (registerExternalData) {

        var deferred = $q.defer();

        $http.post(serviceBase + 'api/account/registerexternal', registerExternalData).success(function (response) {
            var isAdmin = response.isAdmin;
            localStorageService.set('authorizationData', {
                token: response.access_token,
                id: response.id,
                userName: response.userName,
                fullName: response.fullName,
                address: response.address,
                email: response.email,
                phoneNumber: response.phoneNumber,
                refreshToken: "",
                useRefreshTokens: false,
                isAdmin:isAdmin
            });
            _authentication.isAuth = true;
            _authentication.id = response.id;
            _authentication.userName = response.userName;
            _authentication.fullName = response.fullName;
            _authentication.address = response.address;
            _authentication.email = response.email;
            _authentication.phoneNumber = response.phoneNumber;
            _authentication.useRefreshTokens = false;
            _authentication.isAdmin = isAdmin;

            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    }; 

    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.saveChangePassword = _saveChangePassword; 
    authServiceFactory.requestPasswordReset = _requestPasswordReset;
    authServiceFactory.resetPassword = _resetPassword;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.refreshToken = _refreshToken;

    authServiceFactory.obtainAccessToken = _obtainAccessToken;
    authServiceFactory.externalAuthData = _externalAuthData;
    authServiceFactory.registerExternal = _registerExternal;

    return authServiceFactory;
}]);
;'use strict';
thegioistickerApp.factory('ordersService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var ordersServiceFactory = {};

    var _getOrders = function () {
        return $http.get(serviceBase + 'api/order').then(function (results) {
            return results;
        });
    };
    var _saveOrder = function (orders) {
        return $http.post(serviceBase + 'api/order/CreateOrder', orders).then(function (response) {
            return response;
        });

    };

    ordersServiceFactory.getOrders = _getOrders;
    ordersServiceFactory.saveOrder = _saveOrder;

    return ordersServiceFactory;

}]);
;'use strict';
thegioistickerApp.factory('tokensManagerService', ['$http','ngAuthSettings', function ($http,ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    
    var tokenManagerServiceFactory = {};

    var _getRefreshTokens = function () {

        return $http.get(serviceBase + 'api/refreshtokens').then(function (results) {
            return results;
        });
    };

    var _deleteRefreshTokens = function (tokenid) {

        return $http.delete(serviceBase + 'api/refreshtokens/?tokenid=' + tokenid).then(function (results) {
            return results;
        });
    };

    tokenManagerServiceFactory.deleteRefreshTokens = _deleteRefreshTokens;
    tokenManagerServiceFactory.getRefreshTokens = _getRefreshTokens;

    return tokenManagerServiceFactory;

}]);
;'use strict';
thegioistickerApp.factory('productService', ['$http', 'ngAuthSettings', '$q', function ($http, ngAuthSettings, $q) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var productServiceFactory = {};

    var _getProducts = function (pageIndex, pageSize, categoryId) {

        return $http.get(serviceBase + 'api/products/GetProductsForSale?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&categoryId=' + categoryId + '').then(function (results) {
            return results;
        });
    };
    var _getProductCategory = function () {
        return $http.get(serviceBase + 'api/products/getProductCategory').then(function (results) {
            return results;
        });
    }; 
    var _getProductById = function (productId) {
        return $http.get(serviceBase + 'api/products/GetProductById/' + productId).then(function (results) {
            return results;
        });
    };
    var _getProductBySeoUrl = function (seoUrl) {
        return $http.get(serviceBase + 'api/products/getProductBySeoUrl/' + seoUrl).then(function (results) {
            return results;
        });
    };
    var _getProductByCode = function (code) {
        return $http.get(serviceBase + 'api/products/GetProductByCode/' + code).then(function (results) {
            return results;
        });
    };
    var _getProductsRegular = function () {
        return $http.get(serviceBase + 'api/products/getProductsRegular').then(function (results) {
            return results;
        });
    };
    var _getProductsHightLight = function () {
        return $http.get(serviceBase + 'api/products/getProductsHightLight').then(function (results) {
            return results;
        });
    };
    var _getProductsByCategory = function (category) {
        return $http.get(serviceBase + 'api/products/getProductsByCategory/' + category).then(function (results) {
            return results;
        });
    };
    var _getSampleByProductById = function (id) {
        return $http.get(serviceBase + 'api/products/getSampleByProductById/' + id).then(function (results) {
            return results;
        });
    };
    var _getSampleByProductBySeoUrl = function (seoUrl) {
        return $http.get(serviceBase + 'api/products/getSampleByProductBySeoUrl/' + seoUrl).then(function (results) {
            return results;
        });
    };
    var _getListFileName = function (transactionId) {
        return $http.get(serviceBase + 'api/upload/getListFileName/' + transactionId).then(function (results) {
            return results;
        });
    };
    var _uploadFiles = function ($scope) {
        var request = {
            method: 'POST',
            url: serviceBase + 'api/upload/?identifier=' + $scope.product.transactionId+'',
            data: $scope.formdata,
            headers: {
                'Content-Type': undefined
            }
        };

        // SEND THE FILES.
        return $http(request)
            .then(
                function (response) {
                    if (typeof response.data === 'string') {
                        return response.data;
                    } else {
                        return $q.reject(response.data);
                    }
                },
                function (response) {
                    return $q.reject(response.data);
                }
            );
    }
    
    productServiceFactory.getProducts = _getProducts;
    productServiceFactory.getProductCategory = _getProductCategory;
    productServiceFactory.getProductById = _getProductById;
    productServiceFactory.getListFileName = _getListFileName;
    productServiceFactory.getProductsRegular = _getProductsRegular;
    productServiceFactory.getProductsHightLight = _getProductsHightLight;
    productServiceFactory.getProductByCode = _getProductByCode;
    productServiceFactory.getProductsByCategory = _getProductsByCategory;
    productServiceFactory.uploadFiles = _uploadFiles;
    productServiceFactory.getSampleByProductById = _getSampleByProductById;
    productServiceFactory.getProductBySeoUrl = _getProductBySeoUrl;
    productServiceFactory.getSampleByProductBySeoUrl = _getSampleByProductBySeoUrl;
    return productServiceFactory;

}]); 
;'use strict';
thegioistickerApp.factory('blogService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var blogServiceFactory = {};

    var _getblogs = function (pageIndex, pageSize) {

        return $http.get(serviceBase + 'api/blog/getBlogs?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '').then(function (results) {
            return results;
        });
    };
    var _getBlogById = function (blogId) {
        return $http.get(serviceBase + 'api/blog/GetBlogById/' + blogId).then(function (results) {
            return results;
        });       
    };
    var _getBlogBySeoUrl = function (seoUrl) {
        return $http.get(serviceBase + 'api/blog/GetBlogBySeoUrl/' + seoUrl).then(function (results) {
            return results;
        });
    };
    var _getBlogForHomePage = function () {
        return $http.get(serviceBase + 'api/blog/getBlogForHomePage').then(function (results) {
            return results;
        });
    };
    blogServiceFactory.getblogs = _getblogs;
    blogServiceFactory.getBlogById = _getBlogById;
    blogServiceFactory.getBlogBySeoUrl = _getBlogBySeoUrl;
    blogServiceFactory.getBlogForHomePage = _getBlogForHomePage;
    return blogServiceFactory;

}]);
;'use strict';
thegioistickerApp.factory('commonService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var commonServiceFactory = {};

    var _getcommons = function (pageIndex, pageSize) {

        return $http.get(serviceBase + 'api/commons/GetcommonsForSale?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '').then(function (results) {
            return results;
        });
    };
    commonServiceFactory.getcommons = _getcommons;

    return commonServiceFactory;

}]);
;'use strict';
thegioistickerApp.factory('customerService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var customerServiceFactory = {};

    var _getCustomerByUserId = function (userId) {

        return $http.get(serviceBase + 'api/customer/getCustomerByUserId?userId=' + userId + '').then(function (results) {
            return results;
        });
    };
    var _savecustomer = function (customer) {
        return $http.post(serviceBase + 'api/customer/saveCustomer', customer).then(function (response) {
            return response;
        });
    };
    customerServiceFactory.getCustomerByUserId = _getCustomerByUserId;
    customerServiceFactory.savecustomer = _savecustomer;
    return customerServiceFactory;

}]);
;'use strict';
thegioistickerApp.factory('faqService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var faqServiceFactory = {};

    var _getfaqs = function (pageIndex, pageSize) {

        return $http.get(serviceBase + 'api/faq/getFaqs').then(function (results) {
            return results;
        });
    };
    faqServiceFactory.getfaqs = _getfaqs;

    return faqServiceFactory;

}]);
;'use strict';
thegioistickerApp.factory('invoiceService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var invoiceServiceFactory = {};

    var _getInvoices = function () {

        return $http.get(serviceBase + 'api/decalPrice/getDecalPrices').then(function (results) {
            return results;
        });
    };
    invoiceServiceFactory.getInvoices = _getInvoices;

    return invoiceServiceFactory;

}]);
;'use strict';
thegioistickerApp.factory('sampleService', ['$http', 'ngAuthSettings', '$q', function ($http, ngAuthSettings, $q) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var sampleServiceFactory = {};
    var _getSamples = function (pageIndex, pageSize,category) {

        return $http.get(serviceBase + 'api/samples/getSamples?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&category=' + category+ '').then(function (results) {
            return results;
        });
    };

    var _getAllSample = function () {
        return $http.get(serviceBase + 'api/samples/getAllSample').then(function (results) {
            return results;
        });
    };
    var _getListFileName = function (transactionId) {
        return $http.get(serviceBase + 'api/upload/getListFileName/' + transactionId).then(function (results) {
            return results;
        });
    };
    var _getSampleByShapeId = function (shapeId) {
        return $http.get(serviceBase + 'api/samples/getSamplesByShape/' + shapeId).then(function (results) {
            return results;
        });
    };
    sampleServiceFactory.getAllSample = _getAllSample;
    sampleServiceFactory.getSampleByShapeId = _getSampleByShapeId;
    sampleServiceFactory.getListFileName = _getListFileName;
    sampleServiceFactory.getSamples = _getSamples;
    return sampleServiceFactory;
}]);
;'use strict';
thegioistickerApp.factory('companyService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var companyServiceFactory = {};

    var _getcompanys = function (pageIndex, pageSize) {

        return $http.get(serviceBase + 'api/company/getBlogs?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '').then(function (results) {
            return results;
        });
    };
    var _getBlogById = function (companyId) {
        return $http.get(serviceBase + 'api/company/GetBlogById/' + companyId).then(function (results) {
            return results;
        });       
    };

    var _getAllContentPages = function () {
        return $http.get(serviceBase + 'api/contentPage/getAllContentPage').then(function (results) {
            return results;
        });
    };
    companyServiceFactory.getcompanys = _getcompanys;
    companyServiceFactory.getBlogById = _getBlogById;
    companyServiceFactory.getAllContentPages = _getAllContentPages;
    return companyServiceFactory;

}]);
;'use strict';
thegioistickerApp.factory('settingService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var settingServiceFactory = {};

    var _getsettings = function () {
        return $http.get(serviceBase + 'api/setting/getSettings').then(function (results) {
            return results;
        });
    };
    var _getsettingById = function (settingId) {
        return $http.get(serviceBase + 'api/setting/GetSettingById/' + settingId).then(function (results) {
            return results;
        });
    };
    var _getPagingsettings = function () {
        return $http.get(serviceBase + 'api/setting/getPagingsetting').then(function (results) {
            return results;
        });
    };
    var _saveSetting = function (setting) {
        return $http.post(serviceBase + 'api/setting/saveSetting', setting).then(function (response) {
            return response;
        });
    };
    var _delete = function (setting) {
        return $http.post(serviceBase + 'api/setting/deleteSetting', setting).then(function (response) {
            return response;
        });
    };
    settingServiceFactory.getsettingById = _getsettingById;
    settingServiceFactory.getsettings = _getsettings;
    settingServiceFactory.getPagingsettings = _getPagingsettings;
    settingServiceFactory.saveSetting = _saveSetting;
    settingServiceFactory.delete = _delete;

    return settingServiceFactory;

}]);
;'use strict';
thegioistickerApp.factory('couponService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var couponServiceFactory = {};

    var _getcoupons = function () {
        return $http.get(serviceBase + 'api/coupon').then(function (results) {
            return results;
        });
    };
    var _getcouponById = function (couponId) {
        return $http.get(serviceBase + 'api/coupon/GetcouponById/' + couponId).then(function (results) {
            return results;
        });
    };
    var _getPagingcoupons = function () {
        return $http.get(serviceBase + 'api/coupon/getPagingcoupon').then(function (results) {
            return results;
        });
    };
    var _savecoupon = function (coupon) {
        return $http.post(serviceBase + 'api/coupon/savecoupon', coupon).then(function (response) {
            return response;
        });
    };
    var _delete = function (coupon) {
        return $http.post(serviceBase + 'api/coupon/deletecoupon', coupon).then(function (response) {
            return response;
        });
    };
    var _applyCounpon = function (coupon) {
       var postobj = {
            name: coupon
        }
        return $http.post(serviceBase + 'api/coupon/checkCoupon', postobj).then(function (results) {
            return results;
        });
    };
    couponServiceFactory.getcouponById = _getcouponById;
    couponServiceFactory.getcoupons = _getcoupons;
    couponServiceFactory.getPagingcoupons = _getPagingcoupons;
    couponServiceFactory.savecoupon = _savecoupon;
    couponServiceFactory.delete = _delete;
    couponServiceFactory.applyCounpon = _applyCounpon;
    return couponServiceFactory;

}]);
;'use strict';
thegioistickerApp.factory('shapeService', ['$http', 'ngAuthSettings', '$q', function ($http, ngAuthSettings, $q) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var productServiceFactory = {};

    var _getProducts = function (pageIndex, pageSize, categoryId) {

        return $http.get(serviceBase + 'api/products/GetProductsForSale?pageIndex=' + pageIndex + '&pageSize=' + pageSize + '&categoryId=' + categoryId + '').then(function (results) {
            return results;
        });
    };
    var _getShapes = function () {
        return $http.get(serviceBase + 'api/shapes/getAllShape').then(function (results) {
            return results;
        });
    };
    var _getProductCategory = function () {
        return $http.get(serviceBase + 'api/products/getProductCategory').then(function (results) {
            return results;
        });
    };
    var _getProductById = function (productId) {
        return $http.get(serviceBase + 'api/products/GetProductById/' + productId).then(function (results) {
            return results;
        });
    };
    var _getProductByCode = function (code) {
        return $http.get(serviceBase + 'api/products/GetProductByCode/' + code).then(function (results) {
            return results;
        });
    };
    var _getProductsRegular = function () {
        return $http.get(serviceBase + 'api/products/getProductsRegular').then(function (results) {
            return results;
        });
    };
    var _getProductsHightLight = function () {
        return $http.get(serviceBase + 'api/products/getProductsHightLight').then(function (results) {
            return results;
        });
    };
    var _getProductsByCategory = function (category) {
        return $http.get(serviceBase + 'api/products/getProductsByCategory/' + category).then(function (results) {
            return results;
        });
    };
    var _uploadFiles = function ($scope) {
        var request = {
            method: 'POST',
            url: serviceBase + 'api/upload/?identifier=' + $scope.product.transactionId+'',
            data: $scope.formdata,
            headers: {
                'Content-Type': undefined
            }
        };

        // SEND THE FILES.
        return $http(request)
            .then(
                function (response) {
                    if (typeof response.data === 'string') {
                        return response.data;
                    } else {
                        return $q.reject(response.data);
                    }
                },
                function (response) {
                    return $q.reject(response.data);
                }
            );
    }
    
    productServiceFactory.getProducts = _getProducts;
    productServiceFactory.getShapes = _getShapes;
    productServiceFactory.getProductCategory = _getProductCategory;
    productServiceFactory.getProductById = _getProductById;
    productServiceFactory.getProductsRegular = _getProductsRegular;
    productServiceFactory.getProductsHightLight = _getProductsHightLight;
    productServiceFactory.getProductByCode = _getProductByCode;
    productServiceFactory.getProductsByCategory = _getProductsByCategory;
    productServiceFactory.uploadFiles = _uploadFiles;
    return productServiceFactory;

}]);
;thegioistickerApp.controller("RootController", ['$window', 'localStorageService', 'Notification', 'authService', '$rootScope', '$scope', '$location', '$timeout', 'invoiceService', 'sampleService', 'productService', 'settingService',
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
        getSetting();
        getRegular();
        if (window.location.pathname == '/' || window.location.pathname == '/thu-vien-decal' || window.location.pathname == '/chi-tiet-san-pham') {
            getShape();
            getInvoice();
            getSample();
        }
        setTimeout(function () {
            hideLoader();
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
;'use strict';
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
;'use strict';
thegioistickerApp.controller('loginController', ['$scope', '$timeout', 'Notification', '$location', 'authService', 'ngAuthSettings', function ($scope, $timeout, Notification, $location, authService, ngAuthSettings) {
    $scope.loginData = {
        userName: "",
        password: "",
        useRefreshTokens: false
    };
    $scope.waringMessage = '';
	$scope.message = "";
	$scope.savedSuccessfully = false;
	$scope.message = "";

	$scope.registration = {
	    fullName: "",
		userName: "",
		email:"",
		password: "",
		confirmPassword: ""
	};

	$scope.forgot = {
		email: "",
	};
	
	$scope.signUp = function () {
	    if ($scope.registration.fullName == '') {
	        $scope.shakeModal("Vui lòng nhập họ và tên");
	        return;
		}
		if ($scope.registration.email == '') {
			$scope.shakeModal("Vui lòng nhập email");
			return;
		}
		if ($scope.registration.password == '') {
			$scope.shakeModal("Vui lòng nhập mật khẩu");
			return;
		}
		if ($scope.registration.password != $scope.registration.confirmPassword) {
		    $scope.shakeModal("Password và confirm password không giống nhau");
			return;
		}
		authService.saveRegistration($scope.registration).then(function (response) {
			$scope.savedSuccessfully = true;			
			//$scope.openLoginModal();
			$timeout(function () {
				Notification.success("Tạo tài khoản thành công");
				$scope.loginData = {
					userName: $scope.registration.userName,
					password: $scope.registration.password,
					useRefreshTokens: false
				};
				$scope.login();
			}, 1000);			
			//startTimer();
		},
			function (response) {
				var errors = [];
				for (var key in response.data.modelState) {
					for (var i = 0; i < response.data.modelState[key].length; i++) {
						errors.push(response.data.modelState[key][i]);
					}
				}
				$scope.shakeModal("Đã có lỗi xảy ra:" + errors.join(' '));
			});
	};
    $scope.login = function () {

        authService.login($scope.loginData).then(function (response) {
            $scope.loginData.password = '';
            $scope.loginData.userName = '';
			$('#loginModal').modal('hide');
			Notification.primary('Bạn đã đăng nhập thành công');
			location.reload();
        },
			function (err) {
			    $scope.shakeModal("Vui lòng kiểm tra lại userName và password");
         });
	};
	$scope.forgotPass = function () {
		if ($scope.forgot.email == '') {
			$scope.shakeModal("Vui lòng nhập email");
			return;
		}
		authService.requestPasswordReset($scope.forgot).then(function (response) {
			$scope.forgot.email == '';
			Notification.primary('Đã gởi reset link tới email của bạn.');
			$('#loginModal').modal('hide');
		},
			function (err) {
				$scope.shakeModal("Vui lòng kiểm tra lại email");
			});
	};

	$scope.authExternalProvider = function (provider) {

        var redirectUri = location.protocol + '//' + location.host + '/authcomplete.html';

        var externalProviderUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/ExternalLogin?provider=" + provider
                                                                    + "&response_type=token&client_id=" + ngAuthSettings.clientId
                                                                    + "&redirect_uri=" + redirectUri;
        window.$windowScope = $scope;

        var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
	};
	
	$scope.makeExtenalUserName = function () {
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for (var i = 0; i < 50; i++)
	        text += possible.charAt(Math.floor(Math.random() * possible.length));

	    return text;
	}

	$scope.registerExternal = function () {
	    if ($scope.registerData.fullName == '') {
	        $scope.shakeModal("Tên hiển thị không được trống");
	        return;
	    }
	    $scope.registerData.userName = $scope.makeExtenalUserName();
	    authService.registerExternal($scope.registerData).then(function (response) {
	        $scope.isCreateExtenal = false;
	        $('#loginModal').modal('hide');
			Notification.primary('Bạn đã đăng nhập thành công');
			location.reload();
	    },
          function (response) {
              var errors = [];
              for (var key in response.modelState) {
                  errors.push(response.modelState[key]);
              }
              $scope.message = "Failed to register user due to:" + errors.join(' ');
          });
	};
	$scope.authCompletedCB = function (fragment) {
        $scope.$apply(function () {
            if (fragment.haslocalaccount == 'False') {

                authService.logOut();

                authService.externalAuthData = {
                    provider: fragment.provider,
                    userName: fragment.external_user_name,
                    externalAccessToken: fragment.external_access_token
                };
                $scope.openRegisterModal();
             
                $scope.shakeModal("Liên kết thành công.");
                    $scope.isCreateExtenal = true;
                $scope.registerData = {
                    fullName: authService.externalAuthData.userName,
                    userName: authService.externalAuthData.userName,
                    provider: authService.externalAuthData.provider,
                    externalAccessToken: authService.externalAuthData.externalAccessToken
                };
            }
            else {
                //Obtain access token and redirect to orders
                var externalData = { provider: fragment.provider, externalAccessToken: fragment.external_access_token };
				authService.obtainAccessToken(externalData).then(function (response) {
					$('#loginModal').modal('hide');
					location.reload();
					Notification.primary('Bạn đã đăng nhập thành công');

                },
             function (err) {
                 $scope.message = err.error_description;
             });
            }

        });
	}
	
}]);

;'use strict';
thegioistickerApp.controller('indexController', ['$scope', '$location', 'authService', function ($scope, $location, authService) {

    $scope.logOut = function () {
        authService.logOut();
        $location.path('/home');
    }

    $scope.authentication = authService.authentication;

}]);
;'use strict';
thegioistickerApp.controller('ordersController', ['$scope', 'ordersService', function ($scope, ordersService) {

    $scope.orders = [];

    ordersService.getOrders().then(function (results) {

        $scope.orders = results.data;
        hideLoader();
    }, function (error) {
    });

}]);
;'use strict';
thegioistickerApp.controller('refreshController', ['$scope', '$location', 'authService', function ($scope, $location, authService) {

    $scope.authentication = authService.authentication;
    $scope.tokenRefreshed = false;
    $scope.tokenResponse = null;

    $scope.refreshToken = function () {

        authService.refreshToken().then(function (response) {
            $scope.tokenRefreshed = true;
            $scope.tokenResponse = response;
        },
         function (err) {
             $location.path('/login');
         });
    };

}]);
;'use strict';
thegioistickerApp.controller('tokensManagerController', ['$scope', 'tokensManagerService', function ($scope, tokensManagerService) {

    $scope.refreshTokens = [];

    tokensManagerService.getRefreshTokens().then(function (results) {

        $scope.refreshTokens = results.data;

    }, function (error) {
        alert(error.data.message);
    });

    $scope.deleteRefreshTokens = function (index, tokenid) {

        tokenid = window.encodeURIComponent(tokenid);

        tokensManagerService.deleteRefreshTokens(tokenid).then(function (results) {

            $scope.refreshTokens.splice(index, 1);

        }, function (error) {
            alert(error.data.message);
        });
    }

}]);
;'use strict';
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
;'use strict';
thegioistickerApp.controller('shoppingCartController', ['$scope', '$timeout', 'customerService', 'ordersService', 'productService', 'localStorageService', 'Notification', 'couponService', function ($scope, $timeout, customerService, ordersService, productService, localStorageService, Notification, couponService) {
    $scope.shoppingCart = [];
    $scope.subTotal = 0;
    $scope.couponValue = 0;
    $scope.isApplyCoupon = false;
    $scope.couponLabel = '';
    $scope.note = '';
    $scope.options = ['Khi Nhận Hàng', 'Chuyển Khoản'];
    $scope.myselect = 'Khi Nhận Hàng';
    $scope.couponText = 'VND';
    $scope.orderNumber = location.search.split('orderId=')[1];
    $scope.coupon = '';
    $scope.couponType = 0;
    $scope.customer = {
        id: 0,
        userId: '',
        fullName: '',
        address: '',
        email: '',
        phoneNumber: '',
    };
    $scope.selectedProduct = {};
    customerService.getCustomerByUserId($scope.authentication.id).then(function (response) {
        if (response.data == null) {
            $scope.customer.fullName = $scope.authentication.fullName;
            $scope.customer.userId = $scope.authentication.id;
        } else {
            $scope.customer = {
                id: response.data.id,
                userId: $scope.authentication.id,
                fullName: response.data.fullName,
                address: response.data.address,
                email: response.data.email,
                phoneNumber: response.data.phoneNumber,
            };
        }
        hideLoader();
    },
        function (err) {
            Notification.error('Vui lòng kiểm tra lại');
        });
    if (localStorageService.get('shoppingCart') != null) {
        var products = localStorageService.get('shoppingCart').products;
        $scope.shoppingCart = products;
    }
    var calculateTotals = function () {
        var total = 0;
        for (var i = 0, len = $scope.shoppingCart.length; i < len; i++) {
            total = total + $scope.shoppingCart[i].subTotal;
        }
        //$scope.couponValue = $scope.couponResult.amount;
        //$scope.isApplyCoupon = true;
        //$scope.couponLabel = $scope.couponResult.code;
        if ($scope.couponResult != undefined && $scope.couponResult.type == 2) {
            $scope.couponText = '% Đơn Hàng';
            total = total - (($scope.couponValue * total)/100);
        }
        if ($scope.couponResult != undefined && $scope.couponResult.type == 1) {
            $scope.couponText = 'VND';
            total = total - $scope.couponValue;
        }
     
        $scope.subTotal = total;
        var listProducts = $scope.shoppingCart;
        localStorageService.set('shoppingCart', { products: listProducts });
    };
    $scope.removeShopping = function (item) {
        var index = $scope.shoppingCart.indexOf(item);
        $scope.shoppingCart.splice(index, 1);

        var relatedItem = $scope.shoppingCart.find(function (element) {
            return element.transactionId == item.transactionId;
        });
        $scope.shoppingCart.splice(relatedItem, 1);

        var listProducts = $scope.shoppingCart;
        localStorageService.set('shoppingCart', { products: listProducts });
        Notification.primary('Đã xóa khỏi giỏ hàng thành công');
    }
    $scope.$watch('shoppingCart', calculateTotals, true);
    $scope.customer = {

    };
    $scope.proccessOrder = function () {
        var fv = $('#f1').data('formValidation');
        var $container = $('#f1-step1');
        fv.validateContainer($container);
        var isValidStep = fv.isValidContainer($container);
        if (isValidStep === false || isValidStep === null) {
            return false;
        }
        if ($scope.shoppingCart.length == 0) {
            Notification.error('không có sản phẩm nào trong giỏ hàng');
            return;
        }
        showLoader();
        var orders = {
            customer: $scope.customer,
            note: $scope.note,
            products: $scope.shoppingCart,
            couponName: $scope.coupon,
            discountValue: $scope.couponValue,
            payMentMethol: $scope.myselect,
            total: $scope.subTotal,
            couponType: $scope.couponType,
        };
        ordersService.saveOrder(orders).then(function (response) {
            console.log(20);
            $scope.orderNumber = response.data;
            Notification.success('Đơn hàng đã được tạo thành công');
            setTimeout(function () {
                localStorageService.remove('shoppingCart');
                //if (order.payMentMethol =='Chuyển Khoản') {
                //    window.location.href = '/hoan-tat-don-hang';
                //}
                window.location.href = '/hoan-tat-don-hang?orderId=' + btoa(response.data)+'';
            }, 500);
        },
            function (err) {
                Notification.error('Vui lòng kiểm tra lại đơn hàng.');
                hideLoader();
            });
    }

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
                fullName: {
                    validators: {
                        notEmpty: { message: 'Vui òng điền họ và tên' }
                    }
                },
                address: {
                    validators: {
                        notEmpty: { message: 'Vui lòng điền địa chỉ' }
                    }
                },
                email: {
                    validators: {
                        notEmpty: { message: 'Vui lòng điền email' }
                    }
                },
                phoneNumber: {
                    validators: {
                        notEmpty: { message: 'Vui lòng điền số điện thoại' }
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
    $scope.applyCoupon = function () {
        couponService.applyCounpon($scope.coupon).then(function (response) {
            if (response.status == 200 && response.data != null) {
                $scope.couponResult = response.data;
                $scope.couponValue = $scope.couponResult.amount;
                $scope.couponType = $scope.couponResult.type;
                $scope.isApplyCoupon = true;
                $scope.couponLabel = $scope.couponResult.code;
                calculateTotals();
                Notification.success('Áp dụng mã khuyến mãi thành công');
            }
        },
            function (err) {
                Notification.error('Mã khuyến mãi không đúng');
            });
    }
    $scope.showFilePopup = function (product) {
        if (product.fileType == 1) {
            
            $scope.selectedProduct = product;
            $scope.fields= JSON.parse($scope.selectedProduct.settingModal).fields
            $('#shopping-review-popup').modal('show');
        }
        if (product.fileType == 2) {
            $scope.selectedProduct = product;
            $('#design-review-popup').modal('show');
        }
        if (product.fileType == 3) {
            getListfile(product.transactionId);
            $scope.selectedProduct = product;
            $('#upload-review-popup').modal('show');
        }
        console.log(product);
    }
    function getListfile(transactionId) {
        productService.getListFileName(transactionId).then(function (response) {
            $scope.selectedProduct.imageUrls = response.data;
        },
            function (err) {
                Notification.error('Vui lòng kiểm tra lại.');
                hideLoader();
            });
    }
    $scope.removeCoupon = function () {
        $scope.couponValue = 0;
        $scope.isApplyCoupon = false;
        $scope.couponLabel = '';
        $scope.coupon = '';
        $scope.couponType = 0;
        calculateTotals();

    }

}]); 
;'use strict';
thegioistickerApp.controller('blogController', ['$scope', '$timeout', 'blogService', 'localStorageService', 'Notification', function ($scope, $timeout, blogService, localStorageService, Notification) {
    $scope.blogs = [];
    $scope.recentProducts = [];
    $scope.numPerPage = 5;
    $scope.noOfPages = 1;
    $scope.currentPage = 1;
    $scope.setPage = function () {
        showLoader();
        blogService.getblogs($scope.currentPage, $scope.numPerPage).then(function (results) {
            $scope.noOfPages = results.data.pager.totalPages;
            $scope.totalBlogs = results.data.pager.totalItems;
            $scope.blogs = results.data.items;
            $("html, body").animate({ scrollTop: 0 }, "slow");
            hideLoader();
        }, function (error) {
            //alert(error.data.message);
        });
    };
    $scope.$watch('currentPage', $scope.setPage);

    if (localStorageService.get('recentProducts') != null) {
        var products = localStorageService.get('recentProducts').recentProducts;
        $scope.recentProducts = products;
    }
    $scope.viewDetailBlog = function (url) {
        window.location.href = '/thong-tin-chi-tiet/' + url + '';
    };
    $scope.viewDetail = function (Id) {
        window.location.href = '/chi-tiet-san-pham/' + Id + '';
    };
}]);
;'use strict';
thegioistickerApp.controller('blogDetailController', ['$scope', '$timeout', 'blogService', 'localStorageService', 'Notification', '$rootScope', function ($scope, $timeout, blogService, localStorageService, Notification, $rootScope) {
    //var myParam = location.search.split('Id=')[1];
    //var myParam = location.pathname.split('thong-tin-chi-tiet/')[1];
    //$scope.content = '';
    //getBlog();
    //function getBlog() {
    //    showLoader();
    //    blogService.getBlogBySeoUrl(myParam).then(function (results) {
    //        debugger;
    //        $scope.content = results.data.content;
    //        $rootScope.metaDescription = results.data.metaDescription;
    //        $rootScope.metaTitle = results.data.metaTitle;
    //        $("#view-content").empty();
    //        $("#view-content").append($scope.content);
    //        hideLoader();
    //    }, function (error) {
    //        //alert(error.data.message);
    //    });
    //}   
}]);
;'use strict';
thegioistickerApp.controller('faqController', ['$scope', '$timeout', 'faqService', 'localStorageService', 'Notification', function ($scope, $timeout, faqService, localStorageService, Notification) {
    $scope.faqs = [];
    getfaqs();
    function getfaqs() {
        showLoader();
        faqService.getfaqs().then(function (results) {
            $scope.faqs = results.data;
            hideLoader();
        }, function (error) {
            //alert(error.data.message);
        });
    }
}]);
;'use strict';
thegioistickerApp.controller('companyController', ['$scope', '$timeout', 'companyService', 'localStorageService', 'Notification', function ($scope, $timeout, companyService, localStorageService, Notification) {
    $scope.company = [];
    if (window.location.pathname != '/lien-he') {
        getAllContentPages();
    }
    initValidateContact();
    function getAllContentPages() {
        showLoader();
        companyService.getAllContentPages().then(function (results) {
            $("#gioithieu").empty();
            $("#gioithieu").append(results.data[0].content);

            $("#tuyendung").empty();
            $("#tuyendung").append(results.data[1].content);

            $("#quydinhchung").empty();
            $("#quydinhchung").append(results.data[2].content);

            $("#thanhtoangiaohang").empty();
            $("#thanhtoangiaohang").append(results.data[3].content);

            $("#baomat").empty();
            $("#baomat").append(results.data[4].content);
            hideLoader();
        }, function (error) {
            //alert(error.data.message);
        });
    }
   
    $scope.sendContact = function () {
        var fv = $('#f11').data('formValidation');
        var $container = $('#f11-step1');
        fv.validateContainer($container);
        var isValidStep = fv.isValidContainer($container);
        if (isValidStep === false || isValidStep === null) {
            return false;
        }
        Notification.success('Đã gởi thành công.');

    }

    function initValidateContact() {
        $timeout(function () {
            $('#f11').on('init.field.fv', function (e, data) {
                var $parent = data.element.parents('.form-group'),
                    $icon = data.element.data('fv.icon'),
                    $label = $parent.children('label');
                $icon.insertAfter($label);
            });
            $('#f11').formValidation({
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
                            notEmpty: { message: 'Vui lòng nhập tên' },
                        }
                    },
                    email: {
                        validators: {
                            notEmpty: { message: 'Vui lòng nhập email' }
                        }
                    },
                    msg: {
                        validators: {
                            notEmpty: { message: 'Vui lòng nhập nội dung' }
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
}]);
;'use strict';
thegioistickerApp.controller('userController', ['$scope', 'customerService', '$timeout', 'localStorageService', 'Notification', 'authService', 'productService', function ($scope, customerService, $timeout, localStorageService, Notification, authService, productService) {
    $scope.customer = {
        id: 0,
        userId: '',
        fullName: '',
        address: '',
        email: '',
        phoneNumber: '',
    };
    $scope.orderDetail = [];
    $scope.detail = {};
    $scope.selectedProduct = {};
    var table = {};
    $scope.order = {};
    $scope.isChangeSuccess = false;
    $scope.isChangePassWord = false;
    $scope.DeleveryOptions = ['Khi Nhận Hàng', 'Chuyển Khoản'];
    $scope.orderStatusOptions = [
        { value: 0, name: 'Chưa Giao Hàng' },
        { value: 1, name: 'Đang Giao Hàng' },
        { value: 2, name: 'Đã Giao Hàng' }
    ];
    $scope.changePassWord =
    {
        curentPassWord: '',
        newPassword: '',
        confirmNewPassword:''
    }
    $scope.resetPassWordModel =
    {
        password: '',
        passwordConfirmation: '',
        email: '',
        token:''
    }
    $scope.availableOptions = [
        { id: 0, name: 'Chưa Giao Hàng' },
        { id: 1, name: 'Đang Giao Hàng' },
        { id: 2, name: 'Đã Giao Hàng' }
    ]
    customerService.getCustomerByUserId($scope.authentication.id).then(function (response) {
        if (response.data == null) {
            $scope.customer.fullName = $scope.authentication.fullName;
            $scope.customer.userId = $scope.authentication.id;
            $scope.customer.email = $scope.authentication.email;
            $scope.customer.address = $scope.authentication.address;
            $scope.customer.phoneNumber = $scope.authentication.phoneNumber;
        } else {
            $scope.customer = {
                id: response.data.id,
                userId: $scope.authentication.id,
                fullName: response.data.fullName,
                address: response.data.address,
                email: response.data.email,
                phoneNumber: response.data.phoneNumber,
            };
        }
        $scope.initTable();
    },
        function (err) {
            Notification.error('Vui lòng kiểm tra lại');
        });
    $scope.changePassword = function () {
        if ($scope.changePassWord.curentPassWord == '') {
            Notification.error("Vui lòng nhập mật khẩu hiện tại");
            return;
        }
        if ($scope.changePassWord.newPassword == '') {
            Notification.error("Vui lòng nhập mật khẩu mới");
            return;
        }
        if ($scope.changePassWord.newPassword != $scope.changePassWord.confirmNewPassword) {
            Notification.error("Password và confirm password không giống nhau");
            return;
        }
        $scope.changePassWord.userId = $scope.authentication.id;
        authService.saveChangePassword($scope.changePassWord).then(function (response) {
            $scope.savedSuccessfully = true;
            $timeout(function () {
                Notification.success("Đổi mật khẩu thành công");
                $scope.loginData = {
                    userName: $scope.registration.userName,
                    password: $scope.registration.password,
                    useRefreshTokens: false
                };
                authService.logOut();
                authService.login();
            }, 1000);
            //startTimer();
        },
            function (response) {
                var errors = [];
                for (var key in response.data.modelState) {
                    for (var i = 0; i < response.data.modelState[key].length; i++) {
                        errors.push(response.data.modelState[key][i]);
                    }
                }
                Notification.error("Đã có lỗi xảy ra:" + errors.join(' '));
            });
    };
    $scope.createNewPassword = function () {
        var url = new URL(location);
        $scope.resetPassWordModel.email = url.searchParams.get('email');
        $scope.resetPassWordModel.token = url.searchParams.get('token');
        if ($scope.resetPassWordModel.password == '') {
            Notification.error("Vui lòng nhập mật khẩu mới");
            return;
        }
        if ($scope.resetPassWordModel.password != $scope.resetPassWordModel.passwordConfirmation) {
            Notification.error("Password và confirm password không giống nhau");
            return;
        }
        authService.resetPassword($scope.resetPassWordModel).then(function (response) {
            $scope.savedSuccessfully = true;
            $timeout(function () {
                $scope.isChangeSuccess = true;
                Notification.success("Đổi mật khẩu thành công");
                $scope.loginData = {
                    userName: $scope.registration.userName,
                    password: $scope.registration.password,
                    useRefreshTokens: false
                };
                authService.logOut();
                authService.login();
            }, 1000);
            //startTimer();
        },
            function (response) {
                var errors = [];
                for (var key in response.data.modelState) {
                    for (var i = 0; i < response.data.modelState[key].length; i++) {
                        errors.push(response.data.modelState[key][i]);
                    }
                }
                Notification.error("Đã có lỗi xảy ra:" + errors.join(' '));
            });
    };
    $scope.updateCustomer = function () {
        var fv = $('#f1').data('formValidation');
        var $container = $('#f1-step1');
        fv.validateContainer($container);
        var isValidStep = fv.isValidContainer($container);
        if (isValidStep === false || isValidStep === null) {
            return false;
        }
        if ($scope.customer.fullName == '') {
            Notification.error("Vui lòng nhập họ và tên");
            return;
        }
        if ($scope.customer.address == '') {
            Notification.error("Vui lòng nhập địa chỉ");
            return;
        }
        if ($scope.customer.email == '') {
            Notification.error("Vui lòng nhập mật email");
            return;
        }
        if ($scope.customer.phoneNumber == '') {
            Notification.error("Vui lòng nhập số điện thoại");
            return;
        }
        customerService.savecustomer($scope.customer).then(function (response) {
            Notification.success('Cập nhật thông tin thành công');
        },
            function (err) {
                Notification.error('Vui lòng kiểm tra lại');
            });
    }
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
                fullName: {
                    validators: {
                        notEmpty: { message: 'Vui òng điền họ và tên' }
                    }
                },
                address: {
                    validators: {
                        notEmpty: { message: 'Vui lòng điền địa chỉ' }
                    }
                },
                email: {
                    validators: {
                        notEmpty: { message: 'Vui lòng điền email' }
                    }
                },
                phoneNumber: {
                    validators: {
                        notEmpty: { message: 'Vui lòng điền số điện thoại' }
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
    $scope.initTable = function () {
        table = $('#order-table').DataTable({
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
            ajax: {
                "url": "api/customer/getPagingOrders",
                "type": "GET",
                "data": {
                    "customerId": $scope.customer.id,
                }
            },
            initComplete: function () {
                var api = this.api(),
                    searchBox = $('#orders-search-input');
                if (searchBox.length > 0) {
                    searchBox.on('keyup', function (event) {
                        api.search(event.target.value).draw();
                    });
                }
            },
            columns: [
                { "data": "id", filterable: false, sortable: false },
                {
                    "data": "customerName",
                    render: function (data, type) {
                        if (type === 'display') {
                            return '<a class="edit-customer" style="color:green" href="javascript:void(0)">' + data + '</a>';
                        }
                        return data;
                    }

                },
                {
                    "data": "couponName",
                },
                {
                    "data": "couponType",
                    render: function (data, type) {                    
                        if (type === 'display') {
                            if (data == 1) {
                                return 'Số Tiền';
                            }
                            else if (data == 2) {
                                return 'Phần Trăm';
                            }
                            else {
                                return '';
                            }
                        }

                        return data;
                    }
                },
                {
                    "data": "discountValue",
                    render: $.fn.dataTable.render.number(',')
                },
                {
                    "data": "total",
                    render: $.fn.dataTable.render.number(',')
                },
                { "data": "payMentMethol" },
                {
                    "data": "orderStatus",
                    render: function (data, type) {

                        if (type === 'display') {
                            if (data == 0) {
                                return 'Chưa Giao Hàng';
                            }
                            else if (data == 1) {
                                return 'Đang Giao Hàng';
                            }
                            else {
                                return 'Đã Giao Hàng';
                            }
                        }

                        return data;
                    }
                },
                { "data": "note" },
                {
                    "data": "dateCreated",
                    render: function (data, type, row) {
                        if (data == null) return '';
                        if (type === "sort" || type === "type") {
                            return data;
                        }
                        return moment(data).format("DD-MM-YYYY HH:mm");
                    }
                },
                {
                    "data": "deliveryDate",
                    render: function (data, type, row) {
                        if (data == null) return '';
                        if (type === "sort" || type === "type") {
                            return data;
                        }
                        return moment(data).format("DD-MM-YYYY HH:mm");
                    }
                },
                {
                    "data": null, sortable: false, "targets": -1, "defaultContent": " <button type=\"button\" class=\"btn btn-icon edit-user\" aria-label=\"Product details\"><i class=\"fa fa-eye\"></i></button>",
                },

            ],
            lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
            pageLength: 10,
            scrollY: 'auto',
            scrollX: false,
            responsive: true,
            autoWidth: false
        });
        hideLoader();
    }

    $('body').delegate('.edit-user', 'click', function (e) {
        e.preventDefault();
        var data = table.row($(this).parents('tr')).data();
        $scope.order = data;
        $scope.orderDetail = data.orderDetail;
        if ($scope.order.deliveryDate != null) {
            $scope.order.deliveryDate = new Date($scope.order.deliveryDate);
        }
        $timeout(function () {
            $timeout(function () {
                $('#repeatSelect').val($scope.order.orderStatus);
            }, 200);
            $('#repeatSelect').val($scope.order.orderStatus);
            $('#modal-lg').modal('show');

        }, 200);
    });

    $scope.showFilePopup = function (product) {
        if (product.fileType == 1) {

            $scope.selectedProduct = product;
            $scope.fields = JSON.parse($scope.selectedProduct.settingModal).fields
            $('#shopping-review-popup').modal('show');
        }
        if (product.fileType == 2) {
            $scope.selectedProduct = product;
            $('#design-review-popup').modal('show');
        }
        if (product.fileType == 3) {
            getListfile(product.transactionId);
            $scope.selectedProduct = product;
            $('#upload-review-popup').modal('show');
        }
        console.log(product);
    }
    function getListfile(transactionId) {
        productService.getListFileName(transactionId).then(function (response) {
            $scope.selectedProduct.imageUrls = response.data;
        },
            function (err) {
                Notification.error('Vui lòng kiểm tra lại.');
                hideLoader();
            });
    }

}]);
;'use strict';
thegioistickerApp.controller('productDetailController', ['$scope', '$timeout', 'productService', 'localStorageService', 'Notification', 'invoiceService', 'sampleService', '$compile', function ($scope, $timeout, productService, localStorageService, Notification, invoiceService, sampleService, $compile) {
    var url = new URL(location.href);
    var searchParams = new URLSearchParams(url.search);
    var url = location.pathname.split('chi-tiet-san-pham/')[1];
    $scope.samples = [];
    $scope.products = [];
    $scope.productsId = [];
    productService.getProductBySeoUrl(url).then(function (results) {
        $scope.product = results.data;
        $scope.shoppingCart.material = $scope.product;
        //$scope.shoppingCart.material = $scope.printingCategory.find(function (element) {
        //    return element.id == $scope.product.id;
        //});
        $("#view-content").empty();
        $("#view-content").append($scope.product.description);
        $scope.productsId = results.data.productSample;
        initSample();
        hideLoader();
    }, function (error) {
        //alert(error.data.message);
    });
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
        })
    }
    function initSlider(product) {
        $('.detail-slider .slider-for').slick('destroy');
        $('.detail-slider .slider-nav').slick('destroy');
        var divElement = angular.element(document.querySelector('.detail-slider'));
        divElement.empty();
        var sliderFor = '<div class="slider slider-for">';
        angular.forEach(product, function (value, key) {
            sliderFor = sliderFor + '<div class="img-outline ng-scope"><img style="cursor:pointer;" class="img-responsive" src="' + value.image + '"></div>';
            //sliderFor = sliderFor + '<div class="img-outline ng-scope"><img ng-click="showLibrary(' + value.id + ')" style="cursor:pointer;" class="img-responsive" src="' + value.image + '"></div>';
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
            slidesToShow: 3, // 3,
            slidesToScroll: 1,
            autoplay: true,
            asNavFor: '.detail-slider .slider-for',
            dots: false,
            centerMode: true,
            focusOnSelect: true
        });
    }
    function initSample() {
        productService.getSampleByProductBySeoUrl(url).then(function (results) {
            $scope.products = results.data;
            initSlider($scope.products);
            hideLoader();
        }, function (error) {
            //alert(error.data.message);
        });
    }
    
    $('body').delegate('.categories li', 'click', function (e) {
        e.preventDefault();
        $('.categories li.active').removeClass('active');
        $(this).addClass('active');
    });
    $scope.viewDetail = function (Id) {
        window.location.href = '/chi-tiet-san-pham/' + Id + '';
    };
}]);
;'use strict';
thegioistickerApp.controller('galleryController', ['$scope', '$timeout', 'productService', 'localStorageService', 'Notification', 'sampleService', '$compile', 'invoiceService', function ($scope, $timeout, productService, localStorageService, Notification, sampleService, $compile, invoiceService) {
    $scope.products = [];
    $scope.numPerPage = 12;
    $scope.noOfPages = 1;
    $scope.currentPage = 1;
    $scope.currentCategory = 1;
    $scope.categoryId = 0;
    $scope.samples = [];
    $scope.step = 1;
    $scope.product = {};
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
    $('body').delegate('.categories li', 'click', function (e) {
        e.preventDefault();
        $('.categories li.active').removeClass('active');
        $(this).addClass('active');
    });
    $scope.setPage = function () {
        showLoader();
        sampleService.getSamples($scope.currentPage, $scope.numPerPage, $scope.currentCategory).then(function (results) {
            $scope.noOfPages = results.data.pager.totalPages;
            $scope.totalProduct = results.data.pager.totalItems;
            $scope.products = results.data.items;
            $("html, body").animate({ scrollTop: 0 }, "slow");
            hideLoader();
        }, function (error) {
        });

    };
    $scope.$watch('currentPage', $scope.setPage);
    $scope.searchByCategory = function (categoryId) {
        $scope.currentCategory = categoryId;
        $scope.numPerPage = 12;
        $scope.noOfPages = 1;
        $scope.currentPage = 1;
        $scope.setPage();
    }
    $scope.recentProducts = [];
    if (localStorageService.get('recentProducts') !== null) {
        var products = localStorageService.get('recentProducts').recentProducts;
        $scope.recentProducts = products;
    }
    $scope.viewDetail = function (Id) {
        window.location.href = '/chi-tiet-san-pham/' + Id;
    };
}]);
