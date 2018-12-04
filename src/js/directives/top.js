(function () {
    'use strict';

    angular
        .module('app.directives')
        .directive('ngTop', directive);

    function directive() {

        return {
            link: link,
            restrict: 'A'
        };

        function link(scope, element, attrs) {

            element.click(function () {

                angular.element('html, body').stop().animate({ scrollTop: 0 }, 500, 'swing');
            });
        }
    }

})();