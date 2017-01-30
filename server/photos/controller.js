/**
 * Created by Jens on 29-Dec-16.
 */

const formidable = require('formidable');
const config = require('../config');
const path = require('path');
const BaseController = require('../util/bases/basecontroller');
const Model = require('./model');

class PhotoController extends BaseController{
    constructor(model = Model){
        super(model);
    }

    uploadPic(formData, callback){
        let errors = "";
        let form = new formidable.IncomingForm();
        form.uploadDir = path.join(__dirname,config.basepaths.img);
        form.on('file',function(field,file){

        });

        form.on('error', function(err){
            callback(err, 500, errors);
        });

        form.on('end',function(){
            callback(null,200,errors);
        });

        form.parse(formData);
    }
}
module.exports = PhotoController;