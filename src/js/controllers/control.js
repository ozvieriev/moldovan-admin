(function () {

    'use strict';

    angular.module('app.controllers')
        .controller('controlController', controller);

    controller.$inject = ['$scope', '$dict', '$api'];

    function controller($scope, $dict, $api) {

        $scope.range = 0;
    };

})();