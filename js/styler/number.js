/**
 * @constructor
 */
greppy.Styler.Number = function()
{
};

/**
 * Styles an input element to be adjustable via buttons.
 *
 * @param {String|jQuery} el The element(s) to style
 */
greppy.Styler.Number.prototype.style = function(el)
{
    var self = this;

    el = $(el);

    el.each(function(idx, el) {

        el = $(el);

        self.validate(el);
        self.handleCleanup(el);
        self.addStyles(el);
        self.addButtonHandlers(el);
    });
};

/**
 * Adds style markup to the element.
 *
 * @param {jQuery} el
 */
greppy.Styler.Number.prototype.addStyles = function(el)
{
    el.wrap('<div class="input-group greppy-container-num" ' +
            'data-greppy-validator-mark="' + el.attr('name') + '"></div>');

    el.addClass('pull-left');

    el.after('<div class="input-group-btn pull-left">' +
            '<button class="btn btn-default g-add" type="button">' +
                '<i class="fa fa-plus"></i>' +
            '</button>&nbsp;' +
            '<button class="btn btn-default g-substract" type="button">' +
                '<i class="fa fa-minus"></i>' +
            '</button>' +
    '</div>');
};

/**
 * Adds spinner buttons to the provided element.
 *
 * @param {jQuery} el
 */
greppy.Styler.Number.prototype.addButtonHandlers = function(el)
{
    var self = this;

    el.next('.input-group-btn').find('.g-add').on('click', function() {

        var val = self.getAddedVal(el);

        el.val(val)
            .trigger('change');
    });

    el.next('.input-group-btn').find('.g-substract').on('click', function() {

        var val = self.getSubtractedVal(el);

        el.val(val)
            .trigger('change');
    });
};

/**
 * Returns the normalized number of the passed element.
 *
 * @param {jQuery} el
 * @returns {Number}
 */
greppy.Styler.Number.prototype.getVal = function(el)
{
    return (isNaN(parseInt(el.val(), 10))) ? 0 : parseInt(el.val(), 10);
};

/**
 * Returns the added number of the passed element.
 *
 * @param {jQuery} el
 * @returns {Number}
 */
greppy.Styler.Number.prototype.getAddedVal = function(el)
{
    var val = this.getVal(el);

    return (el.attr('data-max') < (val + 1)) ? val : val + 1;
};

/**
 * Returns the subtracted number of the passed element.
 *
 * @param {jQuery} el
 * @returns {Number}
 */
greppy.Styler.Number.prototype.getSubtractedVal = function(el)
{
    var val = this.getVal(el);

    return (el.attr('data-min') > (val - 1)) ? val : val - 1;
};

/**
 * Decides wether to cleanup the passed element.
 *
 * @param {jQuery} el
 */
greppy.Styler.Number.prototype.handleCleanup = function(el)
{
    if (this.isNumber(el)) {
        this.clearStyled(el);
    }
};

/**
 * Determines wether the passed element is a number-styled input.
 *
 * @param {jQuery} el
 * @returns {Boolean}
 */
greppy.Styler.Number.prototype.isNumber = function(el)
{
    if (el.parent().hasClass('greppy-container-num')) {
        return true;
    }

    return false;
};

/**
 * Clears an input from remaining stuff of Greppy number to get a plain input.
 *
 * @param {jQuery} el
 */
greppy.Styler.Number.prototype.clearStyled = function(el)
{
    el.unwrap();
    el.next('.input-group-btn').remove();
    el.off();
};

/**
 * Helper function which ensures el fits the requirements.
 *
 * @param {jQuery} el
 */
greppy.Styler.Number.prototype.validate = function(el)
{
    if ('INPUT' !== $(el).prop('tagName')) {
        throw new Error('Element needs to be an input');
    }
};
