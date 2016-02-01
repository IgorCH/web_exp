app.factory('Popup', PopupFactory);

PopupFactory.$inject = ["$rootScope", "$compile", '$q', '$document', '$parse'];


function PopupFactory($rootScope, $compile, $q, $document, $parse) {

    return {
        open: open,
        confirm: confirm,
        showSuccess: showSuccess,
        showInfo: showInfo,
        showWarning: showWarning,
        showError: showError
    };

    function confirm(question, confirmFunc) {
        var params = {
            plainText: question,
            scope: $rootScope,
            title: 'Confirmation',
            buttons: [{
                title: 'Yes',
                fn: confirmFunc
            }, {
                title: 'No',
                fn: function(){
                    return true;
                }
            }]
        };
        open(params);
    }

    function showSuccess(msg) {
        var params = {
            plainText: msg,
            scope: $rootScope,
            popupType: 'success',
            title: 'Success'
        };
        open(params);
    }

    function showInfo(msg) {
        var params = {
            plainText: msg,
            scope: $rootScope,
            popupType: 'info',
            title: 'Info'
        };
        open(params);
    }

    function showWarning(msg) {
        var params = {
            plainText: msg,
            scope: $rootScope,
            popupType: 'warning',
            title: 'Warning'
        };
        open(params);
    }

    function showError(msg) {
        var params = {
            plainText: msg,
            scope: $rootScope,
            popupType: 'error',
            title: 'Error'
        };
        open(params);
    }

    function open(params) {
        if (!params) return null;

        var popup = {
            scope: null,
            el: null,
            close: destroy
        };

        var template = '<div style="display: none;" on-close="destroy()" open-now="true" data="data" title="{{title}}" plain-text="{{plainText}}" ' +
            'ac-popup="{{templateUrl}}" popup-class="{{popupClass}}" popup-type="{{popupType}}" scroll-disable="false" popup-wide="{{popupWide}}"' +
            'buttons="buttons" before-close="beforeClose" popup-width="{{popupWidth}}" icon-class="{{iconClass}}"></div>';

        var childScope = popup.scope = params.scope.$new();
        childScope.popupClass = params.plainText ? 'ac_popup_msg' : childScope.popupClass;
        childScope.beforeClose = params.beforeClose || function () {};

        var skipKeys = ['popupClass', 'beforeClose'];
        angular.forEach(params, function (val, key) {
            if (skipKeys.indexOf(key) == -1) {
                childScope[key] = val;
            }
        });

        childScope.destroy = destroy;

        var templateElement = angular.element(template);
        angular.element('body').prepend(templateElement);
        childScope.element = templateElement;
        popup.el = $compile(templateElement)(childScope);

        function destroy() {
            this.element.remove();
            this.$destroy();
        }

        return popup;
    }

}