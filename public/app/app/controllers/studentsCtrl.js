/*global angular, console, userServices*/

(function () {

    'use strict';

    var StudentsCtrl = function ($scope, $rootScope, userServices, studentsServices) {

        $rootScope.page_name = 'Students';
        $rootScope.message = '';

        var matchesFunc = function () {
            $scope.matches = [];

            var k = 0;

            for (var i = 0; i < $rootScope.curr_user.history.length; i++) {
                for (var j = 0; j < $rootScope.curr_user.likes.length; j++) {
                    if ($rootScope.curr_user.history[i].code === $rootScope.curr_user.likes[j].code && $rootScope.curr_user.history[i].email === $rootScope.curr_user.likes[j].email) {
                        $scope.matches[k] = $rootScope.curr_user.history[i];
                        k++;
                    }
                }
            }
        };

        userServices.load()
            .then(function () {
                matchesFunc();
            });

        $scope.removeFromHistory = function (history) {
            studentsServices.removeFromHistory(history)
                .then(function () {
                    userServices.load()
                        .then(function () {
                            matchesFunc();
                        });
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
