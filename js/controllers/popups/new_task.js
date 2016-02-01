(function(app){

    app.controller('PopupNewTaskController', PopupNewTaskController);

    PopupNewTaskController.$inject = ['$scope', '$rootScope', '$state', '$mdDialog'];

    function PopupNewTaskController($scope, $rootScope, $state, $mdDialog) {

        var vm = this;
        vm.scope = $scope;
        vm.scope.taskTitle = "";
        vm.scope.needRedirect = false;

        vm.init = function () {
            console.log(["init", vm.scope]);
        };

        vm.init();

        vm.scope.cancel = function() {
            $mdDialog.cancel();
        };

        vm.scope.create = function() {
            $mdDialog.hide({
                title: vm.scope.taskTitle,
                redirect: vm.scope.needRedirect
            });
        };

    }

})(app);