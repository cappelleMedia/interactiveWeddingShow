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

	getAllowed(limit, skip, callback) {
		this.model
			.find({'blocked': false})
			.skip(skip)
			.limit(limit)
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

	uploadPic(formData, callback) {
		let errors = '',
			form = new formidable.IncomingForm(),
			toSchema = {
				poster: '',
				url: '',
				description: '',
			},
			self = this;
		form.uploadDir = path.join(config.basepaths.root, 'client', config.basepaths.img);

		form.onPart = function (part) {
			if (part.name === 'photo') {
				if (part.mime === 'application/octet-stream' || !part.filename) {
					errors = 'File empty';

				}
				if (!part.filename.match(/\.(jpg|jpeg|png)$/i) || !part.mime.match('image.*')) {
					errors = 'Invalid file';
				}
				if (errors) {
					form.emit('error', new Error(errors));
					return;
				}
			}
			form.handlePart(part);
		};

		form.on('file', function (field, file) {
			if (file.size <= 0) {
				errors = 'File empty';
			}
			if (file.size > 10000000) {
				errors = 'File to large';
			}
			if (errors) {
				form.emit('error', new Error(errors));
				return;
			}
			var pre = '';
			if (fs.existsSync(form.uploadDir + "/" + file.name)) {
				pre = new Date().getTime();
			}
			var name = fs.rename(file.path, form.uploadDir + "/" + pre + file.name);
			toSchema.url = pre + file.name;
		});

		form.on('error', function (err) {
			callback(err, 500, err.message);
			return;
		});

		form.parse(formData, function (err, fields, files) {
			toSchema.poster = fields.uploader;
			toSchema.description = fields.description;
			// toSchema.posted = fields.date;
			self.addObj(toSchema, callback);
		});

	}
}
module.exports = PhotoController;