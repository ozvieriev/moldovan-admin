angular
    .module('app.directives')
    .directive('ngTop', function () {

        return {
            link: link,
            restrict: 'A'
        };

        function link(scope, element, attrs) {

            element.click(function () {

                angular.element('html, body').stop().animate({ scrollTop: 0 }, 500, 'swing');
            });
        }
    });