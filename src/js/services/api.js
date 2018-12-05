(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('$api', factory);

    factory.$inject = ['$websocket'];

    var CMD = {
        ledChange: 1,
        ledChanged: 2
    }

    function factory($websocket) {

        var service = {};

        var ws = $websocket('ws://192.168.31.50/ws');
        var _send = function (json) {

            ws.send(JSON.stringify(json));
        };
        var _onCommand = function (json) {

            debugger;
        };

        ws.onMessage(function (response) {

            if (!response || !response.data)
                return console.warn('WS: Empty data');

            var json = {};
            try { json = JSON.parse(response.data); }
            catch{ return console.warn('WS: Can not desiarilize the response', response.data); }

            if (!json.cmd)
                return console.warn('WS: Unknown command', json);

            _onCommand(json);
        });

        service.led = {};
        service.led.change = function (json) {

            var index = json.index;
            var value = json.value;

            if (typeof value === 'boolean')
                value = +value;

            _send({ cmd: CMD.ledChange, args: [index, value] });
        };

        return service;
    };
})();