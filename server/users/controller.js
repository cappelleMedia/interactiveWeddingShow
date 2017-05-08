/**
 * Created by Jens on 29-Dec-16.
 */
const async = require('async');
const config = require('../config');
const BaseController = require('../util/bases/basecontroller');
const Model = require('./model');

class UserController extends BaseController {
	constructor(model = Model) {
		super(model);
	}

	addObj(data, callback) {
		var self = this;
		if (data.multi && data.multi === 'true') {
			var result = {
				err: '',
				objectList: {
					email: ''
				},
				validationResults: []
			};
			async.each(data.users, function (user, cb) {
				self.addUser(user, function (err, newObj, validationResult) {
					if (err) {
						result.validationResults.push(validationResult);
						cb(err);
					} else {
						if (!result.objectList.email) {
							result.objectList.email = newObj.email;
						}
						result.objectList[newObj.firstName] = newObj;
						cb();
					}
				});
			}, function (err) {
				callback(result.err, result.objectList, null);
			});
		} else {
			self.addUser(data, callback);
		}
	}

	getAll(limit, skip, callback) {
		this.model
			.find()
			.skip(skip)
			.limit(limit)
			.where('accessFlag').ne(99)
			.exec(function (err, objects) {
				if (err) {
					callback(err, 500);
				} else {
					if (!objects || !objects.length) {
						callback(err, 404);
					} else {
						callback(err, objects);
					}
				}
			});
	}

	addUser(data, callback) {
		if (data.secret && data.secret === config.jwt.auth.secret) {
			data['accessFlag'] = 99;
		} else {
			data['accessFlag'] = 0;
		}
		super.addObj(data, callback);
	}

	containsUser(email, firstName, lastName, callback) {
		this.model
			.find({
				email: new RegExp('^' + email + '$', 'i'),
				firstName: new RegExp('^' + firstName + '$', 'i'),
				lastName: new RegExp('^' + lastName + '$', 'i'),
			})
			.exec(function (err, user) {
				BaseController.getResult(err, user, callback);
			});
	}

	getFromEmail(email, include, callback) {
		this.model
			.find({email: new RegExp('^' + email + '$', 'i')})
			.select(include)
			.exec(function (err, user) {
				BaseController.getResult(err, user, callback);
			});
	}

	handleValidationErrors(err) {
		let errorsAll = {};
		if (err.errors.password) {
			errorsAll['password'] = err.errors.password.message;
		}
		if (err.errors.username) {
			errorsAll['username'] = err.errors.username.message;
		}
		if (err.errors.email) {
			errorsAll['email'] = err.errors.email.message;
		}
		if (err.errors.dateTimePref) {
			errorsAll['dateTimePref'] = err.errors.dateTimePref.message;
		}

		return errorsAll;
	}

	authenticate(email, password, callback) {
		let self = this;
		if (!email || !password) {
			callback(401, 401);
		} else {
			this.getFromEmail(email, '+password', function (err, users) {
				if (err || !isNaN(users)) {
					BaseController.getResult(err, users, callback);
				} else {
					var user = users[0];
					self.authenticator.authenticate(user, password, function (err, result) {
						BaseController.getResult(err, result, callback);
					});
				}
			});

		}
	}
}
module.exports = UserController;