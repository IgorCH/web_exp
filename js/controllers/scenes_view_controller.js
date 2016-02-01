(function(app){

    app.controller('ScenesViewController', ScenesViewController);

    ScenesViewController.$inject = ['$scope', '$rootScope', '$state', 'Session', 'DB'];

    function ScenesViewController($scope, $rootScope, $state, Session, DB) {

        var vm = this;
        vm.scope = $scope;
        vm.state = Session.state['ScenesViewController'] = Session.state['ScenesViewController'] || {isInited: false};
        vm.state.filter = {
            executioner: '',
            room: '',
            style:'',
            gamma:'',
            tone: '',
            main_color:'',
            accent_color: '',
            material: ''
        };

        vm.init = function () {
            DB.getScenes(vm.state.filter, function(res) {
                if(res) {
                    vm.state.scenes = res.data;
                } else {

                }
            });
        };

        if (!vm.state.isInited) {
            vm.init();
            vm.state.isInited = true;
        }

        vm.getImgPath = function (url) {
            var result = window.location.origin + '/project_data/scenes/' + url + '.jpg';
            return result;
        };
    }

})(app);
