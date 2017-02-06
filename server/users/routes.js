/**
 * Created by Jens on 29-Dec-16.
 */
const Controller = require('./controller');
const helper = require('../util/routerHelper');

module.exports = function (app, base) {
	let controller = new Controller();
	//BASE ROUTE OVERRIDES AND ADD-ONS

	app.get(base + '/full/:firstName/:lastName/:email', function (req, res) {
		controller.containsUser(req.params.email, req.params.firstName, req.params.lastName, function (err, response) {
			helper.respond(err, response, res);
		});
	});
	app.get(base + '/email/:email', function (req, res) {
		controller.getFromEmail(req.params.email, '',function (err, response) {
			helper.respond(err, response, res);
		});
	});
	app.post(base + '/authenticate', function (req, res) {
		controller.authenticate(req.body.email, req.body.password, function (err, response) {
			helper.respond(err, response, res);
		});
	});

	//BASE ROUTES
	require('../util/bases/baserouter')(app, base, controller);
};