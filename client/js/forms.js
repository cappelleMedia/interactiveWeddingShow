/**
 * Created by Jens on 05-Feb-17.
 */
/*
 * Add form validations
 *
 *
 * */

var setFormListeners, prepareForSubmit, validateForm;

window.onload = function () {
    setFormListeners();
};

setFormListeners = function () {
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
        var personCount = $('.person-block').length;
        var block = this.parentElement;
        if (personCount > 1) {
            block.remove();
        }
    });

    $('#formSubmit').on('click', function (e) {
        e.preventDefault();
        var valid = validateForm();
        prepareForSubmit();
    })
};

prepareForSubmit = function () {
    var email = $('email');
    var blocks = $('.person-block');
    console.log(blocks);
};

validateForm = function () {
    var fields = $('.validation-candidate');
    _.each(fields, function (field) {
        var validationType = field.type;
        console.log(validationType);
    });
};