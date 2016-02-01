var ShowLargeImageDirective = function ($document, $compile) {
    var template = '\
        <div class="popoverBackground vs_showBigImage" ng-show="visible"></div>\
		<table ng-click="close()">\
		<tr><td>\
        <div class="vs_popupWhite vs_dynamic">\
            <div class="vs_popupWhiteHeader">\
                <h4>Image View\
                    <span></span>\
                </h4>\
            </div>\
            <button class="popoverCloseButton vs_popupCloseBtn" ng-click="close()">Close</button>\
            <div class="vs_popup_large_img" ng-show="visible">\
				<img src="{{showLargeImage}}">\
			</div>\
            <div class="vs_popupWhiteFooter">\
                <a href="javascript:void(0)" title="DesignersAxis" class="vs_background_logo"></a>\
                <div ng-if="canShowDialogButtons" class="vs_right">\
                    <button ng-click="okClick()">Ok</button>\
                    <button class="vs_nonDefault" ng-click="cancelClick()">Cancel</button>\
                </div>\
            </div>\
        </div>\
		</td></tr>\
		</table>';

    var linkFn = function (scope, element, attrs) {
        var body = $document.find('body');
        var imagePopup = {};

        element.addClass('vs_cursor_pointer');

        var createChildScope = function () {
            var childScope = scope.$new();

            childScope.visible = false;
            childScope.showLargeImage = scope.showLargeImage;
            childScope.close = function () {
                imagePopup.el.off('wheel');
                imagePopup.el.remove();
                imagePopup.scope.$destroy();
                imagePopup.el = undefined;

                imagePopup = {
                    scope: createChildScope()
                };
            };

            return childScope;
        };

        imagePopup = {
            scope: createChildScope()
        };

        element.on('click', function () {
            imagePopup.scope.visible = true;

            if (!imagePopup.el) {
                imagePopup.el = $compile(template)(imagePopup.scope);
                imagePopup.scope.$apply();

                body.append(imagePopup.el);

                imagePopup.el.on('wheel', function (e) {
                    e.preventDefault();
                })
            }
        });
    };

    return {
        scope: {
            showLargeImage: '='
        },
        link: linkFn
    }
};

ShowLargeImageDirective.$inject = ['$document', '$compile'];

app.directive('showLargeImage', ShowLargeImageDirective);