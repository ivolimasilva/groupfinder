/*global angular*/

(function () {

    'use strict';

    var app = angular.module('auth', ['ngRoute', 'ngCookies']);

    app.config(function ($routeProvider, $locationProvider) {

        $routeProvider
            .when('/', {
                redirectTo: '/login'
            })
            .when('/login', {
                controller: 'LoginCtrl',
                templateUrl: 'app/views/login.ejs'
            })
            .when('/register', {
                controller: 'RegisterCtrl',
                templateUrl: 'app/views/register.ejs'
            })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);

    });

}());
