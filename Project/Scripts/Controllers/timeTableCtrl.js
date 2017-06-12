myApp.controller('timeTableCtrl', ['$scope', '$filter', '$location', '$rootScope', function ($scope, $filter, $location, $rootScope) {
    $scope.showText = false;
    //========================================================================================
    //                    fill timesArr with data from  localStorage
    //========================================================================================

    for (var i = 0; i < localStorage.length; i++) {
        $scope.timesArr[i] = JSON.parse(localStorage.getItem(i.toString()));
    }
    $scope.arr = angular.copy($scope.timesArr);
    //------routing
    $scope.Route = function (pageName) {
        $scope.page = pageName;
        $location.path(pageName);
    };
    var date;
    $scope.filter = function () {

        $scope.timesArr = angular.copy($scope.arr);

        if ($scope.month != "") {
            angular.forEach($scope.timesArr, function (item) {
                date = "" + item.date;
                item.Month = date.split(".")[1];
            });

            $scope.timesArr = $filter('filter')($scope.timesArr, { Month: $scope.month });
        }



    }

} ]);