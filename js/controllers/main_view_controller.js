(function(app){

    app.controller('MainViewController', MainViewController);

    MainViewController.$inject = ['$scope', '$rootScope', '$state', 'Session'];

    function MainViewController($scope, $rootScope, $state, Session) {

        var vm = this;
        vm.scope = $scope;
        vm.state = Session.state['MainViewController'] = Session.state['MainViewController'] || {isInited: false};
        vm.translations = Session.state['Translations'];

        vm.init = function () {

        };

        if(!vm.state.isInited) {
            vm.init();
            vm.state.isInited = true;
        }
    }

})(app);
