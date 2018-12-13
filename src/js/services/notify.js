(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('$notify', factory);

    factory.$inject = ['$timeout'];

    function factory($timeout) {

        var service = {};

        var _notify = function (title, options) {

            if (!window.Notification)
                return console.log('Web Notification not supported');

            window.Notification.requestPermission(function (permission) {

                if (permission !== 'granted')
                    return;

                options = options || {};
                options.body = options.body || '';

                var notification = new window.Notification(title, options);
                $timeout(notification.close, 3 * 1000);
            });
        };

        service.info = _notify;
        service.warning = _notify;
        service.success = _notify;
        service.error = _notify;
        service.serverError = function () {

            this.error('An error has occured. Please try again or contact us.');
        };

        return service;
    };
})();