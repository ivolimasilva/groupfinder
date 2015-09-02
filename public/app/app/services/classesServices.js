/*global console, angular*/

(function () {

    'use strict';

    var classesServices = function ($http, $rootScope, $q) {

        var deferred = $q.defer();

        this.load = function () {

            $http.get('/app/loadClasses')
                .success(function (res) {

                    delete $rootScope.classes;

                    $rootScope.classes = res;

                })
                .error(function (res) {

                    $rootScope.message_class = res.message_class;
                    $rootScope.message = res.message;

                });

        };

        this.enroll = function (classToEnroll) {

            $http.post('/app/enroll', classToEnroll)
                .success(function (res) {
                    $rootScope.enroll_message_class = res.message_class;
                    $rootScope.enroll_message = res.message;
                })
                .error(function (res) {
                    $rootScope.enroll_message_class = res.message_class;
                    $rootScope.enroll_message = res.message;
                });

        };

        this.dismiss = function (classToDismiss) {

            $http.post('/app/dismiss', classToDismiss)
                .success(function (res) {

                    $rootScope.dismiss_message_class = res.message_class;
                    $rootScope.dismiss_message = res.message;

                    var i, j, k;

                    for (i = 0; i < $rootScope.curr_user.classes.length; i++) {
                        if ($rootScope.curr_user.classes[i].code === classToDismiss.code) {
                            $rootScope.curr_user.classes.splice(i, 1);
                        }
                    }

                })
                .error(function (res) {
                    $rootScope.dismiss_message_class = res.message_class;
                    $rootScope.dismiss_message = res.message;
                });

        };

        this.loadStudents = function (code) {
            return $http.post('/app/loadStudents', code)
                .success(function (res) {
                    $rootScope.students_message_class = 'information';
                    $rootScope.students_message = 'Students loaded.';
                    deferred.resolve(res);
                })
                .error(function (res) {
                    $rootScope.students_message_class = res.message_class;
                    $rootScope.students_message = res.message;
                });
        };

    };

    classesServices.$inject = ['$http', '$rootScope', '$q'];

    angular.module('app')
        .service('classesServices', classesServices);

}());
