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
            when('/storage', {
                templateUrl: `${viewsController}storage.html`,
                controller: 'storageController'
            }).
            when("/url-builder", {
                templateUrl: `${viewsController}url-builder.html`,
                controller: 'urlBuilderController'
            }).
            otherwise({ redirectTo: '/url-builder' });
    });

//https://github.com/modularcode/modular-admin-angularjs/blob/master/src/_main.js