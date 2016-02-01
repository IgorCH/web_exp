(function (app) {

    app.factory('Session', Session);

    Session.$inject = ["$routeParams"];

    function Session($routeParams) {
        var self = this;

        self.rootUrl = function () {
            return window.rootUrl;
        };

        self.state = {};

        self.paramsFor = {};

        self.isDebug = !!_app.getQueryParams().debug;

        return self;
    }

})(app);