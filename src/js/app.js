angular.module('app.services', ['ngWebSocket']);
angular.module('app.controllers', []);
angular.module('app.directives', []);
angular.module('app.filters', []);

angular.module('app', ['ngRoute',
    'app.services', 'app.controllers', 'app.directives', 'app.filters'])
    .run(function ($templateCache) {

        var tempaltes = document.querySelectorAll('script[type="text/ng-template"]');
        angular.forEach(tempaltes, function (template) {
            $templateCache.put(template.id, template.innerHTML);
        });
    })
    .config(function ($routeProvider) {

        var _when = function (href, controller) {

            $routeProvider.
                when(`/${href}`, {
                    templateUrl: `pages/${href}.html`,
                    controller: `${controller}Controller`
                });
        };

        $routeProvider.
            when('/control', {
                templateUrl: `pages/control.html`,
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