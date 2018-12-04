(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('$api', factory);

    factory.$inject = ['$q', '$http'];

    function factory($q, $http) {

        var service = {};
        

        return service;
    };
})();