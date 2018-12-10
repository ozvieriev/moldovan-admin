(function () {

    'use strict';

    angular.module('app.controllers')
        .controller('settingsNtpTimeSettingsController', controller);

    controller.$inject = ['$rootScope', '$scope', '$api'];

    function controller($rootScope, $scope, $api) {

        $scope.$api = $api;
    };

})();