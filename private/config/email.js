/*global exports, require, console*/

(function () {

    'use strict';

    var email = require('emailjs'),
        secret = require('../assets/secrets.js'),
        server,
        createHtmlForMail = function (code) {
            return '<html><h1>Groupfinder Validation</h1><a href="http://groupfinder.tk/auth/validate/' + code + '">Click here to validate.</a><br><br><small>Do not reply to this e-mail address or share this link.</small></html>';
        };

    exports.connectServer = function () {
        server = email.server.connect({
            user: secret.email_user,
            password: secret.email_password,
            host: secret.email_host,
            tls: {
                ciphers: 'SSLv3'
            }
        });
    };

    exports.sendConfirmTo = function (contact, code) {

        var message = {
            from: 'Groupfinder Helper <support@groupfinder.com>',
            to: contact,
            subject: 'E-mail validation',
            attachment: [
                {
                    data: createHtmlForMail(code),
                    alternative: true
                }]
        };

        server.send(message, function (err, message) {
            if (err) {
                console.log(err);
            }
        });

    };

}());