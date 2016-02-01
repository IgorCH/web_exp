app.factory('Spinner', ["$window", "$document", "$timeout", "$compile", "$rootScope", function ($window, $document, $timeout, $compile, $rootScope) {

    var template =
        '<div class="vs_spinner_container" ng-show="visible">\
            <div style="background-color: #ffffff;width: 125px;height: 100px;position: relative;top: 50%;left: 50%;border-radius: 10px;margin: -50px 0 0 -63px;padding: 20px 5px;">\
                <div class="vs_showMore">\
                    <div class="vs_spinner"></div>\
                    <div class="vs_spinnerLegend ng-binding">{{msg}}</div>\
                </div>\
            </div>\
        </div>';

    var openedSpinner = null;
    var tasksCount = 0;

    function hide() {
        openedSpinner.scope.safeApply(function () {
            openedSpinner.scope.visible = false;
        });
    }

    function show(spinnerText) {
        tasksCount++;

//        console.log(['spinner show', tasksCount, 'caller', arguments.callee.caller.toString()]);

        if (openedSpinner && openedSpinner.scope.visible == true) {
            // do nothing
        } else if (openedSpinner && openedSpinner.scope.visible == false) {
            openedSpinner.scope.safeApply(function () {
                openedSpinner.scope.visible = true;
                openedSpinner.scope.msg = spinnerText || 'loading...';
            });
        } else {
            var childScope = $rootScope.$new();
            childScope.visible = true;
            childScope.msg = spinnerText || 'loading...';
            makeSpinner(childScope);
        }

//        openedSpinner.scope.msg = spinnerText || 'loading...';
    }

    function done() {
        --tasksCount == 0 && hide()
        //console.log(['spinner done', tasksCount, 'caller', arguments.callee.caller.toString()]);
    }

    function makeSpinner(scope) {
        var element = angular.element($compile(template)(scope));

        openedSpinner = {
            el: element,
            scope: scope
        };

        var body = $document.find('body');
        body.append(element);

        element.on('wheel', function (e) {
            if (openedSpinner.scope.visible == true) {
                e.preventDefault();
            }
        });
    }

    return {
        show: show,
        close: hide,
        done: done
    };
}]);