angular
    .module('app.directives')
    .directive('ngDebug', ['$rootScope', '$ws', ($rootScope, $ws) => {

        return {
            link: (scope, element, attrs) => {

                scope.model = { log: '', message: '' };

                var _log = (log) => {

                    var dateTime = new Date();

                    var dateTimeFormat = [dateTime.getHours(),
                    dateTime.getMinutes(),
                    dateTime.getSeconds()].join(':');

                    var line = [dateTimeFormat, log].join(' - ') + '\n'

                    scope.model.log = line + scope.model.log;
                };

                scope.send = () => {

                    try { $ws.send(JSON.parse(scope.model.message)); }
                    catch (error) { _log('error - ' + error); }
                };

                $rootScope.$on('ws:send', (event, json) => {
                    _log('ws:send - ' + JSON.stringify(json));
                });
                $rootScope.$on('ws:event', (event, json) => {
                    _log('ws:event - ' + JSON.stringify(json));
                });

                var $textarea = element.find('textarea');
                element.css({ position: 'fixed', right: '20px', bottom: 0, width: '500px' });
                $textarea.css({ resize: 'none', 'background-color': '#000', color: '#0f0', 'font-size': '80%', width: '100%', height: '250px', 'line-height': '100%' });
            },
            restrict: 'A',
            replace: true,
            templateUrl: 'directives/debug.html',
            scope: {}
        };
    }]);