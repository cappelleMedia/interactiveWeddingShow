/**
 * Created by Jens on 29-Dec-16.
 */

const helper = require('../routerHelper');
const objectId = require('mongoose').Types.ObjectId;

module.exports = function (app, base, Controller){
    app.get(base + '/ping', function(req, res){
        res.json({pong: Date.now()});
    });
    //
    // app.get(base, function(req, res){
    //
    // });
};