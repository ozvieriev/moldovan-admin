(function () {

    'use strict';

    angular.module('app.controllers')
        .controller('settingsWirelessNetworkController', controller);

    controller.$inject = ['$rootScope', '$scope', '$ws'];

    function controller($rootScope, $scope, $ws) {

        $scope.$ws = $ws;

        $scope.autoDisableWifis = [
            new viewAutoDisableWifi('Always on', null),
            new viewAutoDisableWifi('3 min', 3),
            new viewAutoDisableWifi('4 min', 4),
            new viewAutoDisableWifi('5 min', 5),
            new viewAutoDisableWifi('10 min', 10),
            new viewAutoDisableWifi('15 min', 15),
            new viewAutoDisableWifi('30 min', 30),
        ];
        $scope.wifis = null;

        $scope.model = {
            wifiMode: 'access-point',
            ssid: 'SMC',
            bssid: 'aa:bb:Cc:dd:ee',
            isHideNetworkName: false,
            isUseDHCP: true,
            autoDisableWifi: $scope.autoDisableWifis[0]
        };

        $rootScope.$on('ws:event:wifi-list', function (event, json) {

            if (typeof json.networks === 'undefined')
                return;

            var networks = [];
            angular.forEach(json.networks, function (item) {
                this.push(new viewNetwork(item));
            }, networks);
            $scope.networks = networks;
        });
    };

    var viewAutoDisableWifi = function (name, value) {

        this.name = name;
        this.value = value;
    };
    var viewNetwork = function (json) {

        this.ssid = json.ssid;
        this.bssid = json.bssid;
        this.rssi = json.rssi;

        this.name = `BSSID: ${this.bssid}, RSSI: ${this.rssi}, Network: ${this.ssid}`;
    };


})();