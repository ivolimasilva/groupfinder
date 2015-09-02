/*global angular*/

(function () {

    'use strict';

    var app = angular.module('app', ['ngRoute', 'ngCookies', 'ngFileUpload']);

    app.config(function ($routeProvider, $locationProvider, $compileProvider) {

        $routeProvider
            .when('/', {
                redirectTo: '/find'
            })
            .when('/find', {
                controller: 'FindCtrl',
                templateUrl: 'app/views/find.ejs'
            })
            .when('/classes', {
                controller: 'ClassesCtrl',
                templateUrl: 'app/views/classes.ejs'
            })
            .when('/students', {
                controller: 'StudentsCtrl',
                templateUrl: 'app/views/students.ejs'
            })
            .when('/settings', {
                controller: 'SettingsCtrl',
                templateUrl: 'app/views/settings.ejs'
            })
            .when('/tutorial', {
                templateUrl: 'app/views/tutorial.ejs'
            })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);

        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);

    });

}());
