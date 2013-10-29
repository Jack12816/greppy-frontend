/**
 * @constructor
 */
greppy.Validator = function()
{
};

/**
 * Initializes greppy validators.
 */
greppy.Validator.prototype.init = function ()
{
    var self              = this;
    var allValidators     = $('input, select, textarea').filter('.greppy-validator');
    this.uniqueValidators = this.getUniqueValidators(allValidators);

    allValidators.on({
        invalid: function(e) {
            $(this).trigger('gValidationInvalid');
            e.preventDefault();
        },
        change: function() {
            $(this).trigger('gValidationUpdate');
        },
        keyup: function() {
            $(this).trigger('gValidationUpdate');
        }
    });

    $(document).on({
        gValidationUpdate: function(e) {

            // check if it's valid or invalid
            self.validate(e.target);
        },
        gValidationInvalid: function(e) {

            if (self.isUniqueValidator(e.target)) {
                self.markInvalid(self.getMark(e.target));
                self.showMsg(e.target);
            }

            e.preventDefault();
        }
    });
};

/**
 * Determines if a passed element is in the set of unique validators.
 *
 * @param {Object} el
 * @returns {Boolean}
 */
greppy.Validator.prototype.isUniqueValidator = function(el)
{
    return this.uniqueValidators.filter('[name="' + $(el).attr('name') + '"]').is(el);
};

/**
 * Filters the validators to avoid double names.
 *
 * @param {jQuery} allValidators
 * @returns {jQuery}
 */
greppy.Validator.prototype.getUniqueValidators = function(allValidators)
{
    var uniques = $();

    allValidators.each(function(idx, el) {
        el = $(el);

        if (el.attr('name') &&
                uniques.filter('[name="' + $(el).attr('name') + '"]').length) {
            return;
        }

        uniques = uniques.add(el);
    });

    return uniques;
};

/**
 * Gets the element which should be marked if an error occurs.
 *
 * @param {jQuery} el The validator.
 * @returns {jQuery}
 */
greppy.Validator.prototype.getMark = function (el)
{
    el = $(el);
    var name = el.attr('name');
    var result;

    if (null === name) {
        return el;
    }

    result = $('*[data-greppy-validator-mark="' + name + '"]');

    if (0 === result.length && el.hasClass('multiselect')) {
        result = el.nextAll('.btn-group');
    }

    return 0 < result.length ? result : el;
};

/**
 * Validates an element.
 *
 * @param {Object} el The element to validate.
 */
greppy.Validator.prototype.validate = function (el)
{
    if (false === el.checkValidity()) {

        this.markInvalid(this.getMark(el));
        this.showMsg(el);
        return;
    }

    this.removeInvalidMark(this.getMark(el));
    this.removeMsg(this.getMark(el));
};

/**
 * Marks the provided element as invalid.
 *
 * @param {Object} el
 */
greppy.Validator.prototype.markInvalid = function(el)
{
    $(el).addClass('greppy-validator-invalid');
};

/**
 * Removes an invalid mark from the provided element.
 *
 * @param {Object} el
 */
greppy.Validator.prototype.removeInvalidMark = function(el)
{
    $(el).removeClass('greppy-validator-invalid');
};

/**
 * Shows the validation message of a provided element.
 *
 * @param {type} el
 */
greppy.Validator.prototype.showMsg = function(el)
{
    el       = $(el);
    var mark = this.getMark(el);
    var self = this;

    if (this.hasActiveMsg(el)) {
        return;
    }

    $('<div class="greppy-validator-msg btn btn-danger" data-greppy-validator-name="' + el.attr('name') + '" />')
    .html(el.attr('data-greppy-validator-msg') || 'Validation failed')
    .insertAfter(mark)
    .hide()
    .fadeIn()
    .css({
        top: mark.position().top + mark.outerHeight() + 4,
        left: mark.position().left
    })
    .on('mouseleave', function() {
        self.removeMsg(mark);
    });
};

/**
 * Returns wether the passed element has an active message.
 *
 * @param {jQuery} el
 * @returns {Boolean}
 */
greppy.Validator.prototype.hasActiveMsg = function(el)
{
    var name = el.attr('name');

    if (name && $('.greppy-validator-msg[data-greppy-validator-name="' + name + '"]').length) {
        return true;
    }

    return false;
};

/**
 * Removes the msg-element of a provided mark element, if there's any.
 *
 * @param {Object} el The mark element
 * @param {Boolean} fast No fading out; fast removing.
 */
greppy.Validator.prototype.removeMsg = function(el, fast)
{
    el = $(el).nextAll('.greppy-validator-msg');

    if (fast) {
        el.remove();
        return;
    }

    el.fadeOut(function() {
        el.remove();
    });
};

