(function(app){

    app.controller('ProfileViewController', ProfileViewController);

    ProfileViewController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'Session', 'DB'];

    function ProfileViewController($scope, $rootScope, $state, $stateParams, Session, DB) {

        var vm = this;
        vm.scope = $scope;
        vm.state = Session.state['ProfileViewController'] = Session.state['ProfileViewController'] || {isInited: false};

        vm.init = function () {

            var urlParams = JSON.parse(JSON.stringify($stateParams)) || {};
            DB.getProfileDetails(urlParams.id, function (res) {
                console.log(res);
                if(res) {
                    if(res.data.success) {
                        vm.state.profile = res.data.profile;
                    } else {

                    }
                }
            });
        };

        if (!vm.state.isInited) {
            vm.init();
            vm.state.isInited = true;
        }

        vm.saveProfile = function () {

            DB.saveProfileDetails(vm.state.profile, function(res){
                if(res){

                } else {

                }
            })
        };

        vm.getProjectUpdates = function () {
            //TODO DB.getProjectUpdates
        };

    }

})(app);
