/**
 * Created by Jens on 05-Feb-17.
 */
/*
 * Add form validations
 *
 *
 * */
window.onload = function () {
    setFormListeners();
};

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

    $('#formSubmit').on('click', function (e) {
        e.preventDefault();
        prepareForSubmit();
    });

    $('#registerForm').on('keyup', '.validation-candidate', function () {
        validateField(this);
    });

    $('#registerForm').on('keypress', function (e) {
        var keyCode = e.which || e.keyCode;
        if (keyCode == 13) {
            e.preventDefault();
            $('#formSubmit').click();
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

function validateForm() {
    var fields = $('.validation-candidate'),
        isValid = true;

    _.each(fields, function (field) {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    return isValid;
}

function prepareForSubmit() {
    if (!validateForm()) {
        return;
    }
    var email = document.getElementById('email').value,
        blocks = $('.person-block'),
        users = {};
    for (var index = 0; index < blocks.length; index++) {
        var id = index + 1,
            firstName = document.getElementById('firstName' + id).value,
            lastName = document.getElementById('lastName' + id).value,
            person = {
                'email': email,
                'firstName': firstName,
                'lastName': lastName
            };
        users['user' + id] = person;
    }
    sendForm(users);
}

function sendForm(users) {
    users['multi'] = true;
    var a = JSON.stringify(users);
    console.log(a);
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