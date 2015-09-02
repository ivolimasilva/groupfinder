/*global console, angular*/

(function () {

    'use strict';

    var userServices = function ($http, $cookies, $window, $rootScope) {

        this.login = function (user) {

            $http.post('/auth/login', user)
                .success(function (res) {

                    $cookies.put('session', res, {
                        path: '/'
                    });
                    $window.location.href = '/app';

                })
                .error(function (res) {

                    $rootScope.message_class = res.message_class;
                    $rootScope.message = res.message;

                });

        };

        this.register = function (user) {

            $http.post('/auth/register', user)
                .success(function (res) {

                    user.email = '';
                    user.name = '';
                    user.password = '';
                    user.repeatpassword = '';

                    $rootScope.message_class = res.message_class;
                    $rootScope.message = res.message;

                })
                .error(function (res) {

                    $rootScope.message_class = res.message_class;
                    $rootScope.message = res.message;

                });

        };

        this.destroyCookie = function () {

            $cookies.remove('session', {
                path: '/'
            });

        };

    };

    userServices.$inject = ['$http', '$cookies', '$window', '$rootScope'];

    angular.module('auth')
        .service('userServices', userServices);

}());
