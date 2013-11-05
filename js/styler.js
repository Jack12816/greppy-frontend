/**
 * @constructor
 */
greppy.Styler = function()
{
};

/**
 * Styles a fileupload input in the manner of bootstrap 3.
 *
 * @param {String|Object} el Maybe a String or a jQuery object
 */
greppy.Styler.prototype.styleUpload = function(el)
{
    function showFilename() {
        $(newUploadSel + ' .file-path').text(el.val().split('\\').pop());
    }

    el = this.validateStyleUpload(el);

    var newUploadSel = 'div[data-fileuploadname="' + el.attr('name') + '"]';

    var markup = '<div class="input-group" data-fileuploadname="' + el.attr('name') + '"' +
        ' data-greppy-validator-mark="' + el.attr('name') +'">' +
        '<span class="input-group-addon"><i class="fa fa-file"></i></span>' +
        '<div class="form-control"><span class="file-path"></span></div>' +
                '<span class="input-group-btn">' +
                    '<button class="btn btn-default">Datei wählen</button>' +
                '</span>' +
        '</div>';

    el.after(markup);

    if (el.val()) {
        showFilename();
    }

    el.on('change', function() {
        showFilename();
    });

    $(newUploadSel + ' button, ' + newUploadSel + ' .form-control').on('click', function() {

        el.trigger('click');

        return false;
    });

    el.hide();
};

/**
 * Helper function that validates an input[type="file"] element.
 *
 * @param {String|Object} el A fileupload element or a selector that's pointing to one.
 * @returns {jQuery}
 */
greppy.Styler.prototype.validateStyleUpload = function(el)
{
    var name;

    el = $(el);

    if (1 !== el.length) {
        throw new Error('Expected single element to style, but got ' + el.length);
    }

    name = el.attr('name');

    if (!name || $('*[name="' + name + '"]').length > 1) {
        throw new Error('Element needs to have a unique name');
    }

    return el;
};

/**
 * Styles an input element to be adjustable via buttons.
 *
 * @param {String|Object} el Maybe a String or a jQuery object
 */
greppy.Styler.prototype.styleNumber = function(el)
{
    el = this.validateStyleNumber(el);

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

    el.next('.input-group-btn').find('.g-add').on('click', function() {
        var val = (isNaN(parseInt(el.val(), 10))) ? 0 : parseInt(el.val(), 10);
        val     = (el.attr('data-max') < (val + 1)) ? val : val + 1;
        el.val(val);
    });

    el.next('.input-group-btn').find('.g-substract').on('click', function() {
        var val = (isNaN(parseInt(el.val(), 10))) ? 0 : parseInt(el.val(), 10);
        val     = (el.attr('data-min') > (val - 1)) ? val : val - 1;
        el.val(val);
    });
};

/**
 * Helper function which does the validation for styleNumber.
 *
 * @param {String|Object} el Maybe a String or a jQuery object
 * @returns {Object} jQuery object
 */
greppy.Styler.prototype.validateStyleNumber = function(el)
{
    el = $(el);

    if ('INPUT' !== el.prop('tagName')) {
        throw new Error('Element needs to be an input');
    }

    return el;
};


/**
 * Creates an overlay which is displayed on top of an element, when a specified
 * event occurs.
 *
 * @param {String|Object} el Maybe a String or a jQuery object.
 * @param {String} showEvent Name of the event which is showing the overlay when fired.
 * @param {String} removeEvent Name of the event which is removing the overlay when fired.
 */
greppy.Styler.prototype.initOverlay = function(el, showEvent, removeEvent)
{
    var self      = this;
    var overlayId = 'gOverlay' + (new Date).getTime();
    var evts = {};

    el = $(el);

    if (1 !== el.length) {
        throw new Error('Expected single element for overlay, but got ' + el.length);
    }

    evts[showEvent] = function() {
        el.parent().find('#' + overlayId).remove();

        el.after('<div class="greppy-overlay" id="' + overlayId + '" />');

        $('#' + overlayId).css({
            background : 'rgba(255, 255, 255, 0.6)',
            position   : 'absolute',
            top        : el.position().top,
            left       : el.position().left,
            width      : el.outerWidth(),
            height     : el.outerHeight()
        });

        self.initSpinner(document.getElementById(overlayId));
    };

    evts[removeEvent] = function() {
        $('#' + overlayId).remove();
    };

    el.on(evts);
};

/**
 * Initializes the spinner animation for a given target.
 *
 * @param {Object} target Non-jQuery object where the spinner is placed
 * @param {Object} opts The options for the spinner. Optional.
 */
greppy.Styler.prototype.initSpinner = function(target, opts) {
    opts = opts || {
        lines: 11, // The number of lines to draw
        length: 0, // The length of each line
        width: 10, // The line thickness
        radius: 30, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb
        speed: 1, // Rounds per second
        trail: 29, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: true, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9 // The z-index (defaults to 2000000000)
    };

    this.spinner = new Spinner(opts).spin(target);
};

