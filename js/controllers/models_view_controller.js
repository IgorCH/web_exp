(function(app){

    app.controller('ModelsViewController', ModelsViewController);

    ModelsViewController.$inject = ['$scope', '$rootScope', '$state', 'Session', 'DB'];

    function ModelsViewController($scope, $rootScope, $state, Session, DB) {

        var vm = this;
        vm.scope = $scope;
        vm.state = Session.state['ModelsViewController'] = Session.state['ModelsViewController'] || {isInited: false};
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
            DB.getModels(vm.state.filter, function(res) {
                if(res) {
                    vm.state.models = res.data;
                } else {

                }
            });
        };

        if (!vm.state.isInited) {
            vm.init();
            vm.state.isInited = true;
        }

        vm.getImgPath = function (url) {
            var result = window.location.origin + '/project_data/models/' + url + '.jpg';
            return result;
        };
    }

})(app);
