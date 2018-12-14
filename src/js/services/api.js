angular
    .module('app.services')
    .factory('$api', ['$http', '$config', function factory($http, $config) {

        var service = {};

        service.update = function (files) {

            var formData = new FormData();
            angular.forEach(files, function (file) {
                formData.append('file', file);
            });

            return $http.post('http://' + $config.getRemoteHost() + '/update/', formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            });
        };

        return service;
    }]);