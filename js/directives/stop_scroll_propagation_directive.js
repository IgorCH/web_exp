app.directive('stopScrollPropagation', stopScrollPropagation);

stopScrollPropagation.$inject = [];

function stopScrollPropagation() {

    function linkFn(scope, element, attr) {
        element.on('wheel', function (e) {
            stopScrollProp(e)
        });
        element.on('touchmove', function (e) {
            stopScrollProp(e)
        });
        function stopScrollProp(e) {
            e.stopImmediatePropagation();

            if (element[0].offsetHeight + element[0].scrollTop >= element[0].scrollHeight && e.originalEvent.wheelDelta < 0 ||
                element[0].scrollTop == 0 && e.originalEvent.wheelDelta > 0) {
                e.preventDefault();
            }
        }
    }

    return {
        scope: {
            preventEvent: '@'
        },
        link: linkFn
    }
}