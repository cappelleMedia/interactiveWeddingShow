/**
 * Created by Jens on 29-Dec-16.
 */
const winston = require('winston');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const config = require('../config');

class ConnectionHandler {
    constructor() {

    }

    mongoSetup() {
        let db;
        mongoose.Promise = global.Promise;
        mongoose.connect(config.mongo.uri, config.mongo.options);
        db = mongoose.connection;
        db.on('error', function () {
            winston.error('connection to mongodb failed');
        });
        db.once('open', function () {
            winston.info('Connected to mongodb on ' + config.mongo.uri + '!');
        });
        return db;
    }

    expressSetup() {
        let app = express();
        let http = require('http').Server(app);

        app.use(cors({
            exposedHeaders: config.cors.exposedHeaders, origin: config.cors.origins.map(function (origin) {
                return new RegExp(origin);
            })
        }));

        app.use(express.static(path.join(__dirname, '../client')));

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        return app;
    }
}

module.exports = ConnectionHandler;