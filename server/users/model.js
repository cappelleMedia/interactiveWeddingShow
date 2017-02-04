/**
 * Created by Jens on 29-Dec-16.
 */
const mongoose = require('mongoose');

const config = require('../config');
const UserHelp = require('./userhelper');

let userHelp = new UserHelp();

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
	email: {
		type: String,
		required: true,
		index: true,
		validate: userHelp.getEmailValidators()
	},
	password: {
		type: String,
		select: false,
		default: userHelp.generateRegKey(64)
	},
	regKey: {
		type: String,
		required: true,
		select: false,
		min: 64,
		max: 64,
		default: userHelp.generateRegKey(64)
	},
	accessFlag: {
		type: Number,
		required: true,
		default: -999
	}
}, {autoIndex: config.mongo.autoIndex, id: false, read: 'secondaryPreferred'});

/*
	ACCESSFLAG:
	-999 = not confirmed
	-3 = timedout
	-2 = can't post guestpost
	-1 = can't post photo
	0 = regular user
	99 = admin
 */

//METHODS
UserSchema.methods.toTokenData = function () {
	var tokenData = {
		_id: this._id,
		firstName: this.firstName,
		lastName: this.lastName,
		email: this.email,
		accessFlag: this.accessFlag
	};
	return tokenData;
};

//HOOKS
UserSchema.post('validate', function () {
	if (this.isModified('password')) {
		this.password = userHelp.encryptPwd(this.password);
	}
	this.regKey = userHelp.generateRegKey(64);
});

module.exports = mongoose.model('User', UserSchema);

module.exports.Schema = UserSchema;