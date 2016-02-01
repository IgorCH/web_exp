(function(app){

    app.controller('RootController', RootController);

    RootController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$mdSidenav', '$mdDialog', 'Session', 'DB'];

    function RootController($scope, $rootScope, $state, $stateParams, $mdSidenav, $mdDialog, Session, DB) {

        var guestProfile = {
            id: '0',
            name: 'Guest',
            email: 'Guest@mail.com',
            img: '',
            lng: 'EN',
            is_logged: false
        };

        var vm = this;
        vm.scope = $scope;
        vm.state = Session.state['RootController'] = Session.state['RootController'] || { isInited: false, profile: guestProfile };

        vm.init = function () {

            /*$mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .clickOutsideToClose(true)
                    .title('This is an alert title')
                    .content('You can specify some description text in here.')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Got it!')
            );*/

            /*var confirm = $mdDialog.confirm()
                .title('Would you like to delete your debt?')
                .content('All of the banks have agreed to forgive you your debts.')
                .ariaLabel('Lucky day')
                .ok('Please do it!')
                .cancel('Sounds like a scam');

            $mdDialog.show(confirm).then(function() {
                $scope.status = 'You decided to get rid of your debt.';
            }, function() {
                $scope.status = 'You decided to keep your debt.';
            });*/

            DB.getProfile({}, function(res) {
                if(res) {
                    vm.translations = res.data.translations;
                    Session.state['Translations'] = vm.translations;

                    if (res.data.success) {
                        vm.state.profile = res.data.profile;
                    } else {

                    }
                } else {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .clickOutsideToClose(true)
                            .title('Error')
                            .content('Fatal Error')
                            .ariaLabel('Error Dialog')
                            .ok('OK')
                    );
                }
            });

            if(!$state.current.name) {
                $state.go('main');
            }

        };

        if (!vm.state.isInited) {
            vm.init();
            vm.state.isInited = true;
        }

        vm.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
        };

        vm.onSignInBtn = function () {
            $mdDialog.show({
                controller: 'PopupSignInController',
                templateUrl: 'html/popups/sign_in.html'
            });
        };

        vm.onSignUpBtn = function () {
            $mdDialog.show({
                controller: 'PopupSignUpController',
                templateUrl: 'html/popups/sign_up.html'
            });
        };

        vm.onExitBtn = function () {
            DB.logout({}, function(res) {
                console.log(res);
                if(res.data.success) {
                    window.location.reload();
                } else {

                }
            });
        };
    }
})(app);