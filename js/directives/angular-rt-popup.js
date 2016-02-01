angular.module('rt.popup', [])
    .factory('Popup', ["$window", "$document", "$timeout", "$compile", "$parse", function ($window, $document, $timeout, $compile, $parse) {
        var openedPopup = null;
        var body = null;
        var backgroundTpl = '<div style="position: fixed;width: 100%;height: 100%;top:0;left: 0;z-index: 100;"></div>',
            template = '<div class="popover"><div ng-include="popupView" onload="$reposition()"></div></div>';
        var scrollLocked = false;

        // Padding towards edges of screen.
        var padding = 10;

        function hidePopup() {
            if (!openedPopup) {
                return;
            }

            var popup = openedPopup;
            openedPopup = null;
            scrollLocked = false;

            $timeout(function () {
                $parse(popup.options.popupHidden)(popup.scope);

                popup.background.unbind('click');
                body.unbind('mousewheel');

                popup.background.hide().remove();
                popup.el.hide().remove();
            });
        }

        function extend(obj, values) {
            for (var key in values) {
                if (!obj[key]) {
                    obj[key] = values[key];
                }
            }
        }

        function showPopup(anchor, scope, attrs) {
            extend(attrs, {
                popupPlacement: 'right',
                popupPlacementFn: null,
                popupClass: '',
                popupShown: '',
                popupHidden: '',
                popupOverlap: '5' // Overlap with anchor element
            });

            scope.popupView = attrs.popupShow;
            scope.hidePopover = hidePopup;

            $timeout(function () {
                makePopup(anchor, scope, attrs);
            });
        }

        function offset(el, options) {
            var rect = el[0].getBoundingClientRect();
            return {
                width: rect.width || el.prop('offsetWidth'),
                height: rect.height || el.prop('offsetHeight'),
                top: rect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
                left: rect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft),
                clientX: options.clientX,
                clientY: options.clientY
            };
        }

        function fixPosition(scope, anchor, element, arrow, options) {
            var popupPosition = null;
            var arrowPosition = null;
            var anchorPoint = null;
            var anchorGeom = offset(anchor, options);

            var placement = options.popupPlacement;

            var fn = options.popupPlacementFn ? $parse(options.popupPlacementFn)(scope) : null;
            if (angular.isFunction(fn)) {
                placement = fn(anchorGeom);
            }

            var maxHeight = $window.innerHeight - 2 * padding;

            var overlap = +options.popupOverlap;

            var minWidth = 0;

            // custom params for vendor popover
            var popupWidth = 1024,
                popupHalfWidth = popupWidth / 2,
                windowCenter = window.innerWidth / 2,
                positionCenterLeft = windowCenter - popupHalfWidth,
                positionLeftLeft = 50,
                positionRightLeft = window.innerWidth - popupWidth - 50,
                paddingVendor = window.innerWidth <= popupWidth ? 0 : padding;
            // ---------------------------------

            // Calculate popup position
            if (placement === 'right') {
                anchorPoint = {
                    top: anchorGeom.top + anchorGeom.height / 2,
                    left: anchorGeom.left + anchorGeom.width - overlap
                };

                popupPosition = {
                    top: anchorPoint.top - element.height() / 2,
                    left: anchorPoint.left
                };

                // Clamp for edge of screen
                popupPosition.top = Math.max(padding, popupPosition.top);
                maxHeight -= popupPosition.top;

                arrowPosition = {
                    top: anchorPoint.top - popupPosition.top
                };
            } else if (placement === 'left') {
                anchorPoint = {
                    top: anchorGeom.top + anchorGeom.height / 2,
                    left: anchorGeom.left + overlap - 2
                };

                popupPosition = {
                    top: anchorPoint.top - element.height() / 2,
                    right: $window.innerWidth - anchorPoint.left
                };

                // Clamp for edge of screen
                popupPosition.top = Math.max(padding, popupPosition.top);
                maxHeight -= popupPosition.top;

                arrowPosition = {
                    top: anchorPoint.top - popupPosition.top
                };
            } else if (placement === 'bottom') {
                anchorPoint = {
                    top: anchorGeom.top + anchorGeom.height,
                    left: anchorGeom.left + anchorGeom.width / 2
                };

                popupPosition = {
                    top: anchorPoint.top - overlap,
                    left: anchorPoint.left - element.width() / 2
                };

                // Clamp for edge of screen
                popupPosition.left = Math.max(padding, popupPosition.left);
                maxHeight -= popupPosition.top;

                arrowPosition = {
                    left: anchorPoint.left - popupPosition.left
                };
            } else if (placement === 'bottom-left') {
                anchorPoint = {
                    top: anchorGeom.top + anchorGeom.height,
                    left: anchorGeom.left + element.width() / 2
                };

                popupPosition = {
                    top: anchorPoint.top - overlap,
                    left: anchorPoint.left - element.width() / 2
                };

                // Clamp for edge of screen
                popupPosition.left = Math.max(padding, popupPosition.left);
                maxHeight -= popupPosition.top;

                // Update placement so we get the class name
                placement = 'bottom';

                arrowPosition = {
                    left: anchorPoint.left - popupPosition.left
                };
            } else if (placement === 'top') {
                anchorPoint = {
                    top: anchorGeom.top - element.outerHeight(),
                    left: anchorGeom.left + anchorGeom.width / 2
                };

                popupPosition = {
                    top: anchorPoint.top + overlap,
                    left: anchorPoint.left - element.width() / 2
                };

                // Clamp for edge of screen
                popupPosition.left = Math.max(padding, popupPosition.left);
                maxHeight -= popupPosition.top;

                arrowPosition = {
                    left: anchorPoint.left - popupPosition.left
                };
            } else if (placement === 'bottom-custom') {
                anchorPoint = {
                    top: anchorGeom.top + anchorGeom.height,
                    left: anchorGeom.left + anchorGeom.width / 2
                };

                var isOutOfRangeLeft = anchorPoint.left - element.width() < 0,
                    isOutOfRangeRight = anchorPoint.left + element.width() > window.innerWidth,
                    popupPositionLeft = 0;

                if (isOutOfRangeLeft == true || isOutOfRangeRight == true) {
                    popupPositionLeft = anchorPoint.left - element.width();
                } else {
                    popupPositionLeft = anchorPoint.left - element.width() / 2;
                }

                popupPosition = {
                    top: anchorPoint.top - overlap,
                    left: popupPositionLeft
                };

                // Clamp for edge of screen
                popupPosition.left = Math.max(padding, popupPosition.left);
                maxHeight -= popupPosition.top;

                var arrowPositionLeft = 0;
                if (isOutOfRangeLeft == true) {
                    arrowPositionLeft = anchorGeom.left + anchorGeom.width - 20;
                } else if (isOutOfRangeRight == true) {
                    arrowPositionLeft = anchorGeom.left - popupPosition.left + 7;
                } else {
                    arrowPositionLeft = anchorPoint.left - popupPosition.left;
                }

                arrowPosition = {
                    left: arrowPositionLeft
                };

                // Update placement so we get the class name
                placement = 'bottom';

            } else if (placement === 'top-custom') {
                anchorPoint = {
                    top: anchorGeom.top - element.outerHeight(),
                    left: anchorGeom.left + anchorGeom.width / 2
                };

                var isOutOfRangeLeft = anchorPoint.left - element.width() < 0,
                    isOutOfRangeRight = anchorPoint.left + element.width() > window.innerWidth,
                    popupPositionLeft = 0;

                if (isOutOfRangeLeft == true || isOutOfRangeRight == true) {
                    popupPositionLeft = anchorPoint.left - element.width();
                } else {
                    popupPositionLeft = anchorPoint.left - element.width() / 2;
                }

                popupPosition = {
                    top: anchorPoint.top + overlap,
                    left: popupPositionLeft
                };

                // Clamp for edge of screen
                popupPosition.left = Math.max(padding, popupPosition.left);
                maxHeight -= popupPosition.top;

                var arrowPositionLeft = 0;
                if (isOutOfRangeLeft == true) {
                    arrowPositionLeft = anchorGeom.left + anchorGeom.width - 20;
                } else if (isOutOfRangeRight == true) {
                    arrowPositionLeft = anchorGeom.left - popupPosition.left + 7;
                } else {
                    arrowPositionLeft = anchorPoint.left - popupPosition.left;
                }

                arrowPosition = {
                    left: arrowPositionLeft
                };

                placement = 'top';
            } else if (placement === 'bottom-vendor') {

                anchorPoint = {
                    top: anchorGeom.top + anchorGeom.height,
                    left: anchorGeom.left + anchorGeom.width / 2
                };

                popupPosition = {
                    top: anchorPoint.top - overlap,
                    left: anchorPoint.left < positionCenterLeft ?
                        positionLeftLeft :
                        anchorPoint.left < windowCenter + popupHalfWidth ? positionCenterLeft : positionRightLeft
                };

                // Clamp for edge of screen
                popupPosition.left = Math.max(paddingVendor, popupPosition.left);

                arrowPosition = {
                    left: anchorPoint.left - popupPosition.left
                };

                // Update placement so we get the class name
                placement = 'bottom';
                minWidth = 1024;

            } else if (placement === 'top-vendor') {

                anchorPoint = {
                    top: anchorGeom.top - element.outerHeight(),
                    left: anchorGeom.left + anchorGeom.width / 2
                };

                popupPosition = {
                    top: anchorPoint.top + overlap,
                    left: anchorPoint.left < positionCenterLeft ?
                        positionLeftLeft :
                        anchorPoint.left < windowCenter + popupHalfWidth ? positionCenterLeft : positionRightLeft
                };

                // Clamp for edge of screen
                popupPosition.left = Math.max(paddingVendor, popupPosition.left);

                arrowPosition = {
                    left: anchorPoint.left - popupPosition.left
                };

                placement = 'top';
                minWidth = 1024;
            } else {
                throw new Error('Unsupported placement ' + placement);
            }

            element.removeClass('left right bottom top');
            element.addClass(placement);
            element.css({
                top: popupPosition.top !== undefined ? popupPosition.top + 'px' : 'initial',
                left: popupPosition.left !== undefined ? popupPosition.left + 'px' : 'initial',
                right: popupPosition.right !== undefined ? popupPosition.right + 'px' : 'initial',
                display: 'block',
//                maxHeight: maxHeight,
                'min-width': minWidth
            });

            var header = element.find('.popover-title');
            var content = element.find('.popover-content');
            var footer = element.find('.popover-footer');
            content.css({
                // Need to figure out where this 4 comes from.
                maxHeight: maxHeight - footer.outerHeight() - header.outerHeight() - 4,
                overflow: 'auto'
            });

            if (arrowPosition) {
                arrow.css(arrowPosition);
            }

            element.removeClass('hide');

            $parse(options.popupShown)(scope);
        }

        function makePopup(anchor, scope, options) {
            var element = $compile(template)(scope);
            var background = angular.element(backgroundTpl);

            openedPopup = {
                el: element,
                options: options,
                scope: scope,
                background: background
            };

            body = $document.find('body');
            body.append(background);
            body.append(element);

            background.bind('click', function(){
                hidePopup();
            });

            // Add arrow
            var arrow = $('<div />', { 'class': 'arrow' });
            element.children('.arrow').remove();
            element.append(arrow);

            body.bind('mousewheel', function (e) {
                if (scrollLocked == true) {
//                    var $div = $('div');
//                    $div.scrollTop($div.scrollTop() - e.originalEvent.wheelDelta);
//                    return false;
                    //e.preventDefault();
                }
            });

            scope.$reposition = function () {
                // add extra class here, to ensure that the width calculation takes this into account
                var extra_class = options.popupClass;
                if (extra_class) {
                    element.addClass(extra_class);
                }

                $timeout(function () {
                    scrollLocked = true;
                    fixPosition(scope, anchor, element, arrow, options);
                });
            };
        }

        return {
            show: showPopup,
            close: hidePopup
        };
    }])

    .directive('popupShow', ["Popup", "$parse", "$timeout", function (Popup, $parse, $timeout) {
        return {
            restrict: 'AC',
            scope: true,
            link: function (scope, element, attrs) {
                scope.popover = Popup;

                scope.$watch(attrs.popupRecord, function (record) {
                    scope.record = record;
                });

                element.click(function (event) {
                    $timeout(function () {
                        Popup.close();

                        var shouldShow = $parse(attrs.popupIf || 'true');
                        if (shouldShow(scope)) {
                            attrs.clientX = event.clientX;
                            attrs.clientY = event.clientY;
                            Popup.show(element, scope, attrs);
                        }
                    });
                });
            }
        };
    }])

    .directive('popupAutoShow', ["Popup", "$parse", function (Popup, $parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(attrs.popupAutoShow, function (val) {
                    if (val) {
                        Popup.close();
                        var shouldShow = $parse(attrs.popupIf || 'true');
                        if (shouldShow(scope)) {
                            Popup.show(element, scope, attrs);
                        }
                    }
                });
            }
        };
    }]);
