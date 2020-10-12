thegioistickerApp.directive('numberInput', numOnly).directive('intergerInput', numOnlyInt)
    .directive('myDirectory', ['$parse', function ($parse) {

        function link(scope, element, attrs) {
            var model = $parse(attrs.myDirectory);
            element.on('change', function (event) {
                scope.data = [];    //Clear shared scope in case user reqret on the selection
                model(scope, { file: event.target.files });

            });
        };
        return {
            link: link
        }
    }]);
function numOnly() {
    var directive = {
        restrict: 'A',
        scope: {
            ngModel: '=ngModel'
        },
        link: link
    };
    return directive;
    function link(scope, element, attrs) {
        scope.$watch('ngModel', function (newVal, oldVal) {
            var arr = String(newVal).split('');
            if (arr.length === 0) return;
            if (arr.length === 1 && (arr[0] === '-' || arr[0] === '.')) return;
            if (isNaN(newVal)) {
                scope.ngModel = oldVal;
            }
        });
    }
}
//sieuvietApp.directive('intergerInput', numOnlyInt);
function numOnlyInt() {
    var directive = {
        restrict: 'A',
        scope: {
            ngModel: '=ngModel'
        },
        link: link
    };
    return directive;
    function link(scope, element, attrs) {
        scope.$watch('ngModel', function (newVal, oldVal) {
            var arr = String(newVal).split('');
            if (arr.length === 0) return;
            if (arr.length === 1 && (arr[0] === '-' || arr[0] === '.')) return;
            if (isNaN(newVal) || !Number.isInteger(parseFloat(newVal))) {
                scope.ngModel = oldVal;
            }
        });
    }
}
