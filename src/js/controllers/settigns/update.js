angular.module('app.controllers')
    .controller('settingsUpdateController', ['$scope', '$api', ($scope, $api) => {

        $scope.model = {};
        $scope.update = () => {

            $api.update($scope.files);
        };
    }]);