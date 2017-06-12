myApp.directive('timeDir', function ($timeout) {
    return {
        restrict: 'E',
        templateUrl: 'TimeTemp.html',
        
        scope: {
            message: '@',
            timetype: '=',
            timefunction: '&'
        },
        link: function (scope, element, attribute)
        {
            scope.timetype = new Date();
        }
    }
});