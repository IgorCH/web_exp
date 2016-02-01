app.directive('keyPress', function () {
    return function (scope, element, attrs) {
        var options = (new Function('return ' + attrs.keyPress))();

        element.bind("keydown keypress", function (event) {
            if (event.which === options.keyCode) {
                scope.$apply(function () {
                    scope.$eval(options.fn, {'event': event});
                });

                event.preventDefault();
            }
        });
    };
});