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

            // if (transitions.to().name !== 'index' && !$ws.isReady())
            //     return transitions.router.stateService.target('index');
        });
    })
    .config(($stateProvider, $urlRouterProvider) => {

        // $locationProvider.html5Mode({
        //     enabled: true,
        //     requireBase: false
        // });

        $urlRouterProvider.otherwise('/');

        var _when = function (href, controller) {

            $stateProvider.
                state(href, {
                    url: `/${href}`,
                    templateUrl: `pages/${href}.html`,
                    controller: `${controller}Controller`
                });
        };
        _when('index', 'index');
        _when('control', 'control');
        _when('settings/hardware-settings', 'settingsHardwareSettings');
        _when('settings/mqtt-settings', 'settingsMqttSettings');
        _when('settings/ntp-time-settings', 'settingsNtpTimeSettings');
        _when('settings/update', 'settingsUpdate');
        _when('settings/wireless-network', 'settingsWirelessNetwork');

    });

//https://github.com/modularcode/modular-admin-angularjs/blob/master/src/_main.js