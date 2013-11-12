/**
 * @constructor
 */
greppy.Styler.Upload = function()
{
};

/**
 * Styles a fileupload input in the manner of bootstrap 3.
 *
 * @param {String|jQuery} el The element(s) to style
 */
greppy.Styler.Upload.prototype.style = function(el)
{
    var self = this;

    el = $(el);

    el.each(function(idx, el) {

        el = $(el);

        self.validate(el);
        self.addStyles(el);
        self.handleFilePreselected(el);
        self.addNewFileSelectedHandler(el);
        self.addButtonHandlers(el);
        self.hideOriginalInput(el);
    });
};

/**
 * Helper function that validates an input[type="file"] element.
 *
 * @param {jQuery} el A fileupload element or a selector that's pointing to one
 */
greppy.Styler.Upload.prototype.validate = function(el)
{
    var name = el.attr('name');

    if (!name || $('*[name="' + name + '"]').length > 1) {
        throw new Error('Element needs to have a unique name');
    }
};

/**
 * Adds the new markup to the input element.
 *
 * @param {jQuery} el
 */
greppy.Styler.Upload.prototype.addStyles = function(el)
{
    var markup = this.getMarkup(el);

    el.wrap(markup);
};

/**
 * Computes the markup to style an upload element.
 *
 * @param {jQuery} el
 * @returns {String} The markup as HTML
 */
greppy.Styler.Upload.prototype.getMarkup = function(el)
{
    return '<div class="input-group" data-fileuploadname="' + el.attr('name') + '"' +
        ' data-greppy-validator-mark="' + el.attr('name') +'">' +
        '<span class="input-group-addon"><i class="fa fa-file"></i></span>' +
        '<div class="form-control"><span class="file-path"></span></div>' +
                '<span class="input-group-btn">' +
                    '<button class="btn btn-default" type="button">Datei wählen</button>' +
                '</span>' +
        '</div>';
};

/**
 * Shows the filename of the current selected file in the specified element.
 *
 * @param {jQuery} el
 */
greppy.Styler.Upload.prototype.showFilename = function(el)
{
    $(this.getStyledUploadSelector(el) + ' .file-path').text(el.val().split('\\').pop());
};

/**
 * Gets the selector of the styled upload for the specified element.
 *
 * @param {type} el
 * @returns {String}
 */
greppy.Styler.Upload.prototype.getStyledUploadSelector = function(el)
{
    return 'div[data-fileuploadname="' + el.attr('name') + '"]';
};

/**
 * Handles the displaying of files that were already selected before styling.
 *
 * @param {jQuery} el
 */
greppy.Styler.Upload.prototype.handleFilePreselected = function(el)
{
    if (el.val()) {
        this.showFilename(el);
    }
};

/**
 * Adds a handler for the selection of new files.
 *
 * @param {jQuery} el
 */
greppy.Styler.Upload.prototype.addNewFileSelectedHandler = function(el)
{
    var self = this;

    el.on('change', function() {
        self.showFilename(el);
    });
};

greppy.Styler.Upload.prototype.addButtonHandlers = function(el)
{
    var self      = this;
    var uploadSel = this.getStyledUploadSelector(el);

    $(uploadSel + ' button, ' + uploadSel + ' .form-control').on('click', function(e) {

        // if prevents endless recursion
        if (!$(e.target).is(el)) {
            self.showFileDialog(el);
        }
    });
};

/**
 * Shows the file select dialog to the user.
 *
 * @param {jQuery} el
 */
greppy.Styler.Upload.prototype.showFileDialog = function(el)
{
    el.trigger('click');
};

/**
 * Hides the old input element so the user doesn't notice it anymore.
 *
 * @param {jQuery} el The old input element to hide.
 */
greppy.Styler.Upload.prototype.hideOriginalInput = function(el)
{
    el.hide();
};
