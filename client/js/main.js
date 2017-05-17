//TODO keep last page in cookie (refresh purposes);
document.onload = mainInit();

function mainInit() {
    setScrollBars();
    setListeners();
}

function setListeners() {

}

function setScrollBars() {
    var w = window.innerWidth;
    if (w > 600) {
        var scrollBoxes = $('.scrollBox');
        $('.scrollBox').niceScroll({cursorcolor:"rgba(255, 255, 255, 0.3)", mousescrollstep: 100});
        /*_.each(scrollBoxes, function (scrollbox) {
        });*/
    }
}