(function () {

    'use strict';

    angular.module('app.controllers')
        .controller('settingsUpdateController', controller);

    controller.$inject = ['$scope', '$api'];

    function controller($scope, $api) {

        $scope.model = {};
        $scope.update = function () {

            $api.update($scope.files);
        };
    };

})();