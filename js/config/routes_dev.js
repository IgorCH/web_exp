app.config(['$routeProvider', function ($routeProvider) {

    var otherwiseUrl = '/';

    $routeProvider

        .otherwise(otherwiseUrl);
}]);