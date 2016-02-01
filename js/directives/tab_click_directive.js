app.directive('tabClick', ["$rootScope", function ($rootScope) {
    return{
        link: function link(scope, element, attrs, ctrl) {
            var parent = element.parent();
            if (parent == null || parent.length == 0 || parent[0].nodeName != "MD-TAB-ITEM" || !attrs.tabClick) {
                return;
            }

            $rootScope.appCtrl && $rootScope.appCtrl.clickTabAdd({
                el: parent[0],
                id: attrs.tabClick
            });

            if (!$rootScope.appCtrl) {
                console.error('Could not add tab. $rootScope.appCtrl is ', $rootScope.appCtrl);
            }
        }
    }
}]);