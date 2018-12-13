(function () {

    'use strict';

    angular.module('app.controllers')
        .controller('settingsWirelessNetworkController', controller);

    controller.$inject = ['$rootScope', '$scope', '$ws'];

    function controller($rootScope, $scope, $ws) {

        $scope.$ws = $ws;
        $scope.template = null;

        $scope.autoDisableWifis = [
            new viewAutoDisableWifi('Always on', null),
            new viewAutoDisableWifi('3 min', 3),
            new viewAutoDisableWifi('4 min', 4),
            new viewAutoDisableWifi('5 min', 5),
            new viewAutoDisableWifi('10 min', 10),
            new viewAutoDisableWifi('15 min', 15),
            new viewAutoDisableWifi('30 min', 30),
        ];
        $scope.networks = null;

        $scope.model = {
            wifiMode: 'client',
            accessPoint: {
                ssid: null,
                password: null,
                isHideNetworkName: false,
                ipAddress: null,
                subnetMask: null,
                autoDisableWifi: $scope.autoDisableWifis[0]
            },
            client: {
                network: null,
                ssid: null,
                bssid: null,
                password: null,
                isUseDHCP: true,
                ipAddress: null,
                subnetMask: null,
                dnsServer: null,
                gateway: null,
                autoDisableWifi: $scope.autoDisableWifis[0]
            }
        };

        //
        $scope.$watch('model.wifiMode', function (value) {

            $scope.template = 'pages/settings/wireless-network/' + value + '.html';
        });
        $scope.$watch('model.client.network', function (value) {

            $scope.model.client.bssid = (value || {}).bssid || null;
        });

        $rootScope.$on('ws:event:cfg', function (event, json) {

            var network = $ws.config.network();
            if(!network) return;

            
        });
        $rootScope.$on('ws:event:wifi-list', function (event, json) {

            if (json['list'])
                json.networks = json['list'];

            /*************************************/

            if (typeof json.networks === 'undefined')
                return;

            var networks = [];
            angular.forEach(json.networks, function (item) {
                this.push(new viewNetwork(item));
            }, networks);
            $scope.networks = networks;

            if ($scope.model.wifiMode === 'client')
                $scope.model.client.network = networks.length ? networks[0] : null;
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

        this.name = 'BSSID: ' + this.bssid + ', RSSI: ' + this.rssi + ', Network: ' + this.ssid;
    };


})();