(function () {
    'use strict';

    angular
        .module('app.services')
        .factory('$dict', factory);

    factory.$inject = ['$http'];

    function factory($http) {

        var service = {};

        return service;
    };
})();