(function(app){

    app.controller('TaskViewController', TaskViewController);

    TaskViewController.$inject = ['$scope', '$rootScope', '$state', 'Session', 'DB', '$stateParams', 'Upload'];

    function TaskViewController($scope, $rootScope, $state, Session, DB, $stateParams, Upload) {

        var vm = this;
        vm.scope = $scope;
        vm.state = Session.state['TaskViewController'] = Session.state['TaskViewController'] || {isInited: false};
        vm.state.newMessageData = {
            text: ''
        };

        vm.state.showNewTaskForm = false;

        vm.onCreateNewTask = createNewTask;
        vm.onCancelNewTask = cancelNewTask;
        vm.onShowNewTaskForm = showNewTaskForm;
        vm.onAddMessageToChat = addMessageToChat;
        vm.onShowModelView = showModelView;
        vm.onUploadFiles = uploadFiles;

        vm.init = function () {

            var params = JSON.parse(JSON.stringify($stateParams)) || {};
            DB.getTask(params.id, function(res) {
                if(res) {
                    console.log(['getTask', res]);
                    vm.state.data = res.data;
                } else {

                }
            });
        };

        if (!vm.state.isInited) {
            vm.init();
            vm.state.isInited = true;
        }

        function createNewTask() {
            DB.createTask({}, function(res) {
                console.log(['new task res', res]);
            });
            vm.state.showNewTaskForm = false;
        }

        function cancelNewTask() {
            vm.state.showNewTaskForm = false;
        }

        function showNewTaskForm() {
            vm.state.showNewTaskForm = true;
        }

        function addMessageToChat() {
            console.log(['onAddMessageToChat']);
        }

        function showModelView() {
            console.log(['showModelView']);
        }

        function uploadFiles () {
            console.log(['upload files', files]);
            if (files.file.$valid && $scope.file) {
                Upload.upload({
                    url: 'api/files',
                    data: {
                        projectId: vm.state.data.project._id,
                        file: $scope.file,
                        username: $scope.username
                    }
                }).then(function (resp) {
                    console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            }
        };

    }

})(app);
