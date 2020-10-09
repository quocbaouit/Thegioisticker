function initvalidation(selector, dataQuote) {
    var validationObject = {};
    validationObject = validateHelper(dataQuote);
    selector.on('init.field.fv', function (e, data) {
        var $parent = data.element.parents('.form-group'),
            $icon = data.element.data('fv.icon'),
            $label = $parent.children('label');
        $icon.insertAfter($label);
    });
    selector.formValidation({
        icon: {
            valid: 'fa fa-check',
            invalid: 'fa fa-times',
            validating: 'fa fa-refresh'
        },
        excluded: ':disabled',
        live: 'disabled',
        fields: validationObject
    })
        .on('err.field.fv', function (e, data) {
            data.fv.disableSubmitButtons(false);
        })
        .on('err.validator.fv', function (e, data) {
            data.element.data('fv.messages')
                .find('.help-block[data-fv-for="' + data.field + '"]').hide()
                .filter('[data-fv-validator="' + data.validator + '"]').show();
        })
        .on('success.field.fv', function (e, data) {
            data.fv.disableSubmitButtons(false);
        })
        .on('success.form.fv', function (e) {
            e.preventDefault();
        });
}

var validateObject = {};
function validateHelper(dataQuote) {
    validateObject = {};;
    if (dataQuote != undefined) {
        var keys = Object.keys(dataQuote);
        for (var i = 0; i < keys.length; i++) {
            var value = dataQuote[keys[i]];
            switch (value.type) {
                case 'radioOther':
                    validateRadioOther(value);
                    break;
                case 'spinbox':
                    validateSpinbox(value);
                    break;
                case 'checkbox':
                    validateCheckbox(value);
                    break;
                case 'checkboxOther':
                    validateCheckboxOther(value);
                    break;
                case 'radio':
                    validateRadio(value);
                    break;
                case 'textbox':
                    validateTextbox(value);
                    break;
                default:
                    break;
            }
        }

    }
    return validateObject;
}
function validateRadioOther(radioOther) {
    if (!radioOther.isOptional) {
        validateObject[radioOther.ctrlName] = { validators: { notEmpty: { message: 'Please select a value' } } };
    }
    validateObject['other' + radioOther.ctrlName] = {
        validators: {
            callback: {
                message: 'Please specify',
                callback: function (value, validator, $field) {
                    if ($('#' + radioOther.ctrlName + 'OtherId').is(':checked')) {
                        return ($('#other' + radioOther.ctrlName + 'Id').val() !== '');
                    } return true;
                }
            }
        }
    };
}
function validateSpinbox(spinbox) {
    if (!spinbox.isOptional) {
        validateObject[spinbox.ctrlName] = {
            validators: {
                notEmpty: { message: 'Please select a value' },
                between: { min: spinbox.min, max: spinbox.max, message: 'Please select a value between ' + spinbox.min + ' and ' + spinbox.max + '' }
            }
        };
    }
}
function validateCheckbox(checkbox) {
    if (!checkbox.isOptional) {
        validateObject[checkbox.ctrlName + '[]'] = {
            validators: {
                notEmpty: { message: 'Please select a value' }
            }
        };
    }
}
function validateCheckboxOther(checkboxOther) {
    if (!checkboxOther.isOptional) {
        validateObject[checkboxOther.ctrlName + '[]'] = {
            validators: { notEmpty: { message: 'Please select a value' } }
        };
    }
    validateObject['other' + checkboxOther.ctrlName] = {
        validators: {
            callback: {
                message: 'Please specify',
                callback: function (value, validator, $field) {
                    if ($('#' + checkboxOther.ctrlName + 'OtherId').is(':checked')) {
                        return ($('#other' + checkboxOther.ctrlName + 'Id').val() !== '');
                    } return true;
                }
            }
        }
    }
}
function validateRadio(radio) {
    validateObject[radio.ctrlName] = {
        validators: {
            notEmpty: { message: 'Please select a value' }
        }
    };
}
function validateTextbox(textbox) {
    if (!textbox.isOptional) {
        validateObject[textbox.ctrlName] = {
            validators: {
                notEmpty: { message: 'Vui lòng nhập thông tin.' }
            }
        };
    }
}
