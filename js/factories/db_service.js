(function (app) {

    app.service('DB', DB);

    DB.$inject = ["$http"];

    function DB($http) {
        var self = this;
        self.state = {};

        self.url = '/api/';

        self.query = function (ctrl, method, params, callback) {

            var request = $http({
                method: method,
                url: self.url + ctrl,
                params: params
            });

            var successCallback = function (successRes) {
                console.log([ctrl + ' , ' + method + ' success res', params, successRes]);
                callback(successRes);
            };

            var failedCallback = function (failedRes) {
                console.log([ctrl + ' , ' + method + ' failed res', params, failedRes]);
                callback(failedRes);
            };

            return (request.then(successCallback, failedCallback));
        };
        //-----------------------------------------------------
        //-----------------------------------------------------

        //-----------------------------------------------------
        //Profile functions
        //-----------------------------------------------------
        self.login = function (params, callback) {
            self.query('login', 'POST', params, callback);
        };

        self.logout = function (params, callback) {
            self.query('logout', 'POST', params, callback);
        };

        self.register = function (params, callback) {
            self.query('register', 'POST', params, callback);
        };

        self.getProfile = function (params, callback) {
            self.query('profile', 'GET', params, callback);
        };

        self.getProfileDetails = function (id, callback) {
            self.query('profile_details/' + id, 'GET', {}, callback);
        };

        self.saveProfileDetails = function (params, callback) {
            self.query('profile_details/' + params._id, 'PUT', params, callback);
        };
        //-----------------------------------------------------
        //-----------------------------------------------------

        //-----------------------------------------------------
        //Projects functions
        //-----------------------------------------------------
        self.getProjects = function (callback) {
            var params = {};
            self.query('projects', 'GET', params, callback);
        };

        self.getProject = function (projectId, callback) {
            var params = {};
            self.query('projects/' + projectId, 'GET', params, callback);
        };

        self.addProject = function (params, callback) {
            self.query('projects', 'POST', params, callback);
        };

        self.deleteProject = function (callback) {
            var params = { projectId : 1 };
            self.query('projects', 'DELETE', params, callback);
        };

        self.addMessageToProjectChat = function (params, callback) {
            console.log('add message to project chat not implemented');
            //self.query('project', 'POST', params, callback);
        };
        //-----------------------------------------------------
        //-----------------------------------------------------

        //-----------------------------------------------------
        //Tasks functions
        //-----------------------------------------------------
        self.getTasks = function (params, callback) {
            self.query('tasks', 'GET', params, callback);
        };

        self.getTask = function (taskId, callback) {
            self.query('tasks/' + taskId, 'GET', {}, callback);
        };

        self.createTask = function (params, callback) {
            self.query('tasks', 'POST', params, callback);
        };

        self.deleteTask = function (params, callback) {
            var params = { taskId : 1 };
            self.query('tasks', 'DELETE', params, callback);
        };

        self.addMessageToTaskChat = function (params, callback) {
            console.log('add message to project chat not implemented');
            //self.query('task', 'POST', params, callback);
        };
        //-----------------------------------------------------
        //-----------------------------------------------------

        //-----------------------------------------------------
        //Scenes functions
        //-----------------------------------------------------
        self.getScenes = function (params, callback) {
            self.query('scenes', 'GET', params, callback);
        };

        self.deleteScene = function (callback) {
            //var params = {};
            //self.query('scenes', 'POST', params, callback);
        };

        self.changeScene = function (params, callback) {
            //self.query('scenes', 'POST', params, callback);
        };
        //-----------------------------------------------------
        //-----------------------------------------------------

        //-----------------------------------------------------
        //Models functions
        //-----------------------------------------------------
        self.getModels = function (params, callback) {
            self.query('models', 'GET', params, callback);
        };

        self.deleteModel = function (callback) {
            //var params = {};
            //self.query('models', 'POST', params, callback);
        };

        self.changeModel = function (params, callback) {
            //self.query('models', 'POST', params, callback);
        };
        //-----------------------------------------------------
        //-----------------------------------------------------

        //-----------------------------------------------------
        //Portfolio functions
        //-----------------------------------------------------
        self.getPortfolio = function (params, callback) {
            self.query('portfolio', 'GET', params, callback);
        };
        //-----------------------------------------------------
        //-----------------------------------------------------
    }
})(app);