/**
 * Created by Jens on 29-Dec-16.
 */
const async = require('async');

const BaseController = require('../util/bases/basecontroller');
const Model = require('./model');
const config = require('../config/index');

class PhotoController extends BaseController{
    constructor(model = Model){
        super(model);
    }
}
module.exports = PhotoController;