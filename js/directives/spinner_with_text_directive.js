app.directive("textSpinner", [function () {
    var tpl = '<div class="vs_showMore" ng-show="visible"><div class="vs_spinner"></div><div class="vs_spinnerLegend">{{text}}</div></div>';

    return {
        restrict: "E",
        template: tpl,
        scope: {
            text: "=text",
            visible: "=visible"
        }
    }
}]);