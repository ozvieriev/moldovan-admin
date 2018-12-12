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
                hostname = '192.168.31.50';

            return hostname;
        };

        return service;
    };
})();