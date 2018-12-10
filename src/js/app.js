var viewsController = 'ui/pages/';

angular.module('app.services', ['ngWebSocket']);
angular.module('app.controllers', []);
angular.module('app.directives', []);
angular.module('app.filters', []);

angular.module('app', ['ngRoute',
    'app.services', 'app.controllers', 'app.directives', 'app.filters'])
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