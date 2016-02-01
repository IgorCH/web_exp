app.directive('tabButton', TabButton);

function TabButton($compile, $controller) {
    var mdTabItem;
    return {
        require: '^?mdTabs',
        terminal: true,
        compile: function (element, attr) {

            var wrapper = element.parent().parent()[0],
                canvas = wrapper.getElementsByTagName('md-tabs-canvas')[0];

            mdTabItem = angular.element('<div class="vs_tabButton vs_cursor_pointer"></div>');
            if (attr['onClick']) mdTabItem = angular.element('<div class="vs_tabButton vs_cursor_pointer" on-click="'+ attr['onClick'] +'"></div>')
            mdTabItem.append(element.html());
            angular.element(canvas).append(mdTabItem);

            return postLink;
        },
        scope: {
            active: '=?mdActive',
            disabled: '=?ngDisabled',
            select: '&?mdOnSelect',
            deselect: '&?mdOnDeselect',
            onClick: '&'
        }
    };

    function postLink(scope, element, attr, ctrl) {
        ctrl.scope.$watch('selectedIndex', function () {
            // do nothing
        });
        mdTabItem.on('click', scope.onClick);
    }
}

TabButton.$inject = ["$compile", "$controller"];