/**
 * Created by Jens on 29-Dec-16.
 */
const Controller = require('./controller');

module.exports = function (app, base){
    let controller = new Controller();
    //BASE ROUTE OVERRIDES AND ADD-ONS

    //BASE ROUTES
    require('../util/bases/baserouter')(app, base, controller);
};