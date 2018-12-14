angular
    .module('app.directives')
    .directive('ngFileInput', ['$parse', function ($parse) {

        return {
            link: link,
            restrict: 'A'
        };

        function link($scope, element, attrs) {

            element.bind('change', function () {

                $parse(attrs.ngFileInput)
                    .assign($scope, element[0].files);

                $scope.$apply();
            });
        }
    }]);