/**
 * Created by Jens on 27-Apr-17.
 */

//<editor-fold desc="Globals">
var defaultAnimationSpeedShort = 300,
	defaultAnimationSpeedMedium = 500,
	defaultAnimationSpeedLong = 800;


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

//<editor-fold desc="confirmation panel">
function showConfirmPanel(heading, msg, confirm, adtionUrl, cancel, time) {
	if (heading && msg && confirm && actionUrl) {
		var cofirmPanel = $('#confirm-panel');

	}
}
//</editor-fold>

//<editor-fold desc="popup">
function popups() {
	return {
		createPopup: function (id, w, h, type, content, confirmBtn, triggerClass, destroyOnClose, cancelBtn, autoCloseTime) {
			setPopupListeners();
			var dimensionsClasses = getDimensions(w, h);
			var popup = new EJS({url: 'js/templates/popup.ejs'}).render({
				id: id,
				dimensionsClass: dimensionsClasses,
				type: type,
				content: content,
				destroyOnClose: destroyOnClose ? 'destroy' : '',
				confirmBtn: confirmBtn,
				triggerClass: triggerClass,
				cancelBtn: cancelBtn,
				autoCloseTime: autoCloseTime
			});
			$('#popups').append(popup).fadeIn();
			$('#' + id).fadeIn(defaultAnimationSpeedShort);
		}
	};

	function getDimensions(w, h) {
		var widthClass = function () {
			switch (w) {
				case 'large':
					return 'col-sm-11';
				case 'medium':
					return 'col-sm-8';
				case 'small':
					return 'col-sm-6';
				default:
					return w;
			}
		}, heightClass = function () {
			switch (h) {
				case 'large':
					return 'h-90';
				case 'medium':
					return 'h-60';
				case 'small':
					return 'h-50';
				default:
					return h;
			}
		};
		return widthClass() + ' col-xs-11 ' + heightClass();
	}

	function setPopupListeners() {
		$('#popups').on('click', '.close-btn', function (e) {
			$(this.parentElement).fadeOut()
			if($(this).hasClass('destroy')){
				$(this).parent().remove();
			}
		})
	}
}
//</editor-fold>

