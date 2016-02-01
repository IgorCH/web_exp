/**
 * @ngdoc module
 * @name tabs
 */

var module = angular.module('tabs', []);

var totalCtrl = 0;
module.controller('ModuleTestController', function ($scope) {
    var vm = this;
    vm.scope = $scope;
    vm.totalCtrl = totalCtrl++;

    vm.someMethod = function (text) {
        console.log('someMethod', text)
    }
})

module
    .controller('TabsetController', ['$scope', function TabsetCtrl($scope) {
        var ctrl = this,
            tabs = ctrl.tabs = $scope.tabs = [];

        ctrl.select = function (selectedTab) {
            angular.forEach(tabs, function (tab) {
                if (tab.active && tab !== selectedTab) {
                    tab.active = false;
                    tab.onDeselect();
                }
            });
            selectedTab.active = true;
            selectedTab.onSelect();
        };

        ctrl.addTab = function addTab(tab) {
            tabs.push(tab);
            // we can't run the select function on the first tab
            // since that would select it twice
            if (tabs.length === 1 && tab.active !== false) {
                tab.active = true;
            } else if (tab.active) {
                ctrl.select(tab);
            }
            else {
                tab.active = false;
            }
        };

        ctrl.removeTab = function removeTab(tab) {
            var index = tabs.indexOf(tab);
            //Select a new tab if the tab to be removed is selected and not destroyed
            if (tab.active && tabs.length > 1 && !destroyed) {
                //If this is the last tab, select the previous tab. else, the next tab.
                var newActiveIndex = index == tabs.length - 1 ? index - 1 : index + 1;
                ctrl.select(tabs[newActiveIndex]);
            }
            tabs.splice(index, 1);
        };

        var destroyed;
        $scope.$on('$destroy', function () {
            destroyed = true;
        });
    }])

    .directive('tabset', function () {
        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            scope: {
                type: '@'
            },
            controller: 'TabsetController',
            template: '<div>\
                            <ul class="nav nav-{{type || \'tabs\'}}" ng-class="{\'nav-stacked\': vertical, \'nav-justified\': justified}" ng-transclude></ul>\
                            <div class="tab-content">\
                                <div class="tab-pane"\
                                ng-repeat="tab in tabs"\
                                ng-class="{active: tab.active}"\
                                tab-content-transclude="tab">\
                                </div>\
                            </div>\
                        </div>',
            link: function (scope, element, attrs) {
                scope.vertical = angular.isDefined(attrs.vertical) ? scope.$parent.$eval(attrs.vertical) : false;
                scope.justified = angular.isDefined(attrs.justified) ? scope.$parent.$eval(attrs.justified) : false;
            }
        };
    })

    .directive('tab', ['$parse', '$log', function ($parse, $log) {
        return {
            require: '^tabset',
            restrict: 'EA',
            replace: true,
            template: '<li ng-class="{active: active, disabled: disabled}">\
                            <a href ng-click="select()" tab-heading-transclude>{{heading}}</a>\
                       </li>',
            transclude: true,
            scope: {
                active: '=?',
                heading: '@',
                onSelect: '&select', //This callback is called in contentHeadingTransclude
                //once it inserts the tab's content into the dom
                onDeselect: '&deselect'
            },
            controller: function () {
                //Empty controller so other directives can require being 'under' a tab
            },
            link: function (scope, elm, attrs, tabsetCtrl, transclude) {
                scope.$watch('active', function (active) {
                    if (active) {
                        tabsetCtrl.select(scope);
                    }
                });

                scope.disabled = false;
                if (attrs.disable) {
                    scope.$parent.$watch($parse(attrs.disable), function (value) {
                        scope.disabled = !!value;
                    });
                }

                // Deprecation support of "disabled" parameter
                // fix(tab): IE9 disabled attr renders grey text on enabled tab #2677
                // This code is duplicated from the lines above to make it easy to remove once
                // the feature has been completely deprecated
                if (attrs.disabled) {
                    $log.warn('Use of "disabled" attribute has been deprecated, please use "disable"');
                    scope.$parent.$watch($parse(attrs.disabled), function (value) {
                        scope.disabled = !!value;
                    });
                }

                scope.select = function () {
                    if (!scope.disabled) {
                        scope.active = true;
                    }
                };

                tabsetCtrl.addTab(scope);
                scope.$on('$destroy', function () {
                    tabsetCtrl.removeTab(scope);
                });

                //We need to transclude later, once the content container is ready.
                //when this link happens, we're inside a tab heading.
                scope.$transcludeFn = transclude;
            }
        };
    }])

    .directive('tabHeadingTransclude', [function () {
        return {
            restrict: 'A',
            require: '^tab',
            link: function (scope, elm, attrs, tabCtrl) {
                scope.$watch('headingElement', function updateHeadingElement(heading) {
                    if (heading) {
                        elm.html('');
                        elm.append(heading);
                    }
                });
            }
        };
    }])
    .directive('tabContentTransclude', function () {
        return {
            restrict: 'A',
            require: '^tabset',
            link: function (scope, elm, attrs) {
                var tab = scope.$eval(attrs.tabContentTransclude);

                //Now our tab is ready to be transcluded: both the tab heading area
                //and the tab content area are loaded.  Transclude 'em both.
                tab.$transcludeFn(tab.$parent, function (contents) {
                    angular.forEach(contents, function (node) {
                        if (isTabHeading(node)) {
                            //Let tabHeadingTransclude know.
                            tab.headingElement = node;
                        } else {
                            elm.append(node);
                        }
                    });
                });
            }
        };
        function isTabHeading(node) {
            return node.tagName && (
                node.hasAttribute('tab-heading') ||
                    node.hasAttribute('data-tab-heading') ||
                    node.tagName.toLowerCase() === 'tab-heading' ||
                    node.tagName.toLowerCase() === 'data-tab-heading'
                );
        }
    })


