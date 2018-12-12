(function () {
    'use strict';

    angular
        .module('app.directives')
        .directive('ngDebug', directive);

    directive.$inject = ['$rootScope', '$ws'];

    function directive($rootScope, $ws) {

        return {
            link: link,
            restrict: 'A',
            replace: true,
            templateUrl: 'directives/debug.html',
            scope: {}
        };

        function link(scope, element, attrs) {

            scope.model = { log: '', message: '' };

            var _log = function (log) {

                var dateTime = new Date();

                var dateTimeFormat = [dateTime.getHours(), dateTime.getMinutes(), dateTime.getSeconds()].join(':');
                var line = [dateTimeFormat, log].join(' - ') + '\n'

                scope.model.log = line + scope.model.log;
            };

            scope.send = function () {

                try { $ws.send(JSON.parse(scope.model.message)); }
                catch (error) { _log('error - ' + error); }
            };

            $rootScope.$on('ws:send', function (event, json) {
                _log('ws:send - ' + JSON.stringify(json));
            });
            $rootScope.$on('ws:event', function (event, json) {
                _log('ws:event - ' + JSON.stringify(json));
            });

            var $textarea = element.find('textarea');
            element.css({ position: 'fixed', right: '20px', bottom: 0, width: '500px' });
            $textarea.css({ resize: 'none', 'background-color': '#000', color: '#0f0', 'font-size': '80%', width: '100%', height: '250px', 'line-height': '100%' });
        }
    };


})();