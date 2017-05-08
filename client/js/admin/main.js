/**
 * Created by Jens on 06-Mar-17.
 */

//<editor-fold desc="globals">
var contentPaneIds = [];
//</editor-fold>

//<editor-fold desc="userManager">
function userManager() {
	return {
		init: function () {
			if (!authenticationHandler().hasUser()) {
				window.location = getBase('redirect') + 'admin'
			}
			createUSers(function () {
				$('#user-table').DataTable({
					dom: 'Bfrtip',
					fixedHeader: true,
					colReorder: true,
					responsive: true,
					columnDefs: [
						//0: id
						//1: firstname
						//2: lastname
						//3: email
						//4: accessflag
						{targets: [0], visible: false}
					],
					buttons: [
						{
							extend: 'pdf',
							exportOptions: {
								columns: ':visible'
							}
						},
						{
							extend: 'excel',
							exportOptions: {
								columns: ':visible'
							}
						}
					]
				});
			});
		}
	}
}
//</editor-fold>

//<editor-fold desc="photo booth manager">
function photoBootMgr() {
	return  {
		init: function() {
			console.log('photo boot manager');
		}
	}
}
//</editor-fold>

//<editor-fold desc="guest book manager">
function guestBookMgr() {
	return {
		init: function() {
			console.log('guestbook manager');
		}
	}
}
//</editor-fold>

//<editor-fold desc="admin navigation">
function adminNavigater() {
	return {
		handleReload: function () {
			var hashLocation = window.location.hash.split('#')[1];
			if (hashLocation && hashLocation !== '') {
				adminNavigater().switchContent(hashLocation);
			} else {
				adminNavigater().switchContent('user-mgr');
			}
		},
		contentIds: function () {
			if (!contentPaneIds.length) {
				var contentPanes = $('.content-pane');
				$.each(contentPanes, function (index, pane) {
					contentPaneIds.push(pane.id);
				});
			}
			return contentPaneIds;
		},
		switchContent: function (contentId) {
			this.closeContents();
			if (!authenticationHandler().hasUser()) {
				this.openContent('login-block');
			} else {
				this.openContent(contentId);
			}
		},
		closeContents: function () {
			var openPanes = $('.content-pane');
			$.each(openPanes, function (index, pane) {
				$(pane).fadeOut();
			})
		},
		openContent: function (contentId) {
			var menu = $('#admin-menu');
			if (contentId && contentId !== 'login-block' && this.contentIds().indexOf(contentId) > -1) {
				if (menu && menu.hasClass('init')) {
					menu.fadeIn();
				}
				$('#' + contentId).fadeIn();
				initContent(contentId);
			} else {
				if (menu) {
					menu.fadeOut();
				}
				$('#login-block').fadeIn();
			}
		}
	}
}
//</editor-fold>

//<editor-fold desc="authentication handling">
function authenticationHandler() {
	return {
		getJwt: function () {
			return getCookie('admin_token');
		},
		getAdmin: function () {
			return getCookie('curr_admin');
		},
		hasUser: function () {
			var jwt = this.getJwt();
			var admin = this.getAdmin();
			if (jwt && admin) {
				this.setAdmin(admin, jwt);
				return true;
			}
			return false;
		},
		setAdmin: function (email, response, navigate) {
			var expiring = 1 / 96;
			setCookie('admin_token', response, expiring);
			setCookie('curr_admin', email, expiring);
			if (navigate) {
				adminNavigater().handleReload();
			}
		}
	}
}
//</editor-fold>

//<editor-fold desc="functions">
function createUSers(cb) {
	var apiUrl = getBase('api') + 'users/',
		users = {},
		html = '';

	$.get(apiUrl, function (data) {
		if (data) {
			$.each(data, function (index, user) {
				var row =
					'<tr>' +

					'<td>' +
					user._id +
					'</td>' +
					'<td>' +
					user.firstName +
					'</td>' +
					'<td>' +
					user.lastName +
					'</td>' +
					'<td>' +
					user.email +
					'</td>' +
					'<td>' +
					user.accessFlag +
					'</td>' +

					'</tr>';
				html += row;
			});
			$('#user-table tbody').append(html);
			cb();
		}
	});
}

function setMenuListeners() {
	$('.admin-menu-item').on('click', function (e) {
		e.preventDefault();
		window.location.hash = this.dataset.target;
	});
	$(window).on('hashchange', function () {
		var hashLocation = 'user-mgr';
		if (window.location.hash) {
			hashLocation = window.location.hash.split('#')[1];
		}
		adminNavigater().switchContent(hashLocation);
	});
}

function initContent(contentId) {
	var contentPane = $('#' + contentId);
	switch (contentId) {
		case 'user-mgr':
			if(contentPane.hasClass('init')){
				userManager().init();
				contentPane.removeClass('init');
			}
	}
}
//</editor-fold>

//<editor-fold desc="INIT">
setMenuListeners();
adminNavigater().handleReload();
//</editor-fold>