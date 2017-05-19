/**
 * Created by Jens on 29-Dec-16.
 */

const BaseController = require('../util/bases/basecontroller');
const Model = require('./model');

class PhotoController extends BaseController{
    constructor(model = Model){
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
}
module.exports = PhotoController;