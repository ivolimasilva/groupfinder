/*global angular, console, userServices*/

(function () {

    'use strict';

    var SettingsCtrl = function ($scope, Upload, $rootScope, userServices) {

        $rootScope.page_name = 'Settings';
        $rootScope.message = '';

        userServices.load()
            .then(function () {
                $scope.profile = $rootScope.curr_user;
            });

        $scope.updateProfile = function (profile) {
            userServices.updateUser(profile);
        };

        $scope.updatePassword = function (password) {
            userServices.updatePassword(password);
        };

        $rootScope.logout = function () {
            userServices.logout();
        };

        $scope.$watch('file', function (file) {
            if (file) {
                $scope.upload($scope.file);
            }
        });

        $scope.upload = function (file) {

            Upload.upload({
                url: 'updatePicture/',
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                file: file
            }).success(function (data, status, headers, config) {

                $scope.picture_message = data.message;
                $scope.picture_message_class = data.message_class;
                $rootScope.curr_user.avatar = data.avatar;

            }).error(function (data, status, headers, config) {

                $scope.picture_message = data.message;
                $scope.picture_message_class = data.message_class;

            });
        };

    };

    SettingsCtrl.$inject = ['$scope', 'Upload', '$rootScope', 'userServices'];

    angular.module('app')
        .controller('SettingsCtrl', SettingsCtrl);

}());
