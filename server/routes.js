/**
 * Created by Jens on 29-Dec-16.
 */
module.exports = function (app) {
    //api routes
    let base = '/api/v1/';
    require('./photos/routes')(app, base + 'photos');
    require('./guestbookposts/routes')(app, base + 'gbps');
};