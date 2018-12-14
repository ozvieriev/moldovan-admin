angular.module('app.controllers')
    .controller('controlController', ['$rootScope', '$scope', '$ws', function controller($rootScope, $scope, $ws) {

        $scope.$ws = $ws;

        $scope.uiRange = 0;
        $scope.serverRange = 0;

        $rootScope.$on('ws:event:state', function (event, json) {

            if (typeof json.g1 === 'undefined')
                return;

            $scope.serverRange = json.g1;
        });
    }]);