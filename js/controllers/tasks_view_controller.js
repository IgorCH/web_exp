(function(app){

    app.controller('TasksViewController', TasksViewController);

    TasksViewController.$inject = ['$scope', '$rootScope', '$state', 'Session', 'DB'];

    function TasksViewController($scope, $rootScope, $state, Session, DB) {

        var vm = this;
        vm.scope = $scope;
        vm.state = Session.state['TasksViewController'] = Session.state['TasksViewController'] || {isInited: false};
        vm.state.taskData = {
            title: "Task Title",
            models: [],
            scenes: []
        };

        vm.init = function () {
            DB.getTasks({}, function(res) {
                if(res) {
                    vm.state.tasks = res.data;
                } else {

                }
            });
        };

        if (!vm.state.isInited) {
            vm.init();
            vm.state.isInited = true;
        }
    }

})(app);
