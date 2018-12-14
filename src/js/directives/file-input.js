angular
    .module('app.directives')
    .directive('ngFileInput', ['$parse', ($parse) => {

        return {
            link: ($scope, element, attrs) => {

                element.bind('change', function () {

                    $parse(attrs.ngFileInput)
                        .assign($scope, element[0].files);

                    $scope.$apply();
                });
            },
            restrict: 'A'
        };
    }]);