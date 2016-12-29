/**
 * Created by Jens on 26-Dec-16.
 */
const winston = require('winston');

const config = require('./config');
const ConnectionHandler = require('./util/connection-handler');

let connectionHandler = new ConnectionHandler;
let db;
let app;

run();

function run() {
    app = connectionHandler.expressSetup();
    require('./routes')(app);
    let server = app.listen(3000, function () {
        winston.info('S_M_WED runniung on port 3000');
    });
    db = connectionHandler.mongoSetup();
    if (process.env.NODE_ENV !== 'production') {
    }
}
