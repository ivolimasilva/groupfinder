/*global require, module, console*/

(function () {

    'use strict';

    var Promise = require('bluebird'),
        jwt = require('./jsonwebtoken');

    module.exports = function (req, res) {

        return new Promise(function (resolve, reject) {
            if (req.cookies.session) {
                jwt.verify(req.cookies.session)
                    .then(function (user) {
                        resolve(user);
                    })
                    .catch(function (err) {
                        reject(err);
                    });
            } else {
                reject(res);
            }
        });

    };

}());