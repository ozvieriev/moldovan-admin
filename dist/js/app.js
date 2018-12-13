angular.module('app.services', ['ngWebSocket']);
angular.module('app.controllers', []);
angular.module('app.directives', []);
angular.module('app.filters', []);

angular.module('app', ['ui.router',
    'app.services', 'app.controllers', 'app.directives', 'app.filters'])
    .run(function ($trace, $transitions, $templateCache, $ws) {

        $trace.enable('TRANSITION');

        var tempaltes = document.querySelectorAll('script[type="text/ng-template"]');
        angular.forEach(tempaltes, function (template) {
            $templateCache.put(template.id, template.innerHTML);
        });

        $transitions.onBefore({ to: '**' }, function (transitions) {

            if (transitions.to().name !== 'index' && !$ws.isReady())
                return transitions.router.stateService.target('index');
        });
    })
    .config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'pages/index.html',
                controller: 'indexController'
            })
            .state('control', {
                url: '/control',
                templateUrl: 'pages/control.html',
                controller: 'controlController'
            })

        var _when = function (href, controller) {

            $stateProvider.
                state(href, {
                    url: '/' + href,
                    templateUrl: ['pages/', href, '.html'].join(''),
                    controller: [controller, 'Controller'].join('')
                });
        };

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
        .controller('appController', controller);

    controller.$inject = ['$rootScope', '$scope', '$state', '$ws'];

    function controller($rootScope, $scope, $state, $ws) {

        $scope.$ws = $ws;

        $ws.config.get();
        $rootScope.$on('ws:event:cfg', function (event, json) {

            if ($state.$current.name === 'index')
                $state.go('control');
        });
    };

})();
(function () {

    'use strict';

    angular.module('app.controllers')
        .controller('controlController', controller);

    controller.$inject = ['$rootScope', '$scope', '$ws'];

    function controller($rootScope, $scope, $ws) {

        $scope.$ws = $ws;

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

    angular.module('app.controllers')
        .controller('indexController', controller);

    controller.$inject = ['$scope'];

    function controller($scope) { };

})();
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
            new viewSidebar('control', 'Control', 'control')
                .setIcon('wrench'),
            new viewSidebar('settings', 'Settings')
                .setIcon('cog')
                .addItems([
                    new viewSidebar('wireless-network', 'Wireless Network', 'settings/wireless-network')
                        .setIcon('signal'),
                    new viewSidebar('hardware-settings', 'Hardware Settings', 'settings/hardware-settings')
                        .setIcon('wrench'),
                    new viewSidebar('mqtt-settings', 'MQTT Settings', 'settings/mqtt-settings')
                        .setIcon('cog'),
                    new viewSidebar('ntp-time-settings', 'NTP (Time) Settings', 'settings/ntp-time-settings')
                        .setIcon('cloud'),
                    new viewSidebar('update', 'Update', 'settings/update')
                        .setIcon('upload')
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

    factory.$inject = ['$http', '$config'];

    function factory($http, $config) {

        var service = {};

        service.update = function (files) {

            var formData = new FormData();
            angular.forEach(files, function (file) {
                formData.append('file', file);
            });

            return $http.post('http://' + $config.getRemoteHost() + '/update/', formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            });
        };

        return service;
    };
})();
(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('$config', factory);

    function factory() {

        var service = {};

        service.getRemoteHost = function () {

            var hostname = window.location.hostname;
            if (window.location.hostname === 'localhost' && window.location.port === '3000')
                hostname = '192.168.31.50'; //.239

            return hostname;
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

    factory.$inject = ['$timeout'];

    function factory($timeout) {

        var service = {};

        var _notify = function (title, options) {

            if (!window.Notification)
                return console.log('Web Notification not supported');

            window.Notification.requestPermission(function (permission) {

                if (permission !== 'granted')
                    return;

                options = options || {};
                options.body = options.body || '';

                var notification = new window.Notification(title, options);
                $timeout(notification.close, 3 * 1000);
            });
        };

        service.info = _notify;
        service.warning = _notify;
        service.success = _notify;
        service.error = _notify;
        service.serverError = function () {

            this.error('An error has occured. Please try again or contact us.');
        };

        return service;
    };
})();
(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('$ws', factory);

    factory.$inject = ['$rootScope', '$websocket', '$config'];

    function factory($rootScope, $websocket, $config) {

        var service = {};

        var _config = null;
        var _ws = $websocket('ws://' + $config.getRemoteHost() + '/ws');

        _ws.onMessage(function (response) {

            if (!response || !response.data)
                return console.warn('WS: Empty data');

            var json = {};
            try { json = JSON.parse(response.data); }
            catch (error) { return console.warn('WS: Can not desiarilize the response', response.data); }

            if (!json.cmd)
                return console.warn('WS: Unknown command', json);

            console.log(json);

            if (json.cmd === 'cfg')
                _config = angular.copy(json);

            $rootScope.$emit('ws:event', json);
            $rootScope.$emit('ws:event:' + json.cmd, json);
        });

        service.isReady = function () { return !!_config; };
        service.send = function (json) {

            for (var key in json) {

                var value = json[key];
                if (typeof value === 'boolean')
                    json[key] = +value;
            }

            _ws.send(JSON.stringify(json));
            $rootScope.$emit('ws:send', json);
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

        service.config = {};
        service.config.get = function () {
            service.send({ cmd: 'getcfg' });
        };
        service.config.network = function () {

            return _config.network || null;
        };

        return service;
    };
})();
(function () {

    'use strict';

    angular.module('app.controllers')
        .controller('settingsHardwareSettingsController', controller);

    function controller() { };

})();
(function () {

    'use strict';

    angular.module('app.controllers')
        .controller('settingsMqttSettingsController', controller);

    function controller() { };

})();
(function () {

    'use strict';

    angular.module('app.controllers')
        .controller('settingsNtpTimeSettingsController', controller);

    function controller() { };

})();
(function () {

    'use strict';

    angular.module('app.controllers')
        .controller('settingsUpdateController', controller);

    controller.$inject = ['$scope', '$api'];

    function controller($scope, $api) {

        $scope.model = {};
        $scope.update = function () {

            $api.update($scope.files);
        };
    };

})();
(function () {

    'use strict';

    angular.module('app.controllers')
        .controller('settingsWirelessNetworkController', controller);

    controller.$inject = ['$rootScope', '$scope', '$ws'];

    function controller($rootScope, $scope, $ws) {

        $scope.$ws = $ws;
        $scope.template = null;

        $scope.autoDisableWifis = [
            new viewAutoDisableWifi('Always on', null),
            new viewAutoDisableWifi('3 min', 3),
            new viewAutoDisableWifi('4 min', 4),
            new viewAutoDisableWifi('5 min', 5),
            new viewAutoDisableWifi('10 min', 10),
            new viewAutoDisableWifi('15 min', 15),
            new viewAutoDisableWifi('30 min', 30),
        ];
        $scope.networks = null;

        $scope.model = {
            wifiMode: 'client',
            accessPoint: {
                ssid: null,
                password: null,
                isHideNetworkName: false,
                ipAddress: null,
                subnetMask: null,
                autoDisableWifi: $scope.autoDisableWifis[0]
            },
            client: {
                network: null,
                ssid: null,
                bssid: null,
                password: null,
                isUseDHCP: true,
                ipAddress: null,
                subnetMask: null,
                dnsServer: null,
                gateway: null,
                autoDisableWifi: $scope.autoDisableWifis[0]
            }
        };

        //
        $scope.$watch('model.wifiMode', function (value) {

            $scope.template = 'pages/settings/wireless-network/' + value + '.html';
        });
        $scope.$watch('model.client.network', function (value) {

            $scope.model.client.bssid = (value || {}).bssid || null;
        });

        $rootScope.$on('ws:event:cfg', function (event, json) {

            var network = $ws.config.network();
            if(!network) return;

            
        });
        $rootScope.$on('ws:event:wifi-list', function (event, json) {

            if (json['list'])
                json.networks = json['list'];

            /*************************************/

            if (typeof json.networks === 'undefined')
                return;

            var networks = [];
            angular.forEach(json.networks, function (item) {
                this.push(new viewNetwork(item));
            }, networks);
            $scope.networks = networks;

            if ($scope.model.wifiMode === 'client')
                $scope.model.client.network = networks.length ? networks[0] : null;
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

        this.name = 'BSSID: ' + this.bssid + ', RSSI: ' + this.rssi + ', Network: ' + this.ssid;
    };


})();