(function () {

    angular
        .module('app.services')
        .factory('$dict', function () {

            var service = {};

            service.wifiModes = function () {

                return [
                    new viewWifiMode('access-point', 'Access Point'),
                    new viewWifiMode('client', 'Client')
                ];
            };

            return service;
        });

    var viewWifiMode = function (id, title) {

        this.id = id;
        this.title = title;
    };
})();