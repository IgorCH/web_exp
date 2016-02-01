(function(){

    var customFilters = angular.module('customFilters', []);

    customFilters.filter('usd', ['$filter', function($filter) {
        return function(input) {
            if(input == 0) return '$0.00';
            if(input == '' || input == null || typeof(input) == 'undefined') return '';
            // BUG:
//            console.log($filter('currency')(input, '$', 2));
            var preFormated = $filter('currency')(input, '$', 2);
            if(preFormated && !/^$/.test(preFormated)) {
                preFormated = preFormated.replace(/^./, '');// to replace "В"
            }
            return preFormated;
        };
    }]);

    customFilters.filter('money', ['$filter', function($filter) {
        return function(input, sym) {
            if(input == 0) return (sym ? sym+'0.00' : '0.00');
            if(input == '' || input == null || typeof(input) == 'undefined') return '';
            var preFormated = $filter('currency')(input, '', 2);
            if(preFormated && !/^\d/.test(preFormated)) {
                preFormated = preFormated.replace(/^\D+/, '');// to replace "В"
            }
            return (sym ? sym+preFormated : preFormated);
        };
    }]);

    customFilters.filter('dt', ['$filter', function() {
        return function(input) {
            if(isNaN(input)) return input;
            return new Date(Number(input)).format("mm/dd/yyyy");
        };
    }]);

})();