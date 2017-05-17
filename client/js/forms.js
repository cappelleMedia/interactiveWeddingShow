document.onload = formsInit();

function formsInit() {
	setFormListeners();
}

function setFormListeners() {
	$('#group-off').on('click', function () {
		$('#form-holder').removeClass('multi-form');
		$(this).addClass('selected');
		$("#group-on").removeClass('selected');
	});

	$('#group-on').on('click', function () {
		$('#form-holder').addClass('multi-form');
		$(this).addClass('selected');
		$("#group-off").removeClass('selected');
	});

	$('#person-add-btn').on('click', function (e) {
		e.preventDefault();
		var personCount = $('.person-block').length + 1;
		var newBlock = new EJS({url: 'js/templates/person-block.ejs'}).render({count: personCount});
		$('#person-blocks').append(newBlock);
	});

	$('#person-blocks').on('click', '.person-legend', function () {
		var personCount = $('.person-block').length,
			block = this.parentElement;
		if (personCount > 1) {
			block.remove();
		}
	});

	$('body').on('click', '.formSubmit',function (e) {
		e.preventDefault();
		prepareForSubmit($(this));
	});

	$('body').on('blur', '.s_m_form .validation-candidate', function () {
		validateField(this);
	});

	$('body').on('keypress','.s_m_form', function (e) {
		var keyCode = e.which || e.keyCode;
		if (keyCode == 13) {
			e.preventDefault();
			var submitBtn = $('#' + this.id + ' .formSubmit');
			submitBtn.click();
		}
	});
}

function validateField(el) {
	var valid = isValidField(el);
	if (valid === true) {
		setValid(el);
		return true;
	} else {
		setInvalid(el, valid);
		return false;
	}
}

function setValid(el) {
	var parent = el.parentElement,
		identifier = el.id,
		icon = document.getElementById(identifier + '-feedback-icon');
	$(parent).removeClass('has-error');
	$(parent).addClass('has-success');
	$(icon).removeClass('fa-times');
	$(icon).addClass('fa-check');
}

function setInvalid(el, valid) {
	var parent = el.parentElement,
		identifier = el.id,
		errorFieldName = getFieldName(identifier),
		icon = document.getElementById(identifier + '-feedback-icon'),
		errorMsg = identifier + '-error-message';
	$(parent).addClass('has-error');
	$(icon).removeClass('fa-check');
	$(icon).addClass('fa-times');
	$('#' + errorMsg).html(valid.replace('{placeholder}', errorFieldName));
}

function validateForm(callerTarget) {
	var filterId = 'input-filter-' + callerTarget;
	if (document.getElementById(filterId).value) {
		return;
	}
	var fieldsSelector = '#' + callerTarget + 'Form .validation-candidate';
	var fields = $(fieldsSelector),
		isValid = true;

	_.each(fields, function (field) {
		if (!validateField(field)) {
			isValid = false;
		}
	});
	return isValid;
}

function prepareForSubmit(caller) {
	var callerTarget = $(caller).data('target');
	if (!validateForm(callerTarget)) {
		return;
	}
	switch (callerTarget) {
		case 'register':
			return prepareRegisterForm();
		case 'adminLogin' :
			return sendAdminLoginForm();
		default:
			return true;
	}
}

function prepareRegisterForm() {
	var email = document.getElementById('email').value,
		blocks = $('.person-block'),
		result = {};
	result['users'] = {};
	for (var index = 0; index < blocks.length; index++) {
		var id = index + 1,
			firstName = document.getElementById('firstName' + id).value,
			lastName = document.getElementById('lastName' + id).value,
			person = {
				'email': email,
				'firstName': firstName,
				'lastName': lastName
			};
		result['users']['user' + id] = person;
	}
	sendRegisterForm(result);
}

function sendAdminLoginForm() {
	var email = document.getElementById('email').value,
		pwd = document.getElementById('password').value,
		body = {email: email, password: pwd},
		apiUrl = getBase('api') + 'users/authenticate';

	$.post(apiUrl, body, function (response) {
		authenticationHandler().setAdmin(email, response, true);
	})
		.fail(function () {
			showNotifcation('error', 'Foutieve aanmeld gegevens');
		});
}

function sendRegisterForm(users) {
	users['multi'] = true;
	var apiUrl = getBase('api') + 'users';
	$.post(apiUrl, users, function (data) {
		$('#registerForm').trigger('reset');
		toggleMenu(document.getElementById('do-you-menu'));
		setCookie('user', data.email);
		showNotifcation('success', 'Registratie succesvol!');
	})
		.fail(function () {
			showNotifcation('error', 'Er ging iets mis bij het registreren :(');
		});
}

function isValidField(field) {
	var type = field.dataset.validationType,
		value = field.value.toLowerCase();
	switch (type) {
		case 'not-empty':
			return validateEmpty(value) ? true : '{placeholder} is een verplicht veld!';
		case 'first-name':
			if (!validateEmpty(value)) {
				return '{placeholder} is een verplicht veld';
			}
			if (isDouble(field)) {
				return 'Deze voornaam is al eens gebruikt';
			}
			return true;
		case 'email':
			if (!validateEmpty(value)) {
				return '{placeholder} is een verplicht veld';
			}
			if (!validateEmail(value)) {
				return 'Dit is geen geldig email adres';
			}
			return true;
		default:
			return false;
	}
}

function validateEmail(email) {
	var re = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
	return re.test(email);
}

function validateEmpty(field) {
	return !_.isEmpty(field);
}

function isDouble(field) {
	var doubleClass = field.dataset.doubleType,
		doubleVal = false;
	_.each($('.' + doubleClass), function (double) {
		if ((double !== field) && (double.value.toLowerCase() == field.value.toLowerCase())) {
			setInvalid(double, 'Deze voornaam is al eens gebruikt');
			doubleVal = true;
		}
	});
	return doubleVal;
}

function getFieldName(identifier) {
	identifier = (identifier.replace(/[0-9]/g, ''));
	var result = '';
	switch (identifier.toLowerCase()) {
		case 'firstname':
			result = 'Voornaam';
			break;
		case 'lastname':
			result = 'Achternaam';
			break;
		default:
			result = identifier;
	}

	return capitalize(result);

}

function capitalize(word) {
	var res = word.charAt(0).toUpperCase() + word.slice(1);

	return res;
}