(function(app){

    app.controller('ContactUsViewController', ContactUsViewController);

    ContactUsViewController.$inject = ['$scope', '$rootScope', '$state', 'Session'];

    function ContactUsViewController($scope, $rootScope, $state, Session) {

        var vm = this;
        vm.scope = $scope;
        vm.translations = Session.state['Translations'];

        vm.init = function () {

        };

        vm.init();
    }

})(app);
