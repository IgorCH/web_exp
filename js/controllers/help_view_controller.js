(function(app){

    app.controller('HelpViewController', HelpViewController);

    HelpViewController.$inject = ['$scope', '$rootScope', '$state'];

    function HelpViewController($scope, $rootScope, $state) {

        var vm = this;
        vm.scope = $scope;
        $rootScope.rootCtrl = vm;

        vm.init = function () {

        };

        vm.init();
    }

})(app);
