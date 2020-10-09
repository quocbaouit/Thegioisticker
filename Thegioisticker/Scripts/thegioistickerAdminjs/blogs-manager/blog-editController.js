'use strict';
thegioistickerAdmin.controller('blogEditController', ['$scope', '$timeout', 'Notification', 'blogService', '$state', '$location', 'authService', '$window', '$stateParams', function ($scope, $timeout, Notification, blogService, $state, $location, authService, $window, $stateParams) {
    var table = {};
    $scope.blog = {};
    $scope.blogId = $stateParams.blogId;
    $('#summernoteBlog').summernote({
        placeholder: 'Nội Dung',
        tabsize: 2,
        height: 600,
        width:1560
    });
    blogService.getblogById($scope.blogId).then(function (results) {
        $scope.blog = results.data;
        var markupStr = results.data.content;
        $('#summernoteBlog').summernote('code', markupStr);
        hideLoading();
    }, function (error) {
        //alert(error.data.message);
    });
    $scope.saveBlog = function () {
        var markupStr = $('#summernoteBlog').summernote('code');
        $scope.blog.content = markupStr;
        blogService.saveblog($scope.blog).then(function (response) {
            Notification.success("Lưu thành công");
            $state.go('admin.blogs');
        },
			function (err) {
			    $scope.waringMessage = "Vui lòng kiểm tra lại";
			});
    };
    //File
    $scope.uploading = false;
    $scope.countFiles = '';
    $scope.data = []; //For displaying file name on browser
    $scope.formdata = new FormData();
    $scope.hasUpload = false;
    $scope.getFiles = function (file) {
        angular.forEach(file, function (value, key) {
            $scope.formdata.append(key, value);
            $scope.data.push({ FileName: value.name, FileLength: value.size });

        });
        $scope.countFiles = $scope.data.length == 0 ? '' : $scope.data.length + ' files selected';
        $scope.hasUpload = true;
        $scope.$apply();
        $scope.formdata.append('countFiles', $scope.countFiles);

    };
    $scope.setFiles = function (element) {
        $scope.$apply(function (scope) {
            $scope.files = [];
            for (var i = 0; i < element.files.length; i++) {
                scope.files.push(element.files[i])
            }
        });
    };
    $scope.uploadFiles = function () {
        $scope.uploading = true;
        blogService.uploadFiles($scope)
            .then(function (data) {
                $scope.uploading = false;
                if (data != '') {
                    $scope.blog.image = data;
                    Notification.primary('Tải file thành công.');
                    $scope.formdata = new FormData();
                    $scope.data = [];
                    $scope.countFiles = '';
                    $scope.$apply;
                    $scope.saveBlog();
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

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#picture').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#imgInp").change(function () {
        readURL(this);
    });
    //End File
}]);