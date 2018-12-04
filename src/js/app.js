var angular = require('lib/angularjs')

(function () {

    angular.module('app.services', []);
    angular.module('app.controllers', []);
    angular.module('app.directives', []);
    angular.module('app.filters', []);

    angular.module('app', ['ngRoute',
        'app.services', 'app.controllers', 'app.directives', 'app.filters'])
        .config(function ($routeProvider) {

             $routeProvider.
                 when("/storage", {
                     templateUrl: "ui/storage.html",
                     controller: "storageController"
                 }).
                 when("/url-builder", {
                    templateUrl: "ui/url-builder.html",
                     controller: "urlBuilderController"
                 }).
                 otherwise({ redirectTo: '/url-builder' });
        });
})();

//https://github.com/modularcode/modular-admin-angularjs/blob/master/src/_main.js