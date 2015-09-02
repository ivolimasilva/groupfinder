/*global angular, console, userServices*/

(function () {

    'use strict';

    var StudentsCtrl = function ($scope, $rootScope, userServices, studentsServices) {

        $rootScope.page_name = 'Students';
        $rootScope.message = '';

        userServices.load();

        $scope.removeFromHistory = function (history) {
            studentsServices.removeFromHistory(history)
                .then(function () {
                    userServices.load();
                });
        };

        $rootScope.logout = function () {
            userServices.logout();
        };
    };

    StudentsCtrl.$inject = ['$scope', '$rootScope', 'userServices', 'studentsServices'];

    angular.module('app')
        .controller('StudentsCtrl', StudentsCtrl);

}());
