app.directive('acPopup', PopupDirectory);

PopupDirectory.$inject = ["$rootScope", "$compile", '$q', '$document', '$parse'];


function PopupDirectory($rootScope, $compile, $q, $document, $parse) {

    var template = '\
        <div class="popoverBackground "  ng-show="visible" ng-click="close()"></div>\
        <table id="popupContainer">\
            <tr><td>\
                <div class="vs_popupWhite" ng-class="{\'vs_redWarn\' : (popupType == \'warning\' || popupType == \'error\'), \'{{popupClass}}\' : popupClass, \'{{popupWide}}\' : popupWide}">\
                    <div class="vs_popupWhiteHeader">\
                        <div class="vs_popupWhiteHeaderIcon" ng-class="iconClass"></div>\
                        <h4>{{title || "Message"}}\
                            <span></span>\
                        </h4>\
                    </div>\
                    <button class="popoverCloseButton vs_popupCloseBtn" ng-click="close()">Close</button>\
                    \
                    <div ng-include="includeUrl"></div>\
                    \
                    <div class="vs_popupWhiteFooter">\
                        <a href="javascript:void(0)" title="DesignersAxis" class="vs_background_logo" ng-if="popupType != \'warning\' && popupType != \'error\'"></a>\
                        <div class="popupFooterButtons" ng-show="popup.buttons.length > 0" ng-class="{\'vs_right\' : popupType != \'warning\' && popupType != \'error\'}">\
                            <button ng-click="button.fn()" ng-class="button.class" ng-repeat="button in popup.buttons">{{button.title}}</button>\
                        </div>\
                    </div>\
                </div>\
            </td></tr>\
        </table>';

    function link(scope, element, attrs, ctrl) {

        scope.canShowDialogButtons = attrs.okFn || attrs.cancelFn;
        scope.includeUrl = _app.urlCombine(window.rootUrl, attrs.acPopup);

        var createChildScope = function () {
            var childScope = scope.$new();

            childScope.popupType = scope.popupType;
            childScope.onClose = scope.onClose;
            childScope.popupClass = scope.popupClass;

            childScope.close = function () {

                popup.scope.popup.onClose && popup.scope.popup.onClose(function (returnData) {
                    popup.scope.beforeClose && popup.scope.beforeClose()(returnData);
                });

                scrollOff(popup.popupElement);

                popup.scope.onClose();
                popup.popupElement.remove();
                popup.scope.$destroy();
                popup.popupElement = undefined;

                popup = {
                    scope: createChildScope()
                };
            };

            childScope.okClick = function () {
                childScope.okFn && childScope.okFn();
                childScope.close();
            };

            childScope.cancelClick = function () {
                childScope.cancelFn && childScope.cancelFn();
                childScope.close();
            };

            childScope.popup = {
                data: scope.data,
                scope: childScope,
                buttons: scope.buttons || [],
                close: childScope.close,
                onClose: null
            };

            scope.$watch(function () {
                return childScope.popup.buttons;
            }, function (newButtons) {
                angular.forEach(wrapButtonsFn(newButtons), function (button) {
                    childScope.popup.buttons.push(button);
                });
            }, true);

            function wrapButtonsFn(buttons) {
                var newButtons = [];
                angular.forEach(buttons, function (button) {

                    if (button.$wrapped) return;

                    if (button.fn) {
                        var buttonFnLink = button.fn;
                        button.fn = function () {
                            console.log('button.fn 1');
                            var result = buttonFnLink();

                            if (result.then) {
                                result.success(function () {
                                    childScope.close();
                                })
                            } else if (result == true) {
                                childScope.close();
                            }
                        }
                    } else if (button.fnString) {
                        button.fn = function () {
                            var fn = $parse(button.fnString)(scope.$parent);
                            fn && fn();
                            childScope.close();
                        };
                    } else {
                        button.fn = function () {
                            childScope.close();
                            return true;
                        }
                    }

                    button.$wrapped = true;
                });

                return newButtons;
            }


            return childScope;
        };

        var popup = {
            scope: createChildScope()
        };

        scope.$watch(function () {
            return scope.data;
        }, function (newVal) {
            if (newVal) {
                popup.scope.popup.data = newVal;
            }
        }, true);

        var body = $document.find('body');

        var openFn = function () {
            popup.scope.visible = true;

            if (!popup.popupElement) {
                popup.popupElement = $compile(scope.plainText ?
                    updateTemplateForPlainTextMode(template) : template)(popup.scope);

                if (!scope.openNow && scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') popup.scope.$apply();

                body.append(popup.popupElement);

                scrollON(popup.popupElement);
            }
        };

        if (scope.openNow) {
            openFn();
        } else {
            element.on('click', function () {
                if (attrs.beforeShow) {

                    var callback = function () {

                        var result = scope.$parent.$eval(attrs.beforeShow);
                        var defer = $q.defer();
                        var promise = defer.promise;

                        if (result && result.then) {
                            promise = result;
                        } else if (!!result == true) {
                            defer.resolve();
                        } else {
                            defer.reject();
                        }

                        return promise;
                    };

                    callback().success(function () {
                        openFn();
                    });
                } else {
                    openFn()
                }
            });
        }

        function updateTemplateForPlainTextMode(template) {
            return template.replace(
                '<div ng-include="includeUrl"></div>',
                '<div class="popup_msg_container ac_plain_text">{{plainText}}</div>'
            );
        }

        function scrollOff(element) {
            if (scope.scrollDisable) {
                element.off('wheel');
            }
        }

        function scrollON(element) {
            if (scope.scrollDisable == true) {
                element.on('wheel', function (e) {
                    e.preventDefault();
                });
            }
        }
    }

    return {
        link: link,
        scope: {
            data: '=',
            title: '@',
            iconClass: '@',
            okFn: '&',
            cancelFn: '&',
            popupType: '@',
            buttons: "=",
            scrollDisable: '=',
            plainText: '@',
            openNow: '=',
            onClose: '&',
            beforeClose: '&',
            popupClass: '@',
            popupWide: '@',
            beforeShow: '&'
        }
    }
}