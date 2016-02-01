(function(app){

    app.controller('PopupSignInController', PopupSignInController);

    PopupSignInController.$inject = ['$scope', '$rootScope', '$state', '$mdDialog', 'DB'];

    function PopupSignInController($scope, $rootScope, $state, $mdDialog, DB) {

        var vm = this;
        vm.scope = $scope;

        vm.scope.userEmail = "";
        vm.scope.userPass = "";
        vm.scope.loginError = "";

        vm.init = function () {
            console.log(["init", vm.scope]);
        };

        vm.init();

        vm.scope.cancel = function() {
            $mdDialog.cancel();
        };

        vm.scope.signin = function() {
            var params = {
                email: vm.scope.userEmail,
                pass: vm.scope.userPass
            };

            DB.login(params, function(res) {
                if(res && res.data.success) {
                    window.location.reload();
                } else {
                    vm.scope.loginError = "Error";
                }
            });

        };
    }

})(app);