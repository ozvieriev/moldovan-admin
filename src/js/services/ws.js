(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('$ws', factory);

    factory.$inject = ['$rootScope', '$websocket', '$config'];

    function factory($rootScope, $websocket, $config) {

        var service = {};

        var _ws = $websocket('ws://' + $config.getRemoteHost() + '/ws');
        var _onCommand = function (json) {

            console.log(json);
            $rootScope.$emit('ws:event', json);
            $rootScope.$emit('ws:event:' + json.cmd, json);
        };

        _ws.onMessage(function (response) {

            if (!response || !response.data)
                return console.warn('WS: Empty data');

            var json = {};
            try { json = JSON.parse(response.data); }
            catch (error) { return console.warn('WS: Can not desiarilize the response', response.data); }

            if (!json.cmd)
                return console.warn('WS: Unknown command', json);

            _onCommand(json);
        });

        service.send = function (json) {

            for (var key in json) {

                var value = json[key];
                if (typeof value === 'boolean')
                    json[key] = +value;
            }

            _ws.send(JSON.stringify(json));
            $rootScope.$emit('ws:send', json);
        };

        service.ctrl = {};
        service.ctrl.change = function (json) {

            json.cmd = 'ctrl';
            service.send(json);
        };

        service.wifi = {};
        service.wifi.scan = function () {
            service.send({ cmd: 'state', wifi: 'scan' });
        };

        return service;
    };
})();