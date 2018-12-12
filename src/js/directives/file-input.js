(function () {
    'use strict';

    angular
        .module('app.directives')
        .directive('ngFileInput', directive);

    directive.$inject = ['$parse'];

    function directive($parse) {

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
    }

})();