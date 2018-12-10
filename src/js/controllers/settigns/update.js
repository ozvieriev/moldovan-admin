(function () {

    'use strict';

    angular.module('app.controllers')
        .controller('settingsUpdateController', controller);

    controller.$inject = ['$rootScope', '$scope', '$api'];

    function controller($rootScope, $scope, $api) {

        $scope.$api = $api;
    };

})();