(function(app){

    app.controller('ServiceViewController', ServiceViewController);

    ServiceViewController.$inject = ['$scope', '$rootScope', '$state'];

    function ServiceViewController($scope, $rootScope, $state) {

        var vm = this;
        vm.scope = $scope;
        $rootScope.rootCtrl = vm;

        vm.init = function () {

        };

        vm.init();
    }

})(app);
