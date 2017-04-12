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
        $('.scrollBox').niceScroll({cursorcolor:"rgba(255, 255, 255, 0.3)"});
        /*_.each(scrollBoxes, function (scrollbox) {
        });*/
    }
}

function showNotifcation(type, msg) {
    var id = 'notification' + $('#notifications').children().length,
        notification = createNotification(type, msg, id),
        jqSelector = '#' + id;
    $('#notifications').append(notification);
    var el = $(jqSelector);
    el.fadeIn();
    var to = setTimeout(function () {
        el.fadeOut('slow', function () {
            el.remove();
        });
    }, 5000);
    el.on('click', function () {
        clearTimeout(to);
        el.fadeOut('slow', function () {
            el.remove();
        });
    })
}


function createNotification(type, msg, id) {
    var notifResult = '';
    switch (type) {
        case 'success':
            notifResult = '<div id="{{id}}" class="notif alert-success">{{msg}}<i class="fa fa-times pull-right"></i></div>';
            break;
        case 'error':
            notifResult = '<div id="{{id}}" class="notif alert-danger">{{msg}}<i class="fa fa-times pull-right"></i></div>';
            break;
        default:
            break;
    }

    if (notifResult) {
        notifResult = notifResult.replace('{{msg}}', msg).replace('{{id}}', id);
    }
    return notifResult;
}

function setCookie(name, value) {
    Cookies.set(name, value);
}

function getCookie(name) {
    Cookies.get(name);
}
