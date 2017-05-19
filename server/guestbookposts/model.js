/**
 * Created by Jens on 29-Dec-16.
 */
const mongoose = require('mongoose');
const uniqueValidation = require('mongoose-beautiful-unique-validation');

const config = require('../config');

//MAIN
let GuestBookPostSchema = new mongoose.Schema({
	__v: {
		type: Number
	},
	poster: {
		type: String,
		required: true,
		index: true
	},
	message: {
		type: String,
		required: true
	},
	posted: {
		type: Date,
		required: true,
		default: Date.now
	},
	blocked: {
		type: Boolean,
		default: false
	},
}, {autoIndex: config.mongo.autoIndex, id: false, read: 'secondaryPreferred'});

module.exports = mongoose.model('GuestBookPost', GuestBookPostSchema);

module.exports.Schema = GuestBookPostSchema;