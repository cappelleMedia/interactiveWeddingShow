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
		if (data.secret && data.secret == config.jwt.auth.secret) {
			data['accessFlag'] = 99;
		} else {
			data['accessFlag'] = -999;
		}
		super.addObj(data, callback);
	}

	containsUser(email, firstName, lastName, callback) {
		//CHECK IF USER ALREADY REGISTERED
	}

	activate(data, callback) {
		let self = this;
		let errors = {};
		let status = 500;
		async.waterfall([
			function (next) {
				if (!data._id || !data.regKey) {
					errors['dev'] = 'Request was missing important information';
					status = 400;
					return next(status);
				} else {
					self.model
						.findById(data._id)
						.select('+regKey')
						.exec(function (err, obj) {
							next(err, obj);
						});
				}
			},
			function (user, next) {
				if (user.accessFlag > 0) {
					//Already activated
					status = 401;
					errors = null;
					return next(status);
				}
				if ((user.regKey !== data.regKey)) {
					//hide the error here
					status = 401;
					errors = null;
					return next(status);
				}
				user.accessFlag = 0;
				next(null, user);
			},
			function (updatedUser, done) {
				self.updateObj(updatedUser._id, updatedUser, function (err, user, validationErrors) {
					errors = validationErrors;
					status = user.toTokenData();
					done(err)
				});
			}

		], function (err) {
			callback(err, status, errors);
		});
	}

	getFromEmail(email, include,callback) {
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
			this.getFromEmail(email, '+password',function (err, users) {
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

	//FIXME THIS IS FOR TESTING ONLY, BEWARE
	// getAdminToken(callback) {
	// 	let self = this;
	// 	if (process.env.NODE_ENV !== 'production') {
	// 		this.getFromEmail('jens@itprosolutions.be', '',function (err, admins) {
	// 			if (err || !isNaN(admins)) {
	// 				BaseController.getResult(err, admins, callback);
	// 			} else {
	// 				var admin = admins[0];
	// 				self.authenticator.getAdminToken(admin, function (err, result) {
	// 					BaseController.getResult(err, result, callback);
	// 				});
	// 			}
	// 		});
	// 	} else {
	// 		return callback(null, 401);
	// 	}
	// }
}
module.exports = UserController;