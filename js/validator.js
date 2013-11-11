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
    var self           = this;
    this.allValidators = $('input, select, textarea').filter('.greppy-validator');
    this.events        = [];

    this.bindEvent('invalid', 'gValidationInvalid');
    this.bindEvent('change', 'gValidationUpdate');
    this.bindEvent('keyup', 'gValidationUpdate');

    $(document).on({
        gValidationUpdate: function(e) {

            // check if it's valid or invalid
            self.validate(e.target);
        },
        gValidationInvalid: function(e) {

            self.markInvalid(self.getMark(e.target));
            self.showMsg(e.target);

            e.preventDefault();
        }
    });
};

/**
 * Bind an event to trigger Greppy validator events.
 *
 * @param {String} origEvtName Name of the event to be bound.
 * @param {String} gEvtName May be 'gValidationInvalid' or 'gValidationUpdate'.
 */
greppy.Validator.prototype.bindEvent = function(origEvtName, gEvtName)
{
    var self = this;

    if ('gValidationInvalid' !== gEvtName && 'gValidationUpdate' !== gEvtName) {
        throw new Error('No such Greppy validator event exists: ' + gEvtName);
    }

    this.events.push({
        origEvtName : origEvtName,
        gEvtName    : gEvtName
    });

    $(this.allValidators).each(function(idx, el) {
        self.bindEventToValidator(el, origEvtName, gEvtName);
    });
};

/**
 * This binds an element's event to a specified greppy Validator event.
 *
 * @param {jQuery} validator
 * @param {String} origEvtName
 * @param {String} gEvtName
 */
greppy.Validator.prototype.bindEventToValidator = function(validator,
        origEvtName, gEvtName)
{
    validator = $(validator);

    validator.on(origEvtName, function(e) {
        $(this).trigger(gEvtName);

        if ('gValidationInvalid' === gEvtName) {
            e.preventDefault();
        }
    });
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

    result = el.parents('*[data-greppy-validator-mark="' + name + '"]');

    if (0 === result.length && el.hasClass('multiselect')) {
        result = el.nextAll('.btn-group');
    }

    return 0 < result.length ? result : el;
};

/**
 * Add a validator to the current set of validators.
 *
 * @param {type} el
 * @returns {undefined}
 */
greppy.Validator.prototype.addValidator = function(el)
{
    if (!$(el).hasClass('greppy-validator')) {
        throw new Error('Element passed is not a Greppy validator!');
    }

    this.allValidators.add(el);
    this.bindAllEventsToValidator(el);
};

/**
 * Applies the defined events to the specified validator.
 *
 * @param {jQuery} validator
 */
greppy.Validator.prototype.bindAllEventsToValidator = function(validator)
{
    var self = this;

    this.events.forEach(function(el, idx) {
        self.bindEventToValidator(validator, el.origEvtName, el.gEvtName);
    });
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
        //this.showMsg(el);
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
    //el       = this.getUniqueValidator(el);
    el       = $(el);
    var mark = this.getMark(el);
    var self = this;

    if (this.hasActiveMsg(el)) {
        return;
    }

    $('<div class="greppy-validator-msg btn btn-danger" data-greppy-validator-name="' + el.attr('name') + '" />')
    .html(mark.attr('data-greppy-validator-msg') || el.attr('data-greppy-validator-msg') || 'Validation failed')
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
    var mark = this.getMark(el);

    if (name && mark.nextAll('.greppy-validator-msg[data-greppy-validator-name="' + name + '"]').length) {
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
