//TODO keep last page in cookie (refresh purposes);
var setScrolls;


window.onload = function init() {
    setScrolls();
};

setScrolls = function () {
    var contentBoxes = $('.content-box');
    _.each(contentBoxes, function (box) {
       Ps.initialize(box);
    });
};