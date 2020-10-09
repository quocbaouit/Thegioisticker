'use strict';
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