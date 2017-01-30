/**
 * Created by Jens on 29-Dec-16.
 */

const BaseController = require('../util/bases/basecontroller');
const Model = require('./model');

class PhotoController extends BaseController{
    constructor(model = Model){
        super(model);
    }
}
module.exports = PhotoController;