angular.module('app.controllers')
    .controller('settingsUpdateController', ['$scope', '$api', function ($scope, $api) {

        $scope.model = {};
        $scope.update = function () {

            $api.update($scope.files);
        };
    }]);