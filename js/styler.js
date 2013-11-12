/**
 * @constructor
 */
greppy.Styler = function()
{
    this.upload = new greppy.Styler.Upload();
    this.number = new greppy.Styler.Number();
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
            top    : el.position().top,
            left   : el.position().left,
            width  : el.outerWidth(),
            height : el.outerHeight()
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

