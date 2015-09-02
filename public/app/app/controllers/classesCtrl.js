/*global angular, console, userServices*/

(function () {

    'use strict';

    var ClassesCtrl = function ($scope, $rootScope, userServices, classesServices) {

        $rootScope.page_name = 'Classes';
        $rootScope.message = '';

        userServices.load();
        classesServices.load();

        $rootScope.logout = function () {
            userServices.logout();
        };

        $scope.enroll = function (classToEnroll, code) {

            var i;

            for (i = 0; i < $rootScope.classes[classToEnroll.year][classToEnroll.semester].length; i++) {
                if ($rootScope.classes[classToEnroll.year][classToEnroll.semester][i].code === classToEnroll.code) {
                    classToEnroll.initials = $rootScope.classes[classToEnroll.year][classToEnroll.semester][i].initials;
                    classToEnroll.name = $rootScope.classes[classToEnroll.year][classToEnroll.semester][i].name;
                    break;
                }
            }

            classesServices.enroll(classToEnroll);

            userServices.load();
            classesServices.load();

            $scope.classToEnroll = {};

        };

        $scope.dismiss = function (classToDismiss) {

            classesServices.dismiss(classToDismiss);

            classesServices.load();

        };

        $scope.updateText = function (classSelected) {
            var i;
            $scope.classToEnroll.about = '';
            for (i = 0; i < $rootScope.curr_user.classes.length; i++) {
                if (classSelected.code === $rootScope.curr_user.classes[i].code) {
                    $scope.classToEnroll.about = $rootScope.curr_user.classes[i].about;
                    break;
                }
            }
        };

    };

    ClassesCtrl.$inject = ['$scope', '$rootScope', 'userServices', 'classesServices'];

    angular.module('app')
        .controller('ClassesCtrl', ClassesCtrl);

}());
