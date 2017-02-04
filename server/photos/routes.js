/**
 * Created by Jens on 29-Dec-16.
 */
const Controller = require('./controller');
const helper = require('../util/routerHelper');

module.exports = function (app, base) {
	let controller = new Controller();
	// BASE ROUTE OVERRIDES AND ADD-ONS
	app.post(base, function (req, res) {
		if (req.headers['content-type'].indexOf('multipart/form-data') !== 0) {
			helper.respond('Not a multipart form', 500, res, 'Not a multipart form');
		} else {
			controller.uploadPic(req, function (err, response, validationResult) {
				helper.respond(err, response, res, validationResult);
			});
		}
	});
	//BASE ROUTES
	require('../util/bases/baserouter')(app, base, controller);
};