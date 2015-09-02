/*global require, module, console*/

(function () {

    'use strict';

    var fs = require('fs'),
        Promise = require('bluebird'),
        multiparty = require('multiparty'),
        jwt = require('../config/jsonwebtoken'),
        database = require('../config/database'),
        stringvalidator = require('../config/stringvalidator'),
        cookieValidator = require('../config/cookieValidator'),
        defaultRoute = function (req, res) {
            cookieValidator(req, res)
                .then(function (user) {
                    res.render('app/index');
                })
                .catch(function (err) {
                    res.redirect('/auth');
                });
        },
        getInitials = function (code) {

            return new Promise(function (resolve, reject) {

                var classes = require('../assets/mieic'),
                    year, semester, subject;

                for (year = 0; year < 5; year++) {
                    for (semester = 0; semester < 2; semester++) {
                        for (subject = 0; subject < classes[year][semester].length; subject++) {
                            if (classes[year][semester][subject].code === code) {
                                resolve(classes[year][semester][subject].initials);
                            }
                        }
                    }
                }
            });
        };

    module.exports = function (server) {

        server.get('/app', defaultRoute);

        server.get('/app/find', defaultRoute);

        server.get('/app/classes', defaultRoute);

        server.get('/app/students', defaultRoute);

        server.get('/app/settings', defaultRoute);
        
        server.get('/app/tutorial', defaultRoute);

        server.get('/app/load', function (req, res) {

            cookieValidator(req, res)
                .then(function (userid) {

                    database.getFullUser(userid)
                        .then(function (user) {
                            res.send(user);
                        })
                        .catch(function (result) {
                            res.status(400).json({
                                message_class: 'error',
                                message: 'Unknown error.'
                            });
                        });

                })
                .catch(function (err) {
                    res.status(400).json({
                        message_class: 'error',
                        message: 'Invalid cookie.'
                    });
                });
        });

        server.get('/app/loadClasses', function (req, res) {

            cookieValidator(req, res)
                .then(function (userid) {

                    var classes = require('../assets/mieic');
                    res.json(classes);

                })
                .catch(function (err) {
                    res.status(400).json({
                        message_class: 'error',
                        message: 'Invalid cookie.'
                    });
                });

        });

        server.post('/app/loadStudents', function (req, res) {


            cookieValidator(req, res)
                .then(function (userid) {

                    database.loadStudents(userid, req.body.code)
                        .then(function (students) {
                            if (students.length > 0) {
                                res.send(students);
                            } else {
                                res.status(404).json({
                                    message_class: 'error',
                                    message: 'This class has no students.'
                                });
                            }
                        })
                        .catch(function (err) {
                            res.status(400).json({
                                message_class: 'error',
                                message: 'Error loading students.'
                            });
                        });

                })
                .catch(function (err) {
                    res.status(400).json({
                        message_class: 'error',
                        message: 'Invalid cookie.'
                    });
                });

        });

        server.post('/app/enroll', function (req, res) {

            cookieValidator(req, res)
                .then(function (userid) {

                    if (stringvalidator.checkvalidinitials(req.body.initials)) {

                        database.dismiss(userid, req.body)
                            .then(function () {
                                database.enroll(userid, req.body)
                                    .then(function () {
                                        res.status(200).json({
                                            message_class: 'information',
                                            message: 'Enrollment complete.'
                                        });
                                    })
                                    .catch(function (err) {
                                        res.status(400).json({
                                            message_class: 'error',
                                            message: 'Enrollment failed.'
                                        });
                                    });
                            })
                            .catch(function (err) {
                                res.status(400).json({
                                    message_class: 'error',
                                    message: 'Enrollment failed.'
                                });
                            });

                    }

                })
                .catch(function (err) {
                    res.status(400).json({
                        message_class: 'error',
                        message: 'Invalid cookie.'
                    });
                });

        });

        server.post('/app/dismiss', function (req, res) {

            cookieValidator(req, res)
                .then(function (userid) {

                    database.dismiss(userid, req.body)
                        .then(function () {
                            res.status(200).json({
                                message_class: 'information',
                                message: 'Dismiss complete.'
                            });
                        })
                        .catch(function (err) {
                            res.status(400).json({
                                message_class: 'error',
                                message: 'Dismiss failed.'
                            });
                        });

                })
                .catch(function (err) {
                    res.status(400).json({
                        message_class: 'error',
                        message: 'Invalid cookie.'
                    });
                });

        });

        server.post('/app/updateProfile', function (req, res) {
            cookieValidator(req, res)
                .then(function (userid) {

                    if (userid !== req.body.id) {
                        res.status(400).json({
                            message_class: 'error',
                            message: 'Invalid ID.'
                        });
                    } else {

                        database.updateUser(req.body)
                            .then(function () {
                                res.status(200).json({
                                    message_class: 'information',
                                    message: 'Profile updated.'
                                });
                            })
                            .catch(function (err) {
                                res.status(400).json({
                                    message_class: 'error',
                                    message: err
                                });
                            });
                    }

                })
                .catch(function (err) {
                    res.status(400).json({
                        message_class: 'error',
                        message: 'Invalid cookie.'
                    });
                });
        });

        server.post('/app/updatePassword', function (req, res) {
            cookieValidator(req, res)
                .then(function (userid) {

                    if (!stringvalidator.checkvalidpassword(req.body.password)) {
                        database.updateUserPassword(userid, req.body)
                            .then(function () {
                                res.status(200).json({
                                    message_class: 'information',
                                    message: 'Password updated.'
                                });
                            })
                            .catch(function (err) {
                                res.status(400).json({
                                    message_class: 'error',
                                    message: 'Invalid password'
                                });
                            });
                    } else {
                        res.status(400).json({
                            message_class: 'error',
                            message: 'Invalid new password'
                        });
                    }

                })
                .catch(function (err) {
                    res.status(400).json({
                        message_class: 'error',
                        message: 'Invalid cookie.'
                    });
                });
        });

        server.post('/app/updatePicture', function (req, res) {

            cookieValidator(req, res)
                .then(function (userid) {

                    var form = new multiparty.Form();

                    form.parse(req, function (err, fields, files) {

                        var file = files.file[0];

                        fs.readFile(file.path, function (err, data) {
                            if (err) {

                                console.log('Error receiving image!');
                                console.log(err);

                                res.status(400).json({
                                    message_class: 'information',
                                    message: 'Error on upload.'
                                });

                            } else {

                                var random_time = new Date().getTime(),
                                    avatar_url = 'public/app/assets/img/profile/' + userid + '_' + random_time + '.jpg';

                                fs.writeFile(avatar_url, data, 'binary', function (err) {
                                    if (err) {

                                        console.log('Error writing:');
                                        console.log(err);

                                        res.status(400).json({
                                            message_class: 'information',
                                            message: 'Error on upload.'
                                        });
                                    } else {

                                        database.getFullUser(userid)
                                            .then(function (user) {
                                                if (user.avatar !== 'assets/img/profile/default.jpg') {
                                                    fs.unlink('public/app/' + user.avatar);
                                                }
                                            })
                                            .catch(function (result) {
                                                res.status(400).json({
                                                    message_class: 'error',
                                                    message: 'Unknown error.'
                                                });
                                            });

                                        avatar_url = 'assets/img/profile/' + userid + '_' + random_time + '.jpg';

                                        database.updatePicture(userid, avatar_url)
                                            .then(function () {
                                                res.status(200).json({
                                                    message_class: 'information',
                                                    message: 'Upload complete.',
                                                    avatar: avatar_url
                                                });
                                            })
                                            .catch(function (err) {
                                                res.status(400).json({
                                                    message_class: 'information',
                                                    message: 'Error on upload.'
                                                });
                                            });

                                    }
                                });
                            }
                        })

                    });

                })
                .catch(function (err) {
                    res.status(400).json({
                        message_class: 'error',
                        message: 'Invalid cookie.'
                    });
                });

        });

        server.post('/app/history', function (req, res) {

            cookieValidator(req, res)
                .then(function (userid) {

                    getInitials(req.body.code)
                        .then(function (initials) {
                            database.sendToHistory(userid, req.body, initials)
                                .then(function (historyid) {

                                    if (req.body.flag === true) {
                                        database.addLike(userid, req.body, initials, historyid)
                                            .then(function () {
                                                res.status(200).json({
                                                    message_class: 'information',
                                                    message: 'Student added to acceptances.'
                                                });
                                            });

                                    } else {
                                        res.status(200).json({
                                            message_class: 'information',
                                            message: 'Student added to acceptances.'
                                        });
                                    }
                                })
                                .catch(function (err) {
                                    res.status(400).json({
                                        message_class: 'error',
                                        message: 'Error adding student to acceptances.'
                                    });
                                });
                        });

                })
                .catch(function (err) {
                    res.status(400).json({
                        message_class: 'error',
                        message: 'Invalid cookie.'
                    });
                });

        });

        server.post('/app/removeHistory', function (req, res) {

            cookieValidator(req, res)
                .then(function (userid) {

                    database.removeFromHistory(userid, req.body._id)
                        .then(function () {

                            database.removeLike(userid, req.body.code, req.body.email)
                                .then(function () {
                                    res.status(200).json({
                                        message_class: 'information',
                                        message: 'Entry removed from history.'
                                    });
                                });


                        })
                        .catch(function (err) {
                            res.status(400).json({
                                message_class: 'error',
                                message: 'Error removing entry from history.'
                            });
                        });

                })
                .catch(function (err) {
                    res.status(400).json({
                        message_class: 'error',
                        message: 'Invalid cookie.'
                    });
                });

        });

    };

}());
