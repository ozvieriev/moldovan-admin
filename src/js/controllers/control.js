(function () {

    'use strict';

    angular.module('app.controllers')
        .controller('controlController', controller);

    controller.$inject = ['$rootScope', '$scope', '$api'];

    function controller($rootScope, $scope, $api) {

        $scope.$api = $api;

        $scope.uiRange = 0;
        $scope.serverRange = 0;

        $scope.uiChange = function(){

            $api.ctrl.change({g1: $scope.uiRange})
        };
        $rootScope.$on('ws:event:state', function (event, json) {

            if (typeof json.g1 === 'undefined')
                return;

            $scope.serverRange = json.g1;
        });
    };

})();