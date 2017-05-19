function showcase() {
	//<editor-fold desc="vars">
	var currImages = [],
		currGb = [],
		gallery = false,
		gbsAdded = false,
		intervalTiming = 60 * 10,
		refreshTO = null,
		blocked = [],
		blockedGB = [];
	//</editor-fold>

	//<editor-fold desc="mains">
	return {
		init: function () {
			getImages();
			getGbs();
		},
		createImage: function (image, height) {
			var baseImgUrl = 'assets/images/photobooth/',
				url = baseImgUrl + image.url,
				caption = image.description + ' - ' + image.poster,
				imgEl =
					'<div class="showcase-image-holder">' +
					'<img style="height: ' + height + 'px;" height="' + height + '" alt="photoshow" src="' + url + '"/>' +
					'<div class="img-caption">' + caption + '</div>' +
					'</div>';
			return imgEl;
		}
	};
	//</editor-fold>

	//<editor-fold desc="helpers">

	//<editor-fold desc="img">
	function getImages() {
		$('#image-loader').show();
		var apiUrl = getBase('api') + 'photos/allowed/:limit/:skip',
			skip = currImages.length || 0,
			limit = currImages.length ? 10 : 50,
			newImages = [],
			height = $('body').height(),
			heightFix = ((height / 2) + 200),
			self = showcase();

		$('#gb-slider').height(height - heightFix - 40);

		apiUrl = apiUrl.replace(':limit', limit);
		apiUrl = apiUrl.replace(':skip', skip);

		$.get(apiUrl, function (data) {
			if (data) {
				$.each(data, function (index, image) {
					var alreadyAdded = function () {
						var inMain = _.find(currImages, image);
						return inMain;
					};
					if (!alreadyAdded()) {
						var imgEl = self.createImage(image, heightFix);
						currImages.push(image);
						newImages.push(imgEl);
					}
				});
			}
		})
			.done(function () {
				if (gallery) {
					updateGallery(newImages);
				} else {
					initGallery(newImages);
				}
			})
			.always(function () {
				refreshTO = setTimeout(checkForNewImages, 5 * intervalTiming);
			});
	}

	function updateGallery(images) {
		_.each(images, function (img) {
			$('#image-slider').slick('slickAdd', img);
		});

	}

	function initGallery(images) {
		_.each(images, function (img) {
			$('#image-slider').append(img);
		});

		$('#image-slider').slick({
			infinite: true,
			speed: 800,
			fade: true,
			cssEase: 'linear',
			autoplay: true,
			autoplaySpeed: 2000,
		});
		gallery = true;

	}

	function checkForNewImages() {
		removeBlocked();
		var currentSlide = $('#image-slider').slick('slickCurrentSlide');
		if (currentSlide + 3 < currImages.length) {
			refreshTO = setTimeout(checkForNewgbs, 1 * intervalTiming);
		} else {
			getImages();
		}
	}

	function removeBlocked() {
		var apiUrl = getBase('api') + 'photos/notallowed/0/0';
		if (gallery) {
			$.get(apiUrl, function (data) {
				if (data) {
					$.each(data, function (index, image) {
						var alreadyRemoved = function () {
							var inBlocked = _.find(blocked, function (imb) {
									return imb._id == image._id
								}),
								inMain = _.find(currImages, function (imm) {
									return imm._id == image._id
								});
							if (inBlocked || !inMain) {
								return true
							}
							return false;
						};
						if (!alreadyRemoved()) {
							blocked.push(image);
							_.reject(currImages, function (img) {
								return img._id === image._id;
							});
							var img = $('#' + image._id);
							img.remove();
						}
					});
				}
			})
				.done(function () {
					updateGallery();
				})
		}
	}

	//</editor-fold>

	//<editor-fold desc="gb">
	function createGuestBookItem(gbItem) {
		var gbEl =
			'<div class="gb-post">' +
			'<div class="gb-msg">' + gbItem.message + '</div>' +
			'<div class="gb-name">' + gbItem.poster + '</div>' +
			'</div>';
		return gbEl;
	}

	function getGbs() {
		$('#gb-loader').show();
		var apiUrl = getBase('api') + 'gbps/allowed/:limit/:skip',
			skip = currGb.length || 0,
			limit = currGb.length ? 1 : 1,
			newGbs = [],
			html = '';

		apiUrl = apiUrl.replace(':limit', limit);
		apiUrl = apiUrl.replace(':skip', skip);

		$.get(apiUrl, function (data) {
			if (data) {
				$.each(data, function (index, gbpi) {
					var alreadyAdded = function () {
						return _.find(currGb, gbpi);
					};
					if (!alreadyAdded()) {
						var gbEl = createGuestBookItem(gbpi);
						currGb.push(gbpi);
						html += gbEl;
						newGbs.push(gbEl);
					}
				});
			}
		})
			.done(function () {
				if (gbsAdded) {
					updateGb(newGbs);
				} else {
					initGb(newGbs);
				}
			})
			.always(function () {
				refreshTO = setTimeout(checkForNewgbs, 5 * intervalTiming);
			});
	}


	function checkForNewgbs() {
		removeBlocked();
		var currentSlide = $('#gb-slider').slick('slickCurrentSlide');
		if (currentSlide + 3 < currGb.length) {
			refreshTO = setTimeout(checkForNewgbs, 1 * intervalTiming);
		} else {
			getGbs();
		}
	}

	function updateGb(gbs) {
		_.each(gbs, function (gb) {
			$('#gb-slider').slick('slickAdd', gb);
		});

	}

	function initGb(gbs) {
		_.each(gbs, function (img) {
			$('#gb-slider').append(img);
		});

		$('#gb-slider').slick({
			infinite: true,
			speed: 1000,
			fade: true,
			cssEase: 'linear',
			autoplay: true,
			autoplaySpeed: 2000,
			prevArrow: '',
			nextArrow: ''
		});
		gbsAdded = true;

	}

	//</editor-fold>


	//</editor-fold>
}