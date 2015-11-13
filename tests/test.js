describe("Controllers", function(){
    beforeEach(module('WhereItsApp'));

    describe('NavigationBarController', function(){
        var controller;
        var scope;
        beforeEach(inject(function($controller){
            scope = {};
            controller =$controller('NavigationBarController', {$scope: scope});
        }))

        it('exists', function(){
            expect(controller).toBeTruthy();

            expect(scope.goBack).toBeTruthy();
        });
    });
});
