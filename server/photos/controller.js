/**
 * Created by Jens on 29-Dec-16.
 */

const formidable = require('formidable');
const config = require('../config');
const path = require('path');
const fs = require('fs');
const BaseController = require('../util/bases/basecontroller');
const Model = require('./model');
const _ = require('lodash');

class PhotoController extends BaseController {
	constructor(model = Model) {
		super(model);
	}

	uploadPic(formData, callback) {
		let errors = '';
		let form = new formidable.IncomingForm();
		let self = this;
		form.uploadDir = path.join(config.basepaths.root, 'client', config.basepaths.img);

		form.onPart = function (part) {
			if (part.name === 'file') {
				if (part.mime === 'application/octet-stream') {
					errors = 'File was empty';
					form.emit('error', new Error(errors));
					return;
				}
			}
			form.handlePart(part);
		};

		form.on('file', function (field, file) {
			if (file.size >= 0) {
				fs.rename(file.path, form.uploadDir + "/" + file.name);
			}
		});

		form.on('error', function (err) {
			callback(err, 500, err.message);
			return;
		});

		form.on('end', function () {
			if (!errors) {
				callback(null, 200, errors);
			}
		});

		form.parse(formData, function (err, fields, files) {
			console.log(files.file);
			_.each(fields, function(field){
				console.log(field);
			});
		});

	}
}
module.exports = PhotoController;