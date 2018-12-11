(function () {

    'use strict';

    angular.module('app.controllers')
        .controller('settingsWirelessNetworkController', controller);

    controller.$inject = ['$rootScope', '$scope', '$api', '$dict'];

    function controller($rootScope, $scope, $api, $dict) {

        $scope.$api = $api;

        $scope.autoDisableWifis = [
            new viewAutoDisableWifi('Always on', null),
            new viewAutoDisableWifi('3 min', 3),
            new viewAutoDisableWifi('4 min', 4),
            new viewAutoDisableWifi('5 min', 5),
            new viewAutoDisableWifi('10 min', 10),
            new viewAutoDisableWifi('15 min', 15),
            new viewAutoDisableWifi('30 min', 30),
        ];
        $scope.model = {
            wifiMode: 'access-point',
            ssid: 'SMC',
            bssid: 'aa:bb:Cc:dd:ee',
            isHideNetworkName: false,
            isUseDHCP: true,
            autoDisableWifi: $scope.autoDisableWifis[0]
        };
    };

    var viewAutoDisableWifi = function (name, value) {

        this.name = name;
        this.value = value;
    };


})();