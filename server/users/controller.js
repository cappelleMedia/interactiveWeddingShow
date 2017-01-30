/**
 * Created by Jens on 29-Dec-16.
 */
const config = require('../config');
const path = require('path');
const BaseController = require('../util/bases/basecontroller');
const Model = require('./model');

class UserController extends BaseController{
    constructor(model = Model){
        super(model);
    }

    register(email, firstname, lastname) {

    }

    auth(email) {
        //check email is registered -> create cookie
    }

    adminAuth(email, pwd) {
        //return jwt -> for cookie
    }

    /*
        authentication -> name + last name -> cookie
     */
}
module.exports = UserController;