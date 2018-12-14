angular
    .module('app.services')
    .factory('$config', function () {

        var service = {};

        service.getRemoteHost = function () {

            var hostname = window.location.hostname;
            if (window.location.hostname === 'localhost' && window.location.port === '3000')
                hostname = '192.168.31.50'; //.239

            return hostname;
        };

        return service;
    });