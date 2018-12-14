angular.module('app.controllers')
    .controller('appController', ['$rootScope', '$scope', '$state', '$ws', ($rootScope, $scope, $state, $ws) => {

        $scope.$ws = $ws;

        $ws.config.get();
        $rootScope.$on('ws:event:cfg', (event, json) => {

            if ($state.$current.name === 'index')
                $state.go('control');
        });
    }]);