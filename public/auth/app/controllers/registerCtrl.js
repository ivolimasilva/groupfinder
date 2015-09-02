/*global angular, console, userServices*/

(function () {

    'use strict';

    var RegisterCtrl = function ($scope, userServices) {

        userServices.destroyCookie();

        $scope.register = function (user) {
            userServices.register(user);
        };
    };

    RegisterCtrl.$inject = ['$scope', 'userServices'];

    angular.module('auth')
        .controller('RegisterCtrl', RegisterCtrl);

}());
