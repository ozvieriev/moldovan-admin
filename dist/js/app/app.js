//var angular = require('lib/angularjs')

var viewsController = 'views/';

angular.module('app.services', ['ngWebSocket']);
angular.module('app.controllers', []);
angular.module('app.directives', []);
angular.module('app.filters', []);

angular.module('app', ['ngRoute',
    'app.services', 'app.controllers', 'app.directives', 'app.filters'])
    .config(function ($routeProvider) {

        $routeProvider.
            when('/control', {
                templateUrl: `${viewsController}control.html`,
                controller: 'controlController'
            }).
            otherwise({ redirectTo: '/control' });
    });

//https://github.com/modularcode/modular-admin-angularjs/blob/master/src/_main.js
(function () {

    'use strict';

    angular.module('app.controllers')
        .controller('controlController', controller);

    controller.$inject = ['$rootScope', '$scope', '$api'];

    function controller($rootScope, $scope, $api) {

        $scope.$api = $api;

        $scope.uiRange = 0;
        $scope.serverRange = 0;
        
        $rootScope.$on('ws:event:state', function (event, json) {

            if (typeof json.g1 === 'undefined')
                return;

            $scope.uiRange = json.g1;
            $scope.serverRange = json.g1;
        });
    };

})();
(function () {

    'use strict';
    angular
        .module('app.directives')
        .directive('ngNotifybar', directive);

    directive.$inject = ['$rootScope', '$interval'];

    function directive($rootScope, $interval) {

        var directive = {
            link: link,
            template:
                ['<div class="angular-notify angular-notify-{{::notification.type}} angular-notify-enter" data-ng-repeat="notification in notifications">',
                    '<p class="title" data-ng-bind="::notification.title"></p>',
                    '<p class="notify-content" data-ng-bind="::notification.content"></p>',
                    '<div/>'
                ].join(''),
            scope: {},
            restrict: 'A'
        };
        return directive;

        function link($scope, element, attr) {

            element.css('position', 'fixed');
            $scope.notifications = [];

            var interval = null;

            $rootScope.$on('notify', function (event, json) {

                var notification = new viewNotification(json);
                $scope.notifications.push(notification);

                if (interval)
                    return;

                interval = $interval(function () {

                    var now = new Date();
                    for (var index = 0; index < $scope.notifications.length; index++) {

                        if ($scope.notifications[index].timeoutTime < now)
                            $scope.notifications.splice(index--, 1);
                    }

                    if (!$scope.notifications.length) {

                        $interval.cancel(interval);
                        interval = null;
                    }
                }, 1000);
            });
        }
    }

    var viewNotification = function (json) {

        this.type = json.type;
        this.title = json.title;
        this.content = json.content;

        var timeoutTime = new Date();
        timeoutTime.setMilliseconds(timeoutTime.getMilliseconds() + json.timeout);

        this.timeoutTime = timeoutTime;
    };

})();
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
(function () {

    angular.module('http-notify-interceptor', [])
        .config(['$httpProvider', function ($httpProvider) {

            $httpProvider.interceptors.push(['$q', '$notify', function ($q, $notify) {

                var interceptor = {};

                interceptor.request = function (config) {

                    config.headers = config.headers || {};

                    return config;
                };
                interceptor.response = function (response) {

                    var config = response.config || {};

                    if (config.notify) {

                        if (config.notify.success)
                            $notify.success(config.notify.success);
                    }

                    return response;
                };
                interceptor.responseError = function (rejection) {

                    var config = rejection.config || {};

                    if (config.notify) {

                        if (config.notify.error === true)
                            $notify.serverError();
                        else
                            $notify.error(config.notify.error);
                    }
                    return $q.reject(rejection);
                };

                return interceptor;
            }]);
        }]);
})();

(function () {

    angular.module('http-interceptor', [])
        .config(['$httpProvider', function ($httpProvider) {

            $httpProvider.interceptors.push(['$q', function ($q) {

                var interceptor = {};

                interceptor.request = function (config) {

                    config.headers = config.headers || {};

                    return config;
                };
                interceptor.response = function (response) {
                    
                    var config = response.config || {};

                    if (config.asJson === true)
                        return response.data;

                    return response;
                };

                return interceptor;
            }]);
        }]);
})();

(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('$api', factory);

    factory.$inject = ['$rootScope','$websocket'];

    var CMD = {
        ledChange: 1,
        ledChanged: 2
    }

    function factory($rootScope, $websocket) {

        var service = {};

        var ws = $websocket('ws://192.168.31.50/ws');
        var _send = function (json) {

            for (const key in json) {

                let value = json[key];
                if (typeof value === 'boolean')
                    json[key] = +value;
            }

            ws.send(JSON.stringify(json));
        };
        var _onCommand = function (json) {

            console.log(json);
            $rootScope.$emit(`ws:event:${json.cmd}`, json);
        };

        ws.onMessage(function (response) {

            if (!response || !response.data)
                return console.warn('WS: Empty data');

            var json = {};
            try { json = JSON.parse(response.data); }
            catch{ return console.warn('WS: Can not desiarilize the response', response.data); }

            if (!json.cmd)
                return console.warn('WS: Unknown command', json);

            _onCommand(json);
        });

        service.led = {};
        service.led.change = function (json) {

            var index = json.index;
            var value = json.value;

            if (typeof value === 'boolean')
                value = +value;

            _send({ cmd: CMD.ledChange, args: [index, value] });
        };

        service.ctrl = {};
        service.ctrl.change = function (json) {

            json.cmd = 'ctrl';

            _send(json);
        };

        return service;
    };
})();
(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('$dict', factory);

    factory.$inject = ['$http'];

    function factory($http) {

        var service = {};

        return service;
    };
})();
(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('$notify', factory);

    factory.$inject = ['$rootScope'];

    function factory($rootScope) {

        var service = {};

        var _notify = function (type, options) {

            options.type = type;
            options.timeout = 2 * 1000;

            $rootScope.$emit('notify', options);
        };

        service.info = function (content) {

            _notify('info', { title: 'Information', content: content });
        };
        service.warning = function (content) {

            _notify('warning', { title: 'Warning', content: content });
        };
        service.success = function (content) {

            _notify('success', { title: 'Success', content: content });
        };
        service.error = function (content) {

            _notify('error', { title: 'Error', content: content });
        };
        service.serverError = function () {

            _notify('error', { title: 'Error', content: 'An error has occured. Please try again or contact us.' });
        };

        return service;
    };
})();