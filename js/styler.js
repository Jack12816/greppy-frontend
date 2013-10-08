/**
 * @constructor
 */
greppy.Styler = function()
{
};

/**
 * Styles a fileupload input in the manner of bootstrap 3.
 *
 * @param {String|Object} elem Maybe a String or a jQuery object
 * @returns {undefined}
 */
greppy.Styler.prototype.styleUpload = function(elem)
{
    elem = this.validateStyleUpload(elem);

    var newUploadSel = 'div[data-fileuploadname="' + elem.name + '"]';

    var markup = '<div class="input-group" data-fileuploadname="' + elem.name + '">' +
        '<span class="input-group-addon"><i class="icon-file"></i></span>' +
        '<div class="form-control"><span class="file-path"></span></div>' +
                '<span class="input-group-btn">' +
                    '<button id="myBtn" class="btn btn-default">Datei wählen</button>' +
                '</span>' +
        '</div>';

    elem.after(markup);

    elem.on('change', function() {
        $(newUploadSel + ' .file-path').text($(this).val().split('\\').pop());
    });

    $(newUploadSel + ' button, ' + newUploadSel + ' .form-control').on('click', function() {

        elem.trigger('click');

        return false;
    });

    elem.hide();
};

/**
 * Helper function that validates an input-files element.
 *
 * @param {String|Object} elem A fileupload element or a selector that's pointing to one.
 * @returns {Object} jQuery object
 */
greppy.Styler.prototype.validateStyleUpload = function (elem)
{
    var s = new greppy.Sanitizer();
    var name;

    elem = s.toJquery(elem);

    s.assertSingle(elem);

    name = elem.attr('name');

    if (!name || $('*[name="' + name + '"]').length > 1) {
        throw new Error('Element needs to have a unique name!');
    }

    return elem;
};

/**
 * Creates an overlay which is displayed on top of an element, when a specified
 * event occurs.
 *
 * @param {String|Object} el Maybe a String or a jQuery object.
 * @param {String} showEvent Name of the event which is showing the overlay when fired.
 * @param {String} removeEvent Name of the event which is removing the overlay when fired.
 * @returns {undefined}
 */
greppy.Styler.prototype.initOverlay = function(el, showEvent, removeEvent)
{
    var s = new greppy.Sanitizer();
    var self      = this;
    var overlayId = 'gOverlay' + (new Date).getTime();
    var evts = {};

    el = s.toJquery(el);
    s.assertSingle(el);

    evts[showEvent] = function() {
        el.parent().find('#' + overlayId).remove();

        el.after('<div id="' + overlayId + '" />');

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
 * @returns {undefined}
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
        zIndex: 2e9, // The z-index (defaults to 2000000000)
    };

    this.spinner = new Spinner(opts).spin(target);
};

