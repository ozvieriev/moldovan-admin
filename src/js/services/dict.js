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