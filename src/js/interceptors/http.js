(function () {

    angular.module('http-interceptor', [])
        .config(['$httpProvider', function ($httpProvider) {

            $httpProvider.interceptors.push(['$q', function ($q) {

                var interceptor = {};

                interceptor.request = function (config) {

                    config.headers = config.headers || {};

                    return config;
                };
                interceptor.response = function (response) {
                    
                    var config = response.config || {};

                    if (config.asJson === true)
                        return response.data;

                    return response;
                };

                return interceptor;
            }]);
        }]);
})();
