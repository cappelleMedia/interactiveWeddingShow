function photoBooth() {
	var photoBoothInfoId = 'photoBoothInfo',
		validFiles = [],
		spinnerTO;
	return {
		init: function () {
			checkFirstTime();
			setListeners();
			loadPics('init');
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
					if (file.size > 4000000) {
						setUploadError('');
					} else {
						validFiles.push(file);
					}
				});
				if (validFiles) {
					tmpPath = URL.createObjectURL(e.target.files[0]);
					$('#pb-upload-preview img').attr('src', tmpPath);
				}
				toggleUploadLoading(false);
				$('#photo-form-errors').hide();
				spinnerTO = null;
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
	function loadPics(offset) {
		$('#image-loader').show();
		var apiUrl = getBase('api') + 'photos/',
			baseImgUrl = 'assets/images/photobooth/',
			html = '';

		$.get(apiUrl, function (data) {
			if (data) {
				$.each(data, function (index, image) {
					var url = baseImgUrl + image.url,
						caption = image.description + ' - ' + image.poster;
					var imgEl =
						'<a href="'+ url +'">' +
						'<img alt="'+ caption +'" src="'+ url +'"/>' +
						'</a>';
					html += imgEl;
				});
			}

			$('#photoBoothGallery').html(html);
			$('#image-loader').hide();
			initGallery();
		});
	}

	function initGallery() {
		$('#photoBoothGallery').justifiedGallery();
	}

	//</editor-fold>
}
