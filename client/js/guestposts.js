function guestBook() {
	var guestBookInfoId = 'guestBookInfo',
		mainGPs = [],
		selfAdd = [],
		adding = false,
		depleted = false,
		spinnerTO,
		gps;
	return {
		init: function () {
			checkFirstTime();
			setGBListeners();
			loadGb();
		},
	};
	function createGuestBookItem(gbItem) {
		var gbEl =
				'<div class="gb-post">' +
				'<div class="gb-msg">'+ gbItem.message +'</div>' +
				'<div class="gb-name">'+ gbItem.poster +'</div>' +
				'</div>';
		return gbEl;
	}

	//<editor-fold desc="info">
	function checkFirstTime() {
		var visited = getCookie('guestBookVisit');
		if (!visited) {
			showGuestBookInfo();
		}
		setCookie('guestBookVisit', true);
	}

	function createGuestBookInfoPanel() {
		var content = new EJS({url: 'js/templates/guest-book-info.ejs'}).render();
		popups().createPopup('guestBookInfo', 'large', 'large', 'info', content);
	}

	function showGuestBookInfo() {
		var guestBookInfoPanel = $('#' + guestBookInfoId);
		if (!guestBookInfoPanel.length) {
			createGuestBookInfoPanel();
		} else {
			guestBookInfoPanel.fadeIn(defaultAnimationSpeedShort);
		}
	}

	//</editor-fold>

	//<editor-fold desc="listeners">
	function setGBListeners() {
		$('.upload-gb-trigger').on('click', function (e) {
			e.preventDefault();
			var content = new EJS({url: 'js/templates/gb-upload-form.ejs'}).render();
			popups().createPopup('gbUpload', 'medium', 'large', 'info', content, 'Uploaden', 'gb-send-form-trigger', 'true');
		});
		$('.gb-info-trigger').on('click', function (e) {
			e.preventDefault();
			showGuestBookInfo();
		});
		$('#popups').on('click', '.gb-send-form-trigger', function (e) {
			e.preventDefault();
			sendGbForm();
		});

		$('#guestbook').on('scroll', function (e) {
			var scroll = $(this).scrollTop();
			var height = $(this).height();
			if (height - scroll <= 450 && !adding && !depleted) {
				loadGb();
			}
		});
	}

	//</editor-fold>

	//<editor-fold desc="form">
	function setSpinnerTO() {
		spinnerTO = setTimeout(function () {
			toggleUploadLoading(false);
		}, 3000);
	}

	function setUploadError(msg) {
		$('#gb-form-errors #gb-form-main-error').html(msg);
		$('#gb-form-errors').show();
	}

	function sendGbForm() {
		var valid1 = validateForm('gbUpload');
		if (valid1) {
			$('#loading').fadeIn();
			var uploader = $('#naam').val(),
				msg = $('#boodschap').val(),
				data = new FormData(),
				url = getBase('api') + 'gbps';

			$.post(url, {poster: uploader, message: msg})
				.done(function (data) {
					$('#gbUpload .close-btn').click();
					showNotifcation('success', 'Post gelukt!');
					addGp(data);
				})
				.fail(function (e) {
					showNotifcation('error', 'Er ging iets mis bij het posten :(');
				})
				.always(function () {
					$('#loading').fadeOut();
				});
		}
	}

	//</editor-fold>

	//<editor-fold desc="gbps">
	function loadGb() {
			adding = true;
		$('#gb-loader').show();
		var apiUrl = getBase('api') + 'gbps/allowed/:limit/:skip',
			skip = mainGPs.length || 0,
			limit = $(window).height() > 600 ? 10 : 50,
			html = '',
			self = guestBook();

		apiUrl = apiUrl.replace(':limit', limit);
		apiUrl = apiUrl.replace(':skip', skip);

		$.get(apiUrl, function (data) {
			if (data) {
				$.each(data, function (index, gbpi) {
					var alreadyAdded = function () {
						var inMain = _.find(mainGPs, gbpi),
							inSelf = _.find(selfAdd, gbpi);
						return inMain || inSelf;
					};
					if (!alreadyAdded()) {
						var gbEl = createGuestBookItem(gbpi);
						mainGPs.push(gbpi);
						html += gbEl;
					}
				});
				$('#gb-posts').append(html);
			}
		})
			.done(function () {
			})
			.fail(function() {
				depleted = true;
				$('#gb-depleted').show();
			})
			.always(function () {
				$('#gb-loader').hide();
				adding = false;
			});
	}

	function addGp(gbpi) {
		if (gbpi) {
			var gbItem = createGuestBookItem(gbpi);
			$('#gb-posts').append(gbItem);
			selfAdd.push(gbpi);
		}
	}

	//</editor-fold>

}