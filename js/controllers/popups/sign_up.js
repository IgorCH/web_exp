(function(app){

    app.controller('PopupSignUpController', PopupSignUpController);

    PopupSignUpController.$inject = ['$scope', '$rootScope', '$state', '$mdDialog'];

    function PopupSignUpController($scope, $rootScope, $state, $mdDialog) {

        var vm = this;
        vm.scope = $scope;
        vm.scope.projectTitle = "";

        vm.init = function () {
            console.log(["init", vm.scope]);
        };

        vm.init();

        vm.scope.cancel = function() {
            $mdDialog.cancel();
        };

        vm.scope.create = function() {
            $mdDialog.hide(vm.scope.projectTitle);
        };

    }

})(app);