app.factory('Data', ['$resource', '$rootScope', function ($resource, $rootScope) {

    var DataFactory = $resource(window.rootUrl + './js/controllers/_data_portfolio.json', {},
        {
            getPortfolio: {method: 'GET', url: window.rootUrl + './data/sdp_items_detail.json'},
            getContacts: {method: 'POST', url: window.rootUrl + './data/save_note.json'}
        });

    var fakeRequest = function (params, callback) {
        setTimeout(function () {
            $rootScope.$apply(function () {
                callback && callback(true)
            });
        }, 500);
    };

    return DataFactory;

}]);
