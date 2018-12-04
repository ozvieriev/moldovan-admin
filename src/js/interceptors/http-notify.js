(function () {

    angular.module('http-notify-interceptor', [])
        .config(['$httpProvider', function ($httpProvider) {

            $httpProvider.interceptors.push(['$q', '$notify', function ($q, $notify) {

                var interceptor = {};

                interceptor.request = function (config) {

                    config.headers = config.headers || {};

                    return config;
                };
                interceptor.response = function (response) {

                    var config = response.config || {};

                    if (config.notify) {

                        if (config.notify.success)
                            $notify.success(config.notify.success);
                    }

                    return response;
                };
                interceptor.responseError = function (rejection) {

                    var config = rejection.config || {};

                    if (config.notify) {

                        if (config.notify.error === true)
                            $notify.serverError();
                        else
                            $notify.error(config.notify.error);
                    }
                    return $q.reject(rejection);
                };

                return interceptor;
            }]);
        }]);
})();
