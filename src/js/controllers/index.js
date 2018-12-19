angular.module('app.controllers')
    .controller('indexController', ['$scope', '$config', ($scope, $config) => {

        $scope.getName = () => {

            return 'Alex';
        };
        $scope.getNameConfig = () => {

            return $config.getRemoteHost();
        };
    }]);