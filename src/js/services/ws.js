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