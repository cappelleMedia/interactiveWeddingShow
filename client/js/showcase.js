function showcase() {
	//<editor-fold desc="vars">
	var currImages = [],
		gallery = false,
		intervalTiming = 60 * 1000,
		refreshTO = null;
	//</editor-fold>

	//<editor-fold desc="mains">
	return {
		init: function () {
			getImages();
		},
		createImage: function (image, height) {
			var baseImgUrl = 'assets/images/photobooth/',
				url = baseImgUrl + image.url,
				caption = image.description + ' - ' + image.poster,
				imgEl =
					'<div class="showcase-image-holder">' +
					'<img style="height: '+ height +'px;" height="' + height + '" alt="photoshow" src="' + url + '"/>' +
					'<div class="img-caption">'+ caption+ '</div>' +
			'</div>';
			return imgEl;
		}
	};
	//</editor-fold>

	//<editor-fold desc="helpers">

	function getImages() {
		$('#image-loader').show();
		var apiUrl = getBase('api') + 'photos/allowed/:limit/:skip',
			skip = currImages.length || 0,
			limit = currImages.length ? 1 : 5,
			newImages = [],
			height = $('body').height(),
			heightFix = ((height/2) - 40),
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
						var imgEl = self.createImage(image,heightFix);
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
				refreshTO = setTimeout(checkForNewImages, 5 * intervalTiming);
			});
	}

	function updateGallery(images) {
		_.each(images, function(img) {
			$('#image-slider').slick('slickAdd', img);
		});

	}

	function initGallery(images) {
		_.each(images, function(img){
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
		var currentSlide = $('#image-slider').slick('slickCurrentSlide');
		if(currentSlide + 3 < currImages) {
			refreshTO = setTimeout(checkForNewImages, 1 * intervalTiming);
		} else {
			console.log('images added');
			getImages();
		}
	}

	//</editor-fold>
}