/*global console, angular*/

(function () {

    'use strict';

    var studentsServices = function ($http, $rootScope, $q) {

        var deferred = $q.defer();

        this.sendToHistory = function (student, code, flag, classToLoad) {

            var historyObject = {
                id: student.id,
                name: student.name,
                email: student.email,
                facebook: student.facebook,
                github: student.github,
                avatar: student.avatar,
                about: student.about,
                code: code,
                flag: flag,
                aboutlike: classToLoad.about,
                namelike: $rootScope.curr_user.name,
                emaillike: $rootScope.curr_user.email,
                facebooklike: $rootScope.curr_user.facebook,
                githublike: $rootScope.curr_user.github,
                avatarlike: $rootScope.curr_user.avatar
            };

            return $http.post('/app/history', historyObject)
                .success(function (res) {

                    $rootScope.curr_user.history.push(historyObject);

                    deferred.resolve();

                })
                .error(function (res) {

                    $rootScope.message_class = res.message_class;
                    $rootScope.message = res.message;

                    deferred.reject();

                });

        };

        this.removeFromHistory = function (history) {

            return $http.post('/app/removeHistory', history)
                .success(function (res) {
                    $rootScope.message_class = res.message_class;
                    $rootScope.message = res.message;

                    deferred.resolve();
                })
                .error(function (res) {
                    $rootScope.message_class = res.message_class;
                    $rootScope.message = res.message;

                    deferred.reject();
                });

        };

    };

    studentsServices.$inject = ['$http', '$rootScope', '$q'];

    angular.module('app')
        .service('studentsServices', studentsServices);

}());
