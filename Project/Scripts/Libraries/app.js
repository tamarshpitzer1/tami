

var myApp = angular.module('myApp', ['ds.clock', 'ui.bootstrap', 'ngAnimate', 'ngRoute','chart.js']);//.controller("AppCtrl", function ($scope) {});
myApp.config(function ($routeProvider) {//ניתוב הדפים
    $routeProvider
        .when('/TimeTable', {//הפניה לעמוד הבית
            templateUrl: 'Scripts/TimeTable.html',
            controller: 'timeTableCtrl'
        })
        .when('/HomePage', {//הפניה לעמוד הבית עם קונטרולר (התנהגות לוגית) שונה
            templateUrl: '../homePage.html',
            controller: 'myCtrl'
        })
         .when('/EnterTime', {
             templateUrl: '../EnterTime.html',
             controller: 'myCtrl'//אותו קונטרוללר משמש את שני הדפים
         })
        .when('/ExitTime', {
            templateUrl: '../ExitTime.html',
            controller: 'myCtrl'//אותו קונטרוללר משמש את שני הדפים
        })

  .config('ChartJsProvider',function(ChartJsProvider{

    ChartJsProvider.setOptions({
        coloures: ['#122312', '#552233'],
        responsive: false
    });
    ChartJsProvider.setOptions('line', {
    datasetFill:false
    })
    }));
    
}]);
.contrller("LineCtrl",["$scope","$timeout", function($scope, $timeout){
$scope.labels=['eeee','ss','fdfd','dada','ddd','sss'];
$scope.series=['Series a','Series B'];
$scope.data=[[33,31,55,33,33,44,22],
[44,33,66,44,52,66,11]];

$scope.onClick=function(points, evt){
cosule.log(points,evt);

}
$timeout(function(){$scope.date=[[11,22,33,44,55,66,77],[99,88,77,66,55,44,33]];


},3000);
}]);