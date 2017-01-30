/**
 * Created by Jens on 29-Dec-16.
 */
const mongoose = require('mongoose');

const config = require('../config');

//MAIN
let UserSchema = new mongoose.Schema({
	__v: {
		type: Number
	},
	firstName: {
		type: String,
		required: true,
		index: true
	},
	lastName: {
		type: String,
		required: true,
		index: true
	},
	emailAddress: {
		type: String,
		required: true,
		index: true
	},
	password: {
		type: String
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	canPostPhoto: {
		type: Boolean,
		default: true
	},
	canPostGuestPost: {
		type: Boolean,
		default: true
	},
	timeoutUntil: {
		type: Date,
		default: null
	}
}, {autoIndex: config.mongo.autoIndex, id: false, read: 'secondaryPreferred'});

module.exports = mongoose.model('User', UserSchema);

module.exports.Schema = UserSchema;