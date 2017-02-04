/**
 * Created by Jens on 11-Oct-16.
 */
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const masterValidator = require('validator');

const config = require('../config');

let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let validationConfig = config.validationConfig;

class UserHelper {

    constructor() {
    }

    getEmailValidators() {
        let validators = [
            {
                validator: this.isEmailValidator,
                msg: 'This is not a valid email address'
            }
        ];
        return validators;
    }

    //EMAIL VALIDATORS
    isEmailValidator(email) {
        return masterValidator.isEmail(email);
    }

    encryptPwd(password) {
        let pwdEnc = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        return pwdEnc;
    }

    generateRegKey(length) {
        let bytes = crypto.randomBytes(length);
        let result = new Array(length);
        for (let i = 0, j = length; i < j; i++)
            result[i] = chars[bytes[i] % chars.length];
        return result.join('');
    }

}
module.exports = UserHelper;