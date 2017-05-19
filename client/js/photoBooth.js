function photoBooth() {
	var photoBoothInfoId = 'photoBoothInfo',
		validFiles = [],
		mainImages = [],
		selfAdd = [],
		blocked = [],
		adding = false,
		depleted = false,
		spinnerTO,
		gallery;
	return {
		init: function () {
			checkFirstTime();
			setListeners();
			loadPics();
		},
		createImage: function (image) {
			var baseImgUrl = 'assets/images/photobooth/',
				url = baseImgUrl + image.url,
				caption = image.description + ' - ' + image.poster,
				imgEl =
					'<a href="' + url + '" id="' + image._id + '">' +
					'<img alt="' + caption + '" src="' + url + '"/>' +
					'</a>';
			return imgEl;
		}
	};

	//<editor-fold desc="info">
	function checkFirstTime() {
		var visited = getCookie('photoBoothVisit');
		if (!visited) {
			showPhotoBoothInfo();
		}
		setCookie('photoBoothVisit', true);
	}

	function createPhotoBoothInfoPanel() {
		var content = new EJS({url: 'js/templates/photo-booth-info.ejs'}).render();
		popups().createPopup('photoBoothInfo', 'large', 'large', 'info', content);
	}

	function showPhotoBoothInfo() {
		var photoBoothInfoPanel = $('#' + photoBoothInfoId);
		if (!photoBoothInfoPanel.length) {
			createPhotoBoothInfoPanel();
		} else {
			photoBoothInfoPanel.fadeIn(defaultAnimationSpeedShort);
		}
	}

	//</editor-fold>

	//<editor-fold desc="listeners">

	function setListeners() {
		$('.upload-picture-trigger').on('click', function (e) {
			e.preventDefault();
			var content = new EJS({url: 'js/templates/pb-upload-form.ejs'}).render();
			popups().createPopup('photoBoothUpload', 'medium', 'large', 'info', content, 'Uploaden', 'pb-send-form-trigger', 'true');
		});
		$('.photo-boot-info-trigger').on('click', function (e) {
			e.preventDefault();
			showPhotoBoothInfo();
		});
		$('#popups').on('click', '.file-trigger', function (e) {
			e.preventDefault();
			document.body.onfocus = function () {
				setSpinnerTO();
				document.body.onfocus = null;
			};
			toggleUploadLoading(true);
			$('#pb-upload-file').click();
		});
		$('#popups').on('click', '.pb-send-form-trigger', function (e) {
			e.preventDefault();
			sendForm();
		});
		$('#popups').on('change', '#pb-upload-file', function (e) {
			e.preventDefault();
			$('#photo-form-errors').hide();
			var tmpPath = '';
			validFiles = [];
			$('#pb-upload-preview img').attr('src', '');
			if (e.target.files.length) {
				_.each(e.target.files, function (file) {
					if (!file.type.match('image.*')) {
						toggleUploadLoading(false);
						setUploadError('Je mag enkel foto\'s uploaden');
						return false;
					}
					if (file.size > 10000000) {
						setUploadError('Jou foto is te groot :(');
					} else {
						validFiles.push(file);
					}
				});
				if (validFiles && validFiles.length) {
					tmpPath = URL.createObjectURL(e.target.files[0]);
					$('#pb-upload-preview img').attr('src', tmpPath);
				}
				toggleUploadLoading(false);
				spinnerTO = null;
			}
		});

		$('#photobooth').on('scroll', function (e) {
			var scroll = $(this).scrollTop();
			var height = $(this).height();
			if (height - scroll <= 450 && !adding && !depleted) {
				loadPics();
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

	function toggleUploadLoading(show) {
		if (show) {
			$('#pb-upload-preview').hide();
			$('#pb-upload-preview-spinner').show();
		} else {
			$('#pb-upload-preview-spinner').hide()
			$('#pb-upload-preview').show();
		}
	}

	function validateFile() {
		var fileField = $('#pb-upload-file');
		if (fileField.length && fileField.val() && validFiles.length && validFiles.length === fileField.length) {
			$('#photo-form-errors').hide();
			return true;
		}
		setUploadError('Je hebt geen foto geselecteerd');
		return false;
	}

	function setUploadError(msg) {
		$('#photo-form-errors #photo-form-main-error').html(msg);
		$('#photo-form-errors').show();
	}

	function sendForm() {
		var valid1 = validateForm('photoUpload');
		var valid2 = validateFile();
		if (valid1 && valid2) {
			$('#loading').fadeIn();
			var uploader = $('#naam').val(),
				desc = $('#omschrijving').val(),
				file = validFiles[0],
				data = new FormData(),
				url = getBase('api') + 'photos';

			data.append('uploader', uploader);
			data.append('description', desc);
			data.append('photo', file, file.name);

			$.ajax({
				type: 'POST',
				enctype: 'multipart/form-data',
				url: url,
				data: data,
				processData: false,
				contentType: false,
				cache: false,
				timeout: 600000
			})
				.done(function (data) {
					$('#photoBoothUpload .close-btn').click();
					showNotifcation('success', 'Upload gelukt!');
					addPic(data);
				})
				.fail(function (e) {
					showNotifcation('error', 'Er ging iets mis bij het uploaden :(');
				})
				.always(function () {
					$('#loading').fadeOut();
				});
		}
	}

	//</editor-fold>µ

	//<editor-fold desc="images">
	function removeBlocked() {
		var apiUrl = getBase('api') + 'photos/notallowed/0/0',
			self = photoBooth();
		if (gallery) {
			$.get(apiUrl, function (data) {
				if (data) {
					$.each(data, function (index, image) {
						var alreadyRemoved = function () {
							var inBlocked = _.find(blocked, function(imb){ return imb._id == image._id}),
								inMain = _.find(mainImages, function(imm){return imm._id == image._id});
							if (inBlocked || !inMain) {
								return true
							}
						};
						if (!alreadyRemoved()) {
							blocked.push(image);
							_.reject(mainImages, function (img) {
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


	function loadPics() {
		adding = true;
		$('#image-loader').show();
		var apiUrl = getBase('api') + 'photos/allowed/:limit/:skip',
			skip = mainImages.length || 0,
			limit = $(window).height() > 600 ? 10 : 50,
			html = '',
			self = photoBooth();

		apiUrl = apiUrl.replace(':limit', limit);
		apiUrl = apiUrl.replace(':skip', skip);

		$.get(apiUrl, function (data) {
			if (data) {
				$.each(data, function (index, image) {
					var alreadyAdded = function () {
						var inMain = _.find(mainImages, image),
							inSelf = _.find(selfAdd, image);
						return inMain || inSelf;
					};
					if (!alreadyAdded()) {
						var imgEl = self.createImage(image);
						mainImages.push(image);
						html += imgEl;
					}
				});
				$('#photoBoothGallery').append(html);
			}
		})
			.done(function () {
				if (gallery) {
					updateGallery();
				} else {
					initGallery();
				}
			})
			.fail(function () {
				depleted = true;
				$('#images-depleted').show();
			})
			.always(function () {
				$('#image-loader').hide();
				adding = false;
			});
	}

	function initGallery() {
		gallery = $('#photoBoothGallery').justifiedGallery({
			rowHeight: 200,
			maxRowHeight: 200,
			lastRow: 'justify',
			margins: 3,
			rel: 'photobooth'
		}).on('jg.complete', function () {
			$(this).find('a').colorbox({
				maxWidth: '80%',
				maxHeight: '80%',
				opacity: 0.8,
				transition: 'elastic',
				current: ''
			})
		});
	}

	function updateGallery() {
		if (gallery) {
			$('#photoBoothGallery').justifiedGallery('norewind');
			removeBlocked();
		} else {
			initGallery();
		}
	}

	function addPic(image) {
		if (image) {
			var imgEl = photoBooth().createImage(image);
			$('#photoBoothGallery').append(imgEl);
			selfAdd.push(image);
			updateGallery();
		}
	}

	//</editor-fold>
}
