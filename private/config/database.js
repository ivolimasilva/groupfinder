/*global require, exports, console, ObjectId*/

(function () {

    'use strict';

    var bcrypt = require('bcrypt-nodejs'),
        mongoose = require('mongoose'),
        Promise = require('bluebird'),
        secret = require('../assets/secrets.js'),
        database = {
            'uri': secret.database_uri
        },
        Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId,
        UserSchema = new Schema({
            email: {
                type: String,
                unique: true,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            password: {
                type: String,
                required: true
            },
            avatar: {
                type: String,
                default: 'assets/img/profile/default.jpg'
            },
            facebook: {
                type: String,
                required: false
            },
            github: {
                type: String,
                required: false
            },
            valid: {
                type: Boolean,
                default: false
            },
            classes: [
                {
                    initials: {
                        type: String,
                        required: true
                    },
                    code: {
                        type: String,
                        required: true
                    },
                    name: {
                        type: String,
                        required: true
                    },
                    about: {
                        type: String,
                        required: true
                    }
            }],
            history: [
                {
                    ref: {
                        type: ObjectId,
                        required: true
                    },
                    name: {
                        type: String,
                        required: true
                    },
                    email: {
                        type: String,
                        required: true
                    },
                    facebook: {
                        type: String,
                        required: true
                    },
                    github: {
                        type: String,
                        required: true
                    },
                    avatar: {
                        type: String,
                        required: true
                    },
                    about: {
                        type: String,
                        required: true
                    },
                    code: {
                        type: String,
                        required: true
                    },
                    initials: {
                        type: String,
                        required: true
                    },
                    flag: {
                        type: Boolean,
                        required: true
                    }
                }
            ],
            likes: [
                {
                    _id: {
                        type: ObjectId,
                        required: true
                    },
                    id: {
                        type: ObjectId,
                        required: true
                    },
                    name: {
                        type: String,
                        required: true
                    },
                    email: {
                        type: String,
                        required: true
                    },
                    facebook: {
                        type: String,
                        required: true
                    },
                    github: {
                        type: String,
                        required: true
                    },
                    avatar: {
                        type: String,
                        required: true
                    },
                    about: {
                        type: String,
                        required: true
                    },
                    code: {
                        type: String,
                        required: true
                    },
                    initials: {
                        type: String,
                        required: true
                    }
                }
            ]
        }, {
            collection: 'users'
        }),
        User = mongoose.model('User', UserSchema);

    mongoose.connect(database.uri);

    exports.login = function (user) {

        var password = user.password;

        bcrypt.hash(password, null, null, function (err, hash) {
            console.log(password);
            console.log(hash);
        });

        return new Promise(function (resolve, reject) {
            User.findOne({
                email: user.email
            }, function (err, user) {
                if (user) {
                    bcrypt.compare(password, user.password, function (err, res) {
                        if (res === true) {
                            if (user.valid) {
                                user = user.toObject();
                                resolve(user._id);
                            } else {
                                reject('Check your inbox (Webmail > \'Configurações pessoas\' > \'Pastas\' > Check \'spam\') and validate your account.');
                            }
                        } else {
                            reject('Incorrect password.');
                        }
                    });
                } else if (err) {
                    reject(err);
                }
            });
        });

    };

    exports.register = function (user) {

        return new Promise(function (resolve, reject) {

            bcrypt.hash(user.password, null, null, function (err, hash) {

                user.password = hash;

                User.create(user, function (err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });

        });

    };

    exports.validate = function (id) {
        User.update({
                _id: id
            }, {
                valid: true
            },
            function (err) {
                if (err) {
                    console.log(err);
                }
            });
    };

    exports.getUser = function (id) {

        return new Promise(function (resolve, reject) {
            User.findOne({
                _id: id
            }, function (err, user) {
                if (user) {
                    resolve(user._id);
                } else {
                    reject('No user found.');
                }
                if (err) {
                    reject(err);
                }
            });
        });
    };

    exports.dismiss = function (id, classToDismiss) {

        return new Promise(function (resolve, reject) {
            User.findByIdAndUpdate(id, {
                $pull: {
                    classes: {
                        code: classToDismiss.code
                    }
                }
            }, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        });

    };

    exports.enroll = function (id, classToEnroll) {

        return new Promise(function (resolve, reject) {
            User.findByIdAndUpdate(id, {
                $push: {
                    classes: {
                        initials: classToEnroll.initials,
                        code: classToEnroll.code,
                        name: classToEnroll.name,
                        about: classToEnroll.about
                    }
                }
            }, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

    };

    exports.getFullUser = function (userid) {

        return new Promise(function (resolve, reject) {
            User.findOne({
                _id: userid
            }, function (err, user) {
                if (err) {
                    reject(err);
                } else {

                    user = user.toObject();
                    delete user.password;
                    resolve(user);

                }
            });
        });

    };

    exports.updateUser = function (user) {

        return new Promise(function (resolve, reject) {
            User.findByIdAndUpdate(user.id, {
                name: user.name,
                facebook: user.facebook,
                github: user.github
            }, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

    };

    exports.updateUserPassword = function (userid, password) {

        return new Promise(function (resolve, reject) {

            User.findOne({
                _id: userid
            }, function (err, user) {
                if (user) {

                    bcrypt.compare(password.old, user.password, function (err, res) {

                        if (res === true) {

                            bcrypt.hash(password.new, null, null, function (err, hash) {

                                User.update({
                                        _id: userid
                                    }, {
                                        password: hash
                                    },
                                    function (err) {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve();
                                        }
                                    });
                            });

                        } else {
                            reject('Incorrect password.');
                        }

                    });
                } else {
                    reject('Invalid error.');
                }

                if (err) {
                    reject(err);
                }
            });
        });

    };

    exports.updatePicture = function (userid, picture) {

        return new Promise(function (resolve, reject) {
            User.findByIdAndUpdate(userid, {
                avatar: picture
            }, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

    };

    exports.loadStudents = function (userid, code) {

        return new Promise(function (resolve, reject) {
            User.find({
                _id: {
                    $ne: userid
                }
            }, function (err, users) {
                if (err) {
                    reject(err);
                } else {

                    var i, j, k = 0,
                        students = [];

                    for (i = 0; i < users.length; i++) {
                        for (j = 0; j < users[i].classes.length; j++) {
                            if (users[i].classes[j].code === code) {

                                students[k] = {};

                                students[k].id = users[i]._id;
                                students[k].name = users[i].name;
                                students[k].email = users[i].email;
                                students[k].facebook = users[i].facebook;
                                students[k].github = users[i].github;
                                students[k].avatar = users[i].avatar;
                                students[k].about = users[i].classes[j].about;

                                k++;

                            }
                        }
                    }

                    resolve(students);

                }
            });
        });

    }

    exports.sendToHistory = function (userid, student, initials) {

        return new Promise(function (resolve, reject) {
            User.findByIdAndUpdate(userid, {
                $push: {
                    history: {
                        id: student.id,
                        name: student.name,
                        email: student.email,
                        facebook: student.facebook,
                        github: student.github,
                        avatar: student.avatar,
                        about: student.about,
                        code: student.code,
                        flag: student.flag,
                        initials: initials
                    }
                }
            }, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

    };

    exports.removeFromHistory = function (userid, historyid) {

        return new Promise(function (resolve, reject) {
            User.findByIdAndUpdate(userid, {
                $pull: {
                    history: {
                        _id: historyid
                    }
                }
            }, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        });

    };

    exports.addLike = function (userid, likeObject, initials) {

        return new Promise(function (resolve, reject) {
            User.findByIdAndUpdate(likeObject.id, {
                $push: {
                    likes: {
                        id: userid,
                        name: likeObject.namelike,
                        email: likeObject.emaillike,
                        facebook: likeObject.facebooklike,
                        github: likeObject.githublike,
                        avatar: likeObject.avatarlike,
                        about: likeObject.aboutlike,
                        code: likeObject.code,
                        initials: initials
                    }
                }
            }, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

    };

    exports.removeLike = function (userid, code, email) {
        return new Promise(function (resolve, reject) {
            User.findOneAndUpdate({
                email: email
            }, {
                $pull: {
                    likes: {
                        code: code,
                        id: userid
                    }
                }
            }, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        });
    };

}());
