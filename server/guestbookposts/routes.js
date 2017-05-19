/**
 * Created by Jens on 29-Dec-16.
 */
const Controller = require('./controller');
const helper = require('../util/routerHelper');

module.exports = function (app, base) {
	let controller = new Controller();
	//BASE ROUTE OVERRIDES AND ADD-ONS
	app.get(base + '/allowed', function (req, res) {
		controller.getAllowed(0, 0, function (err, response, errors) {
			helper.respond(err, response, res, errors);
		});
	});

	app.get(base + '/allowed/:limit/:skip?', function (req, res) {
		controller.getAllowed(parseInt(req.params.limit), parseInt(req.params.skip), function (err, response, errors) {
			helper.respond(err, response, res, errors);
		});
	});

	app.get(base + '/notAllowed/:limit/:skip?', function (req, res) {
		controller.getNotAllowed(parseInt(req.params.limit), parseInt(req.params.skip), function (err, response, errors) {
			helper.respond(err, response, res, errors);
		});
	});

	//BASE ROUTES
	require('../util/bases/baserouter')(app, base, controller);
};