/**
 * Created by Jens on 29-Dec-16.
 */
const mongoose = require('mongoose');

const config = require('../config');

//MAIN
let PhotoSchema = new mongoose.Schema({
    __v: {
        type: Number
    },
    poster: {
        type: String,
        required: true,
        index: true
    },
    url: {
       type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    posted: {
        type: Date,
        required: true,
        default: Date.now()
    },
}, {autoIndex: config.mongo.autoIndex, id: false, read: 'secondaryPreferred'});

module.exports = mongoose.model('Photo', PhotoSchema);

module.exports.Schema = PhotoSchema;