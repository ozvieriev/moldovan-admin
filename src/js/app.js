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