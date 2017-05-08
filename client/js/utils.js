/**
 * Created by Jens on 27-Apr-17.
 */

//<editor-fold desc="Globals">


function getHost(type) {
    var host = document.location.host;
    if (type && type === 'api' && host.indexOf('localhost') > -1) {
        host = 'localhost:3000';
    }
    return host;
}

function getBase(type) {
    var base = 'http://' + getHost(type),
        localUrl = function () {
            if (base.indexOf('localhost') > -1) {
                return '/interactiveWeddingShow/client/'
            }
            return '';
        };

    switch (type) {
        case 'api':
            return base + '/api/v1/';
        case 'redirect':
            return base + localUrl();
    }
}
//</editor-fold>

//<editor-fold desc="notifications">
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
//</editor-fold>

//<editor-fold desc="Cookies">
function setCookie(name, value, expiring) {
    var expireTime = expiring ? expiring : 365;
    Cookies.set(name, value, {expires: expireTime});
}

function getCookie(name) {
    return Cookies.get(name);
}
//</editor-fold>

