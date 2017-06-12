//--------------------------pages routing-----------------------------

var myApp = angular.module('myApp', ['ui.bootstrap', 'ngRoute', 'ds.clock', 'ngAnimate', 'chart.js']);
myApp.config(function ($RouteProvider) {
    $RouteProvider
        .when('/TimeTable', {
            templateUrl: 'Scripts/TimeTable.html',
            controller: 'timeTableCtrl'
        })
        .when('/HomePage', {
            templateUrl: '../homePage.html',
            controller: 'myCtrl'
        })
         .otherwise({
             templateUrl: '../homePage.html',
             controller: 'myCtrl'
         });

});