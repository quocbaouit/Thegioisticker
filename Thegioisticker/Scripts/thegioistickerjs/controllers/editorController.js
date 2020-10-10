'use strict';
thegioistickerApp.controller('editorController', ['$scope', '$timeout', 'faqService', 'localStorageService', 'Notification', 'Fabric', 'FabricConstants', 'Keypress',
    function ($scope, $timeout, faqService, localStorageService, Notification, Fabric, FabricConstants, Keypress) {
    //$scope.faqs = [];
    //faqService.getfaqs().then(function (results) {
    //    debugger;
    //    $scope.faqs = results.data;
    //    hideLoader();
    //}, function (error) {
    //    //alert(error.data.message);
    //});
        hideLoader();
        $scope.fabric = {};
        $scope.FabricConstants = FabricConstants;
        //
        // Creating Canvas Objects
        // ================================================================
        $scope.addShape = function (path) {
            $scope.fabric.addShape('http://fabricjs.com/assets/15.svg');
        };

        //$scope.addImage = function (image) {

        //    $scope.fabric.addImage('/images/uploads/decalgiay.jpg');          
        //};
        document.getElementById('imgLoader').onchange = function handleImage(e) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var imgObj = new Image();
                imgObj.src = event.target.result;
                imgObj.onload = function () {
                    var image = new fabric.Image(imgObj);
                    $scope.fabric.addImageFromResource(image);
                }
            }
            reader.readAsDataURL(e.target.files[0]);
        }
        $scope.addRect = function () {
            $scope.fabric.addRect();
        };
        $scope.addImageUpload = function (data) {
            var obj = angular.fromJson(data);
            $scope.addImage(obj.filename);
        };

        //
        // Editing Canvas Size
        // ================================================================
        $scope.selectCanvas = function () {
            $scope.canvasCopy = {
                width: $scope.fabric.canvasOriginalWidth,
                height: $scope.fabric.canvasOriginalHeight
            };
        };

        $scope.setCanvasSize = function () {
            $scope.fabric.setCanvasSize($scope.canvasCopy.width, $scope.canvasCopy.height);
            $scope.fabric.setDirty(true);
            delete $scope.canvasCopy;
        };
        $scope.loadJSON = function () {
            var json = '{"objects":[{"type":"text","originX":"left","originY":"top","left":74.75,"top":24,"width":77.0703125,"height":52,"fill":"#454545","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","originalScaleX":1,"originalScaleY":1,"originalLeft":74.75390625,"originalTop":24,"lineHeight":1.3,"lockMovementX":false,"lockMovementY":false,"lockScalingX":false,"lockScalingY":false,"lockUniScaling":false,"lockRotation":false,"id":1630,"text":"AYE","fontSize":40,"fontWeight":"normal","fontFamily":"arial","fontStyle":"","textDecoration":"","textAlign":"left","path":null,"textBackgroundColor":"","useNative":true}],"background":"#ffffff","height":300,"width":300,"originalHeight":300,"originalWidth":300}';
            if ($scope.temp) {
                $scope.fabric.loadJSON($scope.temp);
            }

        };
        $scope.getCanvasData = function () {
            $scope.temp = $scope.fabric.getJSON();
            $scope.fabric.clearCanvas();
            $scope.fabric.setDirty(true);
            $scope.loadJSON();
        }
        //
        // Init
        // ================================================================
        $scope.init = function () {
            $scope.fabric = new Fabric({
                JSONExportProperties: FabricConstants.JSONExportProperties,
                textDefaults: FabricConstants.textDefaults,
                shapeDefaults: FabricConstants.shapeDefaults,
                json: {},
            });
            $scope.loadJSON();
        };

        $scope.$on('canvas:created', $scope.init);

        Keypress.onSave(function () {
            $scope.updatePage();
        });
}]);