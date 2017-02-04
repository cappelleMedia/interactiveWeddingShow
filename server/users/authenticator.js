/**
 * Created by Jens on 18-Nov-16.
 */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');

const Model = require('./model');
const config = require('../config');
const jwtConfig = config.jwt.auth;
class Authenticator {
	constructor() {
		//should never be called
	}

	//FIXME THIS IS FOR TESTING ONLY, BEWARE
	// static getAdminToken(admin, callback) {
	// 	console.log(admin.toTokenData());
	// 	if (process.env.NODE_ENV !== 'production') {
	// 		jwt.sign(admin.toTokenData(), jwtConfig.secret, {issuer: jwtConfig.issuer}, function (err, token) {
	// 			return callback(err, token);
	// 		});
	// 	} else {
	// 		return callback(null, 401);
	// 	}
	// }

	static authenticate(user, pwd, callback) {
		let pwdValid = bcrypt.compareSync(pwd,user.password);
		if (pwdValid && user.accessFlag == 99) {
			jwt.sign(user.toTokenData(), jwtConfig.secret, {issuer: jwtConfig.issuer}, function (err, token) {
				return callback(err, token);
			});
		} else {
			callback(401, 401);
		}
	}

	static verifyAdmin(token, callback) {
		jwt.verify(token, jwtConfig.secret, {issuer: jwtConfig.issuer}, function (err, data) {
			if (err || !data) {
				return callback(err, 401);
			} else {
				if (data.accessFlag > 990) {
					return callback(null, "verified");
				} else {
					return callback(err, 401);
				}
			}
		});
	}
}

module.exports = Authenticator;