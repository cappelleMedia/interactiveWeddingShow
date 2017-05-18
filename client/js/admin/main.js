/**
 * Created by Jens on 06-Mar-17.
 */

//<editor-fold desc="globals">
var contentPaneIds = [];
var mainImages = [];
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
						columns: [0, 1, 2]
					},
					title = 'Trouw Derutter-Brant';
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
						{}
					],
					buttons: [
						{
							extend: 'pdf',
							exportOptions: exportOptions,
							title: title
						},
						{
							extend: 'excel',
							exportOptions: exportOptions,
							title: title
						}
					]
				});
			});
		}
	}
	function createUSers(cb) {
		var apiUrl = getBase('api') + 'users/',
			html = '';

		$.get(apiUrl, function (data) {
			if (data) {
				$.each(data, function (index, user) {
					var banHidden = '',
						unbanHidden = '';
					if (user.accessFlag >= 0) {
						unbanHidden = 'toShow';
					} else {
						banHidden = 'toShow';
					}

					var row =
						'<tr>' +

						'<td>' +
						user.firstName +
						'</td>' +
						'<td>' +
						user.lastName +
						'</td>' +
						'<td>' +
						user.email +
						'</td>' +
						'<td data-id="user._id">' +

						'<span class="fa-stack fa-lg admin-action-btn ' + banHidden + '" + data-admin-action="ban-user">' +
						'<i class="fa fa-square-o fa-stack-2x text-danger"></i>' +
						'<i class="fa fa-ban fa-stack-1x text-danger"></i>' +
						'</span>' +

						'<span class="fa-stack fa-lg admin-action-btn ' + unbanHidden + '" +  data-admin-action="unban-user">' +
						'<i class="fa fa-square-o fa-stack-2x text-success"></i>' +
						'<i class="fa fa-play fa-stack-1x text-success"></i>' +
						'</span>' +

						'</td>' +

						'</tr>';
					html += row;
				});
				$('#user-table tbody').append(html);
				cb();
			}
		});
	}
}
//</editor-fold>

//<editor-fold desc="photo booth manager">
function photoBoothMgr() {
	var apiUrl = getBase('api') + 'photos/';
	return {
		init: function () {
			this.createPicTable(function () {
				$('#img-table').DataTable({
					fixedHeader: true,
					colReorder: true,
					responsive: true,
				});
			});
		},
		createPicTable: function (cb) {
			var baseImgUrl = 'assets/images/photobooth/',
				html = '';

			$.get(apiUrl, function (data) {
				if (data) {
					mainImages = data;
					$.each(data, function (index, image) {
						var url = baseImgUrl + image.url,
							caption = image.description + ' - ' + image.poster;

						var banHidden = '',
							unbanHidden = '';
						if (!image.blocked) {
							unbanHidden = 'toShow';
						} else {
							banHidden = 'toShow';
						}

						var imgEl = '<img alt="' + caption + '" class="tb-img" src="' + url + '"/>';


						var row =
							'<tr data>' +

							'<td>' +
							imgEl +
							'</td>' +
							'<td>' +
							image.poster +
							'</td>' +
							'<td>' +
							image.posted +
							'</td>' +
							'<td>' +

							'<span class="fa-stack fa-lg admin-action-btn ' + banHidden + '" + data-admin-action="block_image" data-id="' + image._id + '">' +
							'<i class="fa fa-square-o fa-stack-2x text-danger"></i>' +
							'<i class="fa fa-ban fa-stack-1x text-danger"></i>' +
							'</span>' +

							'<span class="fa-stack fa-lg admin-action-btn ' + unbanHidden + '" +  data-admin-action="unblock_image" data-id="' + image._id + '">' +
							'<i class="fa fa-square-o fa-stack-2x text-success"></i>' +
							'<i class="fa fa-play fa-stack-1x text-success"></i>' +
							'</span>' +

							'</td>' +

							'</tr>';
						html += row;
					});
				}
			})
				.done(function () {
					$('#img-table tbody').append(html);
					cb();
				});
		},
		updateImage: function (id, block, toShow, toHide) {
			var item = _.find(mainImages, {'_id': id});
			item.blocked = block;
			$.ajax({
				method: 'PUT',
				url: apiUrl + id,
				data: JSON.stringify(item),
				contentType: "application/json; charset=utf-8"
			})
				.done(function () {
					$(toShow).removeClass('toShow');
					$(toHide).addClass('toShow');
					showNotifcation('success', 'Image successfully updated');
				})
				.fail(function (e) {
					showNotifcation('error', 'Could not update image');

				});
			//FIXME ajax call here
		}
	};
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
				if (!authenticationHandler().hasUser()) {
					self.openContent('login-block');
				} else {
					self.openContent(contentId);
				}
			});
		},
		closeContents: function (cb) {
			var openPanes = $('.content-pane'),
				self = this,
				headerText = $('#admin-header-text');
			headerText.fadeOut(this.animationSpeed);
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
			var menu = $('#admin-menu'),
				header = $('#admin-header'),
				headerText = $('#admin-header-text');
			if (contentId && contentId !== 'login-block' && this.contentIds().indexOf(contentId) > -1) {
				var title = function () {
					switch (contentId) {
						case 'user-mgr':
							return 'User manager';
						case 'img-mgr':
							return 'Photo booth manager';
						case 'gb-mgr':
							return 'Guest book manager';
						default:
							return '';
					}
				};
				headerText.html(title);
				headerText.fadeIn(this.animationSpeed);

				if (menu && menu.hasClass('init')) {
					menu.fadeIn(this.animationSpeed);
					header.fadeIn(this.animationSpeed);
				}
				var id = '#' + contentId + '-menu';
				if (!$(id).hasClass('active')) {
					$(id).addClass('active');
					$('#' + contentId).fadeIn(this.animationSpeed);
					initContent(contentId);
				}
			} else {
				if (menu) {
					menu.fadeOut(this.animationSpeed);
				}
				header.fadeOut(this.animationSpeed);
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

function setAdminListeners() {
	setMenuListeners();

	$('#user-table').on('click', '.admin-action-btn', function () {
		alert('TODO ADD HANDLER');
	})

	$('#img-table').on('click', '.admin-action-btn', function () {
		var action = this.dataset.adminAction,
			id = $(this).data('id'),
			block = false,
			elToShow = '';
		switch (action) {
			case 'block_image':
				block = true;
				elToShow = $(this).parent().find('[data-admin-action="unblock_image"]');
				break;
			case 'unblock_image':
				elToShow = $(this).parent().find('[data-admin-action="block_image"]');
		}
		photoBoothMgr().updateImage(id, block, elToShow, $(this));
	})
}

function initContent(contentId) {

	var contentPane = $('#' + contentId),
		initiated = !contentPane.hasClass('init');
	switch (contentId) {
		case 'user-mgr':
			if (!initiated) {
				userManager().init();
			}
			break;
		case 'img-mgr':
			if (!initiated) {
				photoBoothMgr().init();
			}
			break;
	}
	contentPane.removeClass('init');
}
//</editor-fold>

//<editor-fold desc="INIT">
setAdminListeners();
adminNavigater().handleReload();
//</editor-fold>