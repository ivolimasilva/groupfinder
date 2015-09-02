/*global require, exports, console*/

(function () {

    'use strict';

    exports.checkvalidemail = function (email) {

        //var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //return re.test(email);

        if (email.search('@fe.up.pt') === email.length - 9) {
            return true;
        } else {
            return false;
        }

    };

    exports.checkvalidpassword = function (password) {

        if (!password || password.length < 8) {
            return false;
        } else {
            return true;
        }

    };

    exports.checkvalidinitials = function (initials) {

        // TODO: An actual function

        return true;

    };

}());
