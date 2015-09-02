/*global require, console*/

(function () {

    'use strict';

    var express = require('express'),
        server = express(),
        path = require('path'),
        morgan = require('morgan'),
        bodyParser = require('body-parser'),
        cookieParser = require('cookie-parser'),
        routes = {},
        cookieValidator = require('./config/cookieValidator'),
        email = require('./config/email');

    /* ▼ CONFIG ▼ */

    server.use(express.static(path.resolve(__dirname, '../public/')));
    server.set('views', path.resolve(__dirname, '../public/'));
    server.set('view engine', 'ejs');
    server.use(cookieParser());
    server.use(bodyParser.urlencoded({
        extended: false
    }));
    server.use(bodyParser.json());
    server.use(morgan('dev'));

    email.connectServer();

    /* ▲ CONFIG ▲ */
    /* ▼ ROUTING ▼ */

    server.get('/', function (req, res) {
        cookieValidator(req, res)
            .then(function (user) {
                res.render('index', {
                    button_label: 'Enter App',
                    button_href: '/app'
                });
            })
            .catch(function (err) {
                res.render('index', {
                    button_label: 'Register / Login',
                    button_href: '/auth'
                });
            });
    });

    require('./routes/appRouter')(server);
    require('./routes/authRouter')(server);

    /* ▲ ROUTING ▲ */

    server.listen(8080);
    console.log('Express listening on port 8080');

}());
