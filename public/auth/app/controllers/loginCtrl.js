/*global angular, console, userServices*/

(function () {

    'use strict';

    var LoginCtrl = function ($scope, userServices) {

        userServices.destroyCookie();
        
        $scope.login = function (user) {
            userServices.login(user);
        };

    };

    LoginCtrl.$inject = ['$scope', 'userServices'];

    angular.module('auth')
        .controller('LoginCtrl', LoginCtrl);

}());
