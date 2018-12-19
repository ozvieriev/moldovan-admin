(() => {

    angular.module('app.controllers')
        .controller('settingsWirelessNetworkController', ['$rootScope', '$scope', '$ws', ($rootScope, $scope, $ws) => {

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
                    //bssid: null,
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
            $scope.$watch('model.wifiMode', (value) => {

                $scope.template = 'pages/settings/wireless-network/' + value + '.html';
            });
            $scope.$watch('model.client.network', (value) => {

                $scope.model.client.bssid = (value || {}).bssid || null;
            });

            $rootScope.$on('ws:event:cfg', (event, json) => {

                var network = $ws.config.network();
                if (!network) return;
            });
            $rootScope.$on('ws:event:wifiscan', (event, json) => {

                if (json['wifilist'])
                    json.networks = json['wifilist'];

                /*************************************/

                if (typeof json.networks === 'undefined')
                    return;

                var networks = [];
                angular.forEach(json.networks, (item) => {
                    networks.push(new viewNetwork(item));
                });
                $scope.networks = networks;

                if ($scope.model.wifiMode === 'client')
                    $scope.model.client.network = networks.length ? networks[0] : null;
            });
        }]);

    var viewAutoDisableWifi = function (name, value) {

        this.name = name;
        this.value = value;
    };
    var viewNetwork = function (json) {

        this.ssid = json.ssid;
        // this.bssid = json.bssid || null;
        // this.rssi = json.rssi || null;

        this.name = this.ssid;
        //this.name = 'BSSID: ' + this.bssid + ', RSSI: ' + this.rssi + ', Network: ' + this.ssid;
    };

})();