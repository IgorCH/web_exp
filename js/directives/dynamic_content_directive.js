app.directive('dynamicContent', [function () {
    return{
        require: ['^?mdTabs', '^?mdTab'],
        terminal: true,
//        scope: {
//            canLoad: '=canLoad'
//        },
        link: function link(scope, element, attrs, ctrl) {

            console.log(['mdTab', ctrl, scope, attrs.dynamicContent, scope.$eval(attrs.dynamicContent)])

            scope.$watch('canLoad', function () {
                console.log('$watch', arguments);
            })
        },
        controller: function () {
            console.log('controller', arguments);
        }
    }
}])