(function () {
    'use strict';

    angular
        .module('app.directives')
        .directive('ngBalloon', directive);

    directive.$inject = ['$parse'];

    function directive($parse) {

        return {
            link: link,
            restrict: 'A'
        };

        function link($scope, element, attrs) {

            element
                .attr('data-balloon-length', 'large')
                .attr('data-balloon-pos', 'right')
                .attr('data-balloon', attrs.ngBalloon)
                .html('<i class="glyphicon glyphicon-info-sign"></i>');
        }
    }

})();