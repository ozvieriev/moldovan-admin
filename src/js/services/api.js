(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('$api', factory);

    factory.$inject = ['$rootScope', '$ws'];

    function factory($rootScope, $ws) {

        var service = {};

        var ws = $ws.createInstance();
        var _onCommand = function (json) {

            console.log(json);
            $rootScope.$emit(`ws:event`, json);
            $rootScope.$emit(`ws:event:${json.cmd}`, json);
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

        service.send = function (json) {

            for (var key in json) {

                var value = json[key];
                if (typeof value === 'boolean')
                    json[key] = +value;
            }

            ws.send(JSON.stringify(json));
            $rootScope.$emit(`ws:send`, json);
        };

        service.led = {};
        service.led.change = function (json) {

            var index = json.index;
            var value = json.value;

            if (typeof value === 'boolean')
                value = +value;

            service.send({ cmd: CMD.ledChange, args: [index, value] });
        };

        service.ctrl = {};
        service.ctrl.change = function (json) {

            json.cmd = 'ctrl';
            service.send(json);
        };

        return service;
    };
})();