var app = angular.module('ArchiviserApplication', ['ngMaterial', 'ngMdIcons', 'ngResource', 'ngRoute', 'ui.router', 'vAccordion', 'ngFileUpload']);

app.config(function ($mdThemingProvider) {
    var customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50'],
        '50': 'ffffff'
    });
    $mdThemingProvider.definePalette('customBlue', customBlueMap);
    $mdThemingProvider.theme('default')
        .primaryPalette('customBlue', {
            'default': '500',
            'hue-1': '50'
        })
        .accentPalette('pink');
    $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey')
});

app.config(['$httpProvider', '$provide', function ($httpProvider, $provide) {

    $httpProvider.defaults.transformRequest.push(function (data, headersGetter) {
        var d, utf8_data;
        utf8_data = data;
        if (!angular.isUndefined(data)) {
            d = angular.fromJson(data);
            d["_utf8"] = "✓";
            utf8_data = angular.toJson(d);
        }
        return utf8_data;
    });

    $provide.factory('httpInterceptor', ['$q', '$rootScope', function ($q, $rootScope) {
        return {
            'request': function (config) {
                // intercept and change config: e.g. change the URL
                // config.url += '?nocache=' + (new Date()).getTime();
                // broadcasting 'httpRequest' event
                $rootScope.$broadcast('httpRequest', config);
                return config || $q.when(config);
            },
            'response': function (response) {
                // we can intercept and change response here...
                // broadcasting 'httpResponse' event
                $rootScope.$broadcast('httpResponse', response);
                return response || $q.when(response);
            },
            'requestError': function (rejection) {
                // broadcasting 'httpRequestError' event
                $rootScope.$broadcast('httpRequestError', rejection);
                return $q.reject(rejection);
            },
            'responseError': function (rejection) {
                // broadcasting 'httpResponseError' event
                $rootScope.$broadcast('httpResponseError', rejection);
                return $q.reject(rejection);
            }
        };
    }]);

    $httpProvider.interceptors.push('httpInterceptor');

    $provide.decorator('$q', function ($delegate) {
        var defer = $delegate.defer;
        $delegate.defer = function () {
            var deferred = defer();
            deferred.promise.success = function (fn) {
                deferred.promise.then(function() {
                    fn.apply(this, arguments);
                });
                return deferred.promise;
            };
            deferred.promise.error = function (fn) {
                deferred.promise.then(null, function() {
                    fn.apply(this, arguments);
                });
                return deferred.promise;
            };
            return deferred;
        };
        return $delegate;
    });

}]);

app.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.stateCountInProgress = 0;

    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
            $rootScope.stateCountInProgress++;
        }
    );

    $rootScope.$on('$viewContentLoaded',
        function (event, toState, toParams, fromState, fromParams) {
            setTimeout(function () {
                if ($rootScope.stateCountInProgress > 0) {
                    $rootScope.stateCountInProgress--;
                }
            }, 500)
        }
    );

    $rootScope.$on('httpRequest', function () {

    });

    $rootScope.$on('httpResponse', function () {

    });

    $rootScope.$on('$stateChangeSuccess', function (event, to, toParams, from, fromParams) {
        $rootScope.currentState = to;
    });

    $rootScope.safeApply = function(fn) {
        var phase = this.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') {
            if(fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    $rootScope.ENV = {
        isIndex : /.+index(\.html)?$/.test(window.location.pathname.toLowerCase())
    };
}]);