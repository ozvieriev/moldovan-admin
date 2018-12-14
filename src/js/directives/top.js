angular
    .module('app.directives')
    .directive('ngTop', () => {

        return {
            link: (scope, element, attrs) => {

                element.click(function () {

                    angular.element('html, body').stop().animate({ scrollTop: 0 }, 500, 'swing');
                });
            },
            restrict: 'A'
        };
    });