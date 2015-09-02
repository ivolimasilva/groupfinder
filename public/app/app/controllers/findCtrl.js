/*global angular, console, userServices*/

(function () {

    'use strict';

    var FindCtrl = function ($scope, $rootScope, userServices, studentsServices, classesServices) {

        $rootScope.page_name = 'Find students';
        $rootScope.message = '';

        userServices.load()
            .then(function () {
                if ($rootScope.curr_user.classes.length === 0) {
                    $rootScope.students_message_class = 'error';
                    $rootScope.students_message = 'Enroll in a class first.';
                } else {
                    $rootScope.students_message_class = '';
                    $rootScope.students_message = '';
                }
            });

        var deleteDoubles = function (classToLoad) {
                var i, j;
                for (i = 0; i < $scope.students.length; i++) {
                    for (j = 0; j < $rootScope.curr_user.history.length; j++) {
                        if ($rootScope.curr_user.history[j].code === classToLoad.code && $rootScope.curr_user.history[j].email === $scope.students[i].email) {
                            $scope.students.splice(i, 1);
                        }
                    }
                }
            },
            incIndex = function () {
                $scope.index++;
                if ($scope.index === $scope.students.length) {
                    $scope.index = 0;
                }
            },
            verifyStudents = function () {
                if ($scope.students.length === 0) {

                    $rootScope.students_message_class = 'error';
                    $rootScope.students_message = 'You already voted for all students.';

                    delete $scope.students;
                }
            },
            decIndex = function () {
                $scope.index--;
                if ($scope.index < 0) {
                    $rootScope.students_message_class = 'error';
                    $rootScope.students_message = 'You already voted for all students.';

                    delete $scope.students;
                }
            };

        $scope.updateText = function (classToLoad) {
            var i;

            delete $scope.students;

            for (i = 0; i < $rootScope.curr_user.classes.length; i++) {
                if (classToLoad.code === $rootScope.curr_user.classes[i].code) {
                    $scope.classToLoad.about = $rootScope.curr_user.classes[i].about;
                    break;
                }
            }
        };

        $scope.loadStudents = function (classToLoad) {

            classesServices.loadStudents(classToLoad)
                .then(function (students) {

                    $scope.students = students.data;

                    for (var i = 0; i < $scope.students.length; i++) {
                        $scope.students[i].code = classToLoad.code;
                    }

                    $scope.index = 0;

                    deleteDoubles(classToLoad);
                    verifyStudents();

                });
        };

        $scope.accept = function (index) {
            incIndex();

            studentsServices.sendToHistory($scope.students[index], $scope.classToLoad.code, true, $scope.classToLoad)
                .then(function () {
                    verifyStudents();
                    deleteDoubles($scope.classToLoad);
                    decIndex();
                });
        };

        $scope.pass = function (index) {
            incIndex();
        };

        $scope.deny = function (index) {
            incIndex();

            studentsServices.sendToHistory($scope.students[index], $scope.classToLoad.code, false, $scope.classToLoad)
                .then(function () {
                    verifyStudents();
                    deleteDoubles($scope.classToLoad);
                    decIndex();
                });
        };

        $rootScope.logout = function () {
            userServices.logout();
        };
    };

    FindCtrl.$inject = ['$scope', '$rootScope', 'userServices', 'studentsServices', 'classesServices'];

    angular.module('app')
        .controller('FindCtrl', FindCtrl);

}());
