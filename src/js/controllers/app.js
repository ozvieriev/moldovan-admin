(function () {

    'use strict';

    angular.module('app.controllers')
        .controller('appController', controller);

    controller.$inject = ['$rootScope', '$scope', '$state', '$ws'];

    function controller($rootScope, $scope, $state, $ws) {

        $ws.config.get();
        $rootScope.$on('ws:event:cfg', function (event, json) {

            if ($state.$current.name === 'index')
                $state.go('control');
        });
    };

})();