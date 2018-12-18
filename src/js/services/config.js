angular
    .module('app.services')
    .factory('$config', () => {

        let service = {};

        service.getRemoteHost = () => {

            let hostname = window.location.hostname;
            if (window.location.hostname === 'localhost' && window.location.port === '3000')
                hostname = '192.168.31.239'; //.239

            return hostname;
        };

        return service;
    });