/* ------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------ */

module
    .directive('cTabs', TabsDirective)
    .directive('cTab', TabDirective);

function TabsDirective() {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {},
        link: postLink,
        controller: TabsController,
        controllerAs: 'tabsCtrl',
        template: function (element, attr) {
            attr["tabsTemplate"] = element.html();

            return '<div class="tabsContainer">\
                        <div class="headLine">\
                            <div class="tabTitle" ng-repeat="tab in tabsCtrl.tabs" ng-click="tabsCtrl.selectTab(tab)">{{tab.label}}</div>\
                        </div>\
                        <div class="tabContent" ng-transclude></div>\
                    </div>';
        }
    };

    function postLink() {

    }
}

function TabsController($scope, $attrs, $compile) {
    var tabsCtrl = this;

    tabsCtrl.scope = $scope;
    tabsCtrl.tabs = [];


    tabsCtrl.addTab = function (tab) {
        tabsCtrl.tabs.push(tab)
    };

    tabsCtrl.selectTab = function (tab) {
        tab.activeCallback && tab.scope.$eval(tab.activeCallback);
    }
}

TabsController.$inject = ["$scope", "$attrs", "$compile"];


function TabDirective($templateRequest, $compile) {
    return {
        restrict: 'E',
        require: '^?cTabs',
        replace: true,
        transclude: true,
        template: '<div class="tabContent" ng-transclude></div>',
//        scope: {
//            activeFn: "&"
//        },
        link: postLink
    };


    function postLink(scope, element, attr, ctrl) {

        if (attr.tplUrl) {
            element.html(
                $compile(
                    angular.element('<div ng-include="\'' + attr.tplUrl + '\'">')
                )(scope)
            )
        }

        if (typeof ctrl == 'undefined' || ctrl == null) {
            return;
        }

        ctrl.addTab({
            label: attr.label,
            content: element.html(),
            scope: scope,
            activeCallback: attr.activeFn
        })
    }
}

TabDirective.$inject = ["$templateRequest", "$compile"];