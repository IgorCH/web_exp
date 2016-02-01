app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('main', {
            url: "/main",
            templateUrl: _app.urlCombine(window.rootUrl, 'html/main_view.html'),
            controller: 'MainViewController as mvc'
        })
        .state('service', {
            url: "/service",
            templateUrl: _app.urlCombine(window.rootUrl, 'html/service_view.html'),
            controller: 'ServiceViewController as svc'
        })
        .state('portfolio', {
            url: "/portfolio",
            templateUrl: _app.urlCombine(window.rootUrl, 'html/portfolio_view.html'),
            controller: 'PortfolioViewController as pvc'
        })
        .state('contact_us', {
            url: "/contact_us",
            templateUrl: _app.urlCombine(window.rootUrl, 'html/contact_us_view.html'),
            controller: 'ContactUsViewController as cuvc'
        })
        .state('projects', {
            url: "/projects",
            templateUrl: _app.urlCombine(window.rootUrl, 'html/projects_view.html'),
            controller: 'ProjectsViewController as pvc'
        })
        .state('project', {
            url: "/project?id",
            templateUrl: _app.urlCombine(window.rootUrl, 'html/project_view.html'),
            controller: 'ProjectViewController as projvc'
        })
        .state('tasks', {
            url: "/tasks",
            templateUrl: _app.urlCombine(window.rootUrl, 'html/tasks_view.html'),
            controller: 'TasksViewController as tvc'
        })
        .state('task', {
            url: "/task?id",
            templateUrl: _app.urlCombine(window.rootUrl, 'html/task_view.html'),
            controller: 'TaskViewController as taskvc'
        })
        .state('models', {
            url: "/models",
            templateUrl: _app.urlCombine(window.rootUrl, 'html/models_view.html'),
            controller: 'ModelsViewController as mvc'
        })
        .state('scenes', {
            url: "/scenes",
            templateUrl: _app.urlCombine(window.rootUrl, 'html/scenes_view.html'),
            controller: 'ScenesViewController as svc'
        })
        .state('help', {
            url: "/help",
            templateUrl: _app.urlCombine(window.rootUrl, 'html/help_view.html'),
            controller: 'HelpViewController as hvc'
        })
        .state('profile', {
            url: "/profile?id",
            templateUrl: _app.urlCombine(window.rootUrl, 'html/profile_view.html'),
            controller: 'ProfileViewController as pvc'
        })
    ;
}]);
