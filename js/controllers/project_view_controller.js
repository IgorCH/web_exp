(function (app) {

    app.controller('ProjectViewController', ProjectViewController);

    ProjectViewController.$inject = ['$scope', '$rootScope', '$state', 'Session', 'DB', '$stateParams', 'Upload', '$mdDialog'];

    function ProjectViewController($scope, $rootScope, $state, Session, DB, $stateParams, Upload, $mdDialog) {

        var vm = this;
        vm.scope = $scope;
        vm.state = Session.state['ProjectViewController'] = Session.state['ProjectViewController'] || {isInited: false};
        //vm.state.files;

        vm.state.newMessageData = {
            message: "",
            clientRights: true
        };

        vm.init = function () {
            var params = JSON.parse(JSON.stringify($stateParams)) || {};
            DB.getProject(params.id, function (res) {
                if (res) {
                    vm.state.data = res.data;

                } else {

                }
            });
        };

        if (!vm.state.isInited) {
            vm.init();
            vm.state.isInited = true;
        }

        vm.createNewTask = function (task) {
            var params = {
                title: task.title,
                projectId: vm.state.data.project._id
            };
            DB.createTask(params, function (res) {
                console.log(['createTask', res]);
                if (res) {
                    if(task.redirect) {
                        $state.go('task', {id: res.data.task._id});
                    }
                } else {

                }
            });
        };

        vm.openTask = function (taskId) {
            $state.go('task', {id: taskId});
        };

        vm.deleteTask = function (taskId) {
            var params = {
                title: vm.state.newTaskData.title,
                projectId: vm.state.data.project._id
            };
            DB.deleteTask(params, function (res) {
                console.log(['deleteTask', res]);
                /*if (res) {
                    if(vm.state.newTaskData.redirect) {
                        $state.go('task', {id: res.data.task._id});
                    }
                } else {

                }*/
            });
        };

        vm.showNewTaskForm = function () {

            $mdDialog.show({
                controller: 'PopupNewTaskController',
                templateUrl: 'html/popups/new_task.html'
            })
            .then(function(task) {
                if(!task) {
                    /*$mdDialog.show({
                     controller: 'PopupErrorController',
                     templateUrl: 'html/popups/error.html'
                     });*/
                } else {
                    vm.createNewTask(task);
                }
            });
        };

        vm.onCreateNewTask = function () {
            console.log(['onCreateNewTask']);
            vm.createTask();
        };

        vm.addMessage = function() {
            console.log(['add message']);
        };

        vm.uploadFiles = function() {
            Upload.upload({
                url: 'api/files',
                data: {
                    projectId: vm.state.data.project._id,
                    files: vm.files
                }
            }).then(function (res) {
                console.log(['Success uploaded. Response: ', res]);
                vm.state.data.project.files = res.data.project.files;
            }, function (res) {
                console.log(['Error status: ', res]);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log(['progress: ' + progressPercentage + '% ' + evt]);
            });
        };

        $scope.submit = function () {
            if (form.file.$valid && $scope.file) {
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