/*global console, angular*/

(function () {

    'use strict';

    var userServices = function ($http, $cookies, $window, $rootScope, $q) {

        var deferred = $q.defer();

        this.load = function () {

            return $http.get('/app/load')
                .success(function (res) {

                    $rootScope.curr_user = {};

                    $rootScope.curr_user.id = res._id;
                    $rootScope.curr_user.email = res.email;
                    $rootScope.curr_user.name = res.name;
                    $rootScope.curr_user.avatar = res.avatar;
                    $rootScope.curr_user.facebook = res.facebook;
                    $rootScope.curr_user.github = res.github;
                    $rootScope.curr_user.classes = res.classes;
                    $rootScope.curr_user.history = res.history;
                    $rootScope.curr_user.likes = res.likes;

                    deferred.resolve();

                })
                .error(function (res) {

                    $rootScope.message_class = res.message_class;
                    $rootScope.message = res.message;

                });

        };

        this.logout = function () {

            $cookies.remove('session', {
                path: '/'
            });

            $window.location.href = '/';

        };

        this.updateUser = function (profile) {

            $http.post('/app/updateProfile', profile)
                .success(function (res) {
                    $rootScope.profile_message_class = res.message_class;
                    $rootScope.profile_message = res.message;
                })
                .error(function (res) {
                    $rootScope.profile_message_class = res.message_class;
                    $rootScope.profile_message = res.message;
                });

        };

        this.updatePassword = function (password) {

            $http.post('/app/updatePassword', password)
                .success(function (res) {
                    $rootScope.password_message_class = res.message_class;
                    $rootScope.password_message = res.message;
                })
                .error(function (res) {
                    $rootScope.password_message_class = res.message_class;
                    $rootScope.password_message = res.message;
                });

        };

    };

    userServices.$inject = ['$http', '$cookies', '$window', '$rootScope', '$q'];

    angular.module('app')
        .service('userServices', userServices);

}());
