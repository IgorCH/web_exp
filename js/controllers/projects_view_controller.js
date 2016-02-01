(function(app){

    app.controller('ProjectsViewController', ProjectsViewController);

    ProjectsViewController.$inject = ['$scope', '$rootScope', '$state', 'Session', 'DB', '$mdDialog'];

    function ProjectsViewController($scope, $rootScope, $state, Session, DB, $mdDialog) {

        var vm = this;
        vm.scope = $scope;
        vm.state = Session.state['ProjectsViewController'] = Session.state['ProjectsViewController'] || {isInited: false};
        vm.translations = Session.state['Translations'];

        vm.init = function () {
            DB.getProjects(function(res){
                if(res) {
                    vm.state.data = res.data;
                } else {

                }
            });
        };

        if (!vm.state.isInited) {
            vm.init();
            vm.state.isInited = true;
        }

        function createNewProject(projectTitle) {
            var params = {
                title: projectTitle
            };

            DB.addProject(params, function(res){
                console.log(['addProject res', res]);
                if(res) {
                    $state.go('project', { id: res.data.project._id });
                } else {
                    /*$mdDialog.show({
                        controller: 'PopupErrorController',
                        templateUrl: 'html/popups/error.html'
                    });*/
                }
            });
        }

        vm.showCreateProjectDialog = function() {
            $mdDialog.show({
                controller: 'PopupNewProjectController',
                templateUrl: 'html/popups/new_project.html'
            })
            .then(function(projectTitle) {
                    if(!projectTitle) {
                        /*$mdDialog.show({
                            controller: 'PopupErrorController',
                            templateUrl: 'html/popups/error.html'
                        });*/
                    } else {
                        createNewProject(projectTitle);
                    }
            });
        };

    }

})(app);
