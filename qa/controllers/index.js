describe(`indexController`, function () {

    var $scope;

    beforeEach(module('app'));
    beforeEach(inject(function ($rootScope, $controller) {

        $scope = $rootScope.$new();
        $controller('indexController', {
            $scope: $scope
        });
    }));

    it('getName', function () {
        expect('Alex').toEqual($scope.getName());
    });
    it('getName 2', function () {
        expect('Alex').toEqual($scope.getName());
    });
});