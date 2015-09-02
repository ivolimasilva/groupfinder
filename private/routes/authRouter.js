/*global require, module, console*/

(function () {

    'use strict';

    var database = require('../config/database'),
        jwt = require('../config/jsonwebtoken'),
        stringvalidator = require('../config/stringvalidator'),
        email = require('../config/email'),
        cookieValidator = require('../config/cookieValidator'),
        defaultRoute = function (req, res) {
            cookieValidator(req, res)
                .then(function (user) {
                    res.redirect('/app');
                })
                .catch(function (err) {
                    res.render('auth/index');
                });
        };

    module.exports = function (server) {

        server.get('/auth', defaultRoute);

        server.get('/auth/register', defaultRoute);

        server.get('/auth/login', defaultRoute);

        server.post('/auth/login', function (req, res) {

            if (!stringvalidator.checkvalidemail(req.body.email) || !stringvalidator.checkvalidpassword(req.body.password)) {
                res.status(400).json({
                    message_class: 'error',
                    message: 'Invalid e-mail or password'
                });
            } else {
                database.login(req.body)
                    .then(function (result) {

                        jwt.sign(res, result);

                    })
                    .catch(function (result) {

                        res.status(400).json({
                            message_class: 'error',
                            message: result
                        });

                    });
            }

        });

        server.post('/auth/register', function (req, res) {

            if (!stringvalidator.checkvalidemail(req.body.email)) {
                res.status(400).json({
                    message_class: 'error',
                    message: 'Invalid e-mail.'
                });
            } else if (!req.body.name) {
                res.status(400).json({
                    message_class: 'error',
                    message: 'Invalid name.'
                });
            } else if (!stringvalidator.checkvalidpassword(req.body.password)) {
                res.status(400).json({
                    message_class: 'error',
                    message: 'Invalid password (must be greater than 7).'
                });
            } else if (!req.body.repeatpassword || req.body.repeatpassword !== req.body.password) {
                res.status(400).json({
                    message_class: 'error',
                    message: 'Invalid password validation.'
                });
            } else {
                database.register(req.body)
                    .then(function (result) {

                        res.status(200).json({
                            message_class: 'information',
                            message: 'Registration complete. Check your e-mail.'
                        });
                        email.sendConfirmTo(result.email, result._id);

                    })
                    .catch(function (result) {
                        res.status(400).json({
                            message_class: 'error',
                            message: 'E-mail already used.'
                        });
                    });
            }

        });

        server.get('/auth/validate/:id', function (req, res) {

            database.validate(req.params.id);
            res.redirect('/auth/login');

        });

    };

}());
