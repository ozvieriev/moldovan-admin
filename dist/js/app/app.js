var viewsController = 'pages/';

angular.module('app.services', ['ngWebSocket']);
angular.module('app.controllers', []);
angular.module('app.directives', []);
angular.module('app.filters', []);

angular.module('app', ['ngRoute',
    'app.services', 'app.controllers', 'app.directives', 'app.filters'])
    .run(function($templateCache){

        $('script[type="text/ng-template"]').each(function(){

            var element = angular.element(this);
            $templateCache.put(element.attr('id'), element.html());
        });

        //<script id="directives/sidebar.html" type="text/ng-template"><
    })
    .config(function ($routeProvider) {

        var _when = function (href, controller) {

            $routeProvider.
                when(`/${href}`, {
                    templateUrl: `${viewsController}${href}.html`,
                    controller: `${controller}Controller`
                });
        };

        $routeProvider.
            when('/control', {
                templateUrl: `${viewsController}control.html`,
                controller: 'controlController'
            }).
            otherwise({ redirectTo: '/control' });

        _when('settings/hardware-settings', 'settingsHardwareSettings');
        _when('settings/mqtt-settings', 'settingsMqttSettings');
        _when('settings/ntp-time-settings', 'settingsNtpTimeSettings');
        _when('settings/update', 'settingsUpdate');
        _when('settings/wireless-network', 'settingsWirelessNetwork');

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

            $scope.serverRange = json.g1;
        });
    };

})();
(function () {
    'use strict';

    angular
        .module('app.directives')
        .directive('ngDebug', directive);

    directive.$inject = ['$rootScope', '$api'];

    function directive($rootScope, $api) {

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

                var dateTimeFormat = `${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`;
                var line = `${dateTimeFormat} - ${log}\n`;

                scope.model.log = line + scope.model.log;
            };

            scope.send = function () {

                try { $api.send(JSON.parse(scope.model.message)); }
                catch (error) { _log(`error - ${error}`); }
            };

            $rootScope.$on('ws:send', function (event, json) {
                _log(`ws:send - ${JSON.stringify(json)}`);
            });
            $rootScope.$on('ws:event', function (event, json) {
                _log(`ws:event - ${JSON.stringify(json)}`);
            });

            var $textarea = element.find('textarea');
            element.css({ position: 'fixed', right: '20px', bottom: 0, width: '500px' });
            $textarea.css({ resize: 'none', 'background-color': '#000', color: '#0f0', 'font-size': '80%', width: '100%', height: '250px', 'line-height': '100%' });
        }
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
        .directive('ngSidebar', directive);

    function directive() {

        return {
            link: link,
            restrict: 'A',
            replace: true,
            templateUrl: 'directives/sidebar.html',
            scope: {}
        };

        function link(scope, element, attrs) {

            scope.items = viewSidebarBuilder.build();
        }
    };

    var viewSidebar = function (id, title, href) {

        this.id = id;
        this.title = title;
        this.href = href || null;
        this.items = [];
    };
    viewSidebar.prototype.addItems = function (items) {

        angular.forEach(items, function (item) {
            this.push(item);
        }, this.items);

        return this;
    };
    viewSidebar.prototype.setIcon = function (icon) {

        this.icon = icon;
        return this;
    };
    viewSidebar.prototype.addItems = function (items) {

        angular.forEach(items, function (item) {
            this.push(item);
        }, this.items);

        return this;
    };

    var viewSidebarBuilder = function () { };
    viewSidebarBuilder.build = function () {

        return [
            new viewSidebar('control', 'Control', '#!control')
                .setIcon('wrench'),
            new viewSidebar('settings', 'Settings')
                .setIcon('cogs')
                .addItems([
                    new viewSidebar('wireless-network', 'Wireless Network', '#!settings/wireless-network')
                        .setIcon('internet-explorer'),
                    new viewSidebar('hardware-settings', 'Hardware Settings', '#!settings/hardware-settings')
                        .setIcon('wrench'),
                    new viewSidebar('mqtt-settings', 'MQTT Settings', '#!settings/mqtt-settings')
                        .setIcon('cog'),
                    new viewSidebar('ntp-time-settings', 'NTP (Time) Settings', '#!settings/ntp-time-settings')
                        .setIcon('clock-o'),
                    new viewSidebar('update', 'Update', '#!settings/update')
                        .setIcon('angle-double-up')
                ])
        ];
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

    factory.$inject = ['$rootScope', '$ws'];

    function factory($rootScope, $ws) {

        var service = {};

        var ws = $ws.createInstance();
        var _onCommand = function (json) {

            console.log(json);
            $rootScope.$emit(`ws:event`, json);
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

        service.send = function (json) {

            for (var key in json) {

                var value = json[key];
                if (typeof value === 'boolean')
                    json[key] = +value;
            }

            ws.send(JSON.stringify(json));
            $rootScope.$emit(`ws:send`, json);
        };

        service.ctrl = {};
        service.ctrl.change = function (json) {

            json.cmd = 'ctrl';
            service.send(json);
        };

        service.wifi = {};
        service.wifi.scan = function () {
            service.send({ cmd: 'state', wifi: 'scan' });
        };

        return service;
    };
})();
(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('$dict', factory);

    factory.$inject = [];

    function factory() {

        var service = {};

        service.wifiModes = function () {

            return [
                new viewWifiMode('access-point', 'Access Point'),
                new viewWifiMode('client', 'Client')
            ];
        };

        return service;
    };

    var viewWifiMode = function (id, title) {

        this.id = id;
        this.title = title;
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
(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('$ws', factory);

    factory.$inject = ['$websocket'];

    function factory($websocket) {

        var service = {};

        service.createInstance = function () {

            var hostname = window.location.hostname;
            if (window.location.hostname === 'localhost' && window.location.port === '3000')
                hostname = '192.168.31.50';

            return $websocket(`ws://${hostname}/ws`);
        };

        return service;
    };
})();
(function () {

    'use strict';

    angular.module('app.controllers')
        .controller('settingsHardwareSettingsController', controller);

    controller.$inject = ['$rootScope', '$scope', '$api'];

    function controller($rootScope, $scope, $api) {

        $scope.$api = $api;
    };

})();
(function () {

    'use strict';

    angular.module('app.controllers')
        .controller('settingsMqttSettingsController', controller);

    controller.$inject = ['$rootScope', '$scope', '$api'];

    function controller($rootScope, $scope, $api) {

        $scope.$api = $api;
    };

})();
(function () {

    'use strict';

    angular.module('app.controllers')
        .controller('settingsNtpTimeSettingsController', controller);

    controller.$inject = ['$rootScope', '$scope', '$api'];

    function controller($rootScope, $scope, $api) {

        $scope.$api = $api;
    };

})();
(function () {

    'use strict';

    angular.module('app.controllers')
        .controller('settingsUpdateController', controller);

    controller.$inject = ['$rootScope', '$scope', '$api'];

    function controller($rootScope, $scope, $api) {

        $scope.$api = $api;
    };

})();
(function () {

    'use strict';

    angular.module('app.controllers')
        .controller('settingsWirelessNetworkController', controller);

    controller.$inject = ['$rootScope', '$scope', '$api'];

    function controller($rootScope, $scope, $api) {

        $scope.$api = $api;

        $scope.autoDisableWifis = [
            new viewAutoDisableWifi('Always on', null),
            new viewAutoDisableWifi('3 min', 3),
            new viewAutoDisableWifi('4 min', 4),
            new viewAutoDisableWifi('5 min', 5),
            new viewAutoDisableWifi('10 min', 10),
            new viewAutoDisableWifi('15 min', 15),
            new viewAutoDisableWifi('30 min', 30),
        ];
        $scope.wifis = null;

        $scope.model = {
            wifiMode: 'access-point',
            ssid: 'SMC',
            bssid: 'aa:bb:Cc:dd:ee',
            isHideNetworkName: false,
            isUseDHCP: true,
            autoDisableWifi: $scope.autoDisableWifis[0]
        };

        $rootScope.$on('ws:event:wifi-list', function (event, json) {

            if (typeof json.networks === 'undefined')
                return;

            var networks = [];
            angular.forEach(json.networks, function (item) {
                this.push(new viewNetwork(item));
            }, networks);
            $scope.networks = networks;
        });
    };

    var viewAutoDisableWifi = function (name, value) {

        this.name = name;
        this.value = value;
    };
    var viewNetwork = function (json) {

        this.ssid = json.ssid;
        this.bssid = json.bssid;
        this.rssi = json.rssi;

        this.name = `BSSID: ${this.bssid}, RSSI: ${this.rssi}, Network: ${this.ssid}`;
    };


})();