/*global require, exports, console*/

(function () {

    'use strict';

    var jwt = require('jsonwebtoken'),
        Promise = require('bluebird'),
        secret = require('../assets/secrets.js'),
        secret_cifer = secret.jwt_secret;

    exports.sign = function (res, payload) {
        var token = jwt.sign(payload, secret_cifer);
        res.send(token);
    };
    
    exports.decode = function (token) {
        return jwt.decode(token);
    };

    exports.verify = function (token) {
        return new Promise(function (resolve, reject) {
            try {
                var user = jwt.verify(token, secret_cifer);
                resolve(user);
            } catch (err) {
                reject(err);
            }
        });
    };

}());