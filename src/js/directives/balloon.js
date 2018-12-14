angular
    .module('app.directives')
    .directive('ngBalloon', () => {

        return {
            link: ($scope, element, attrs) => {

                element
                    .attr('data-balloon-length', 'large')
                    .attr('data-balloon-pos', 'right')
                    .attr('data-balloon', attrs.ngBalloon)
                    .html('<i class="glyphicon glyphicon-info-sign"></i>');
            },
            restrict: 'A'
        };
    });