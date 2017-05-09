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
				var exportOptions = {
					columns: [1, 2, 3]
				};
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
							exportOptions: exportOptions
						},
						{
							extend: 'excel',
							exportOptions: exportOptions
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
	return {
		init: function () {
			console.log('photo boot manager');
		}
	}
}
//</editor-fold>

//<editor-fold desc="guest book manager">
function guestBookMgr() {
	return {
		init: function () {
			console.log('guestbook manager');
		}
	}
}
//</editor-fold>

//<editor-fold desc="admin navigation">
function adminNavigater() {
	return {
		animationSpeed: '300',
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
			this.closeContents(function (self) {
				console.log('to');
				if (!authenticationHandler().hasUser()) {
					self.openContent('login-block');
				} else {
					self.openContent(contentId);
				}
			});
		},
		closeContents: function (cb) {
			var openPanes = $('.content-pane'),
				self = this;
			$.each(openPanes, function (index, pane) {
				$(pane).fadeOut(this.animationSpeed);
				var id = '#' + pane.id + '-menu';
				$(id).removeClass('active');
			});
			var to = setTimeout(function () {
				cb(self);
			}, 400);
		},
		openContent: function (contentId) {
			var menu = $('#admin-menu');
			if (contentId && contentId !== 'login-block' && this.contentIds().indexOf(contentId) > -1) {
				if (menu && menu.hasClass('init')) {
					menu.fadeIn(this.animationSpeed);
				}
				var id = '#' + contentId + '-menu';
				console.log($(id));
				$(id).addClass('active');
				$('#' + contentId).fadeIn(this.animationSpeed);
				initContent(contentId);
			} else {
				if (menu) {
					menu.fadeOut(this.animationSpeed);
				}
				$('#login-block').fadeIn(this.animationSpeed);
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
					'<span class="fa-stack fa-lg user-action" data-action-url="">' +
					'<i class="fa fa-square-o fa-stack-2x"></i>' +
					'<i class="fa fa-trash fa-stack-1x"></i>' +
					'</span>' +
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
			if (contentPane.hasClass('init')) {
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