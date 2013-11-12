/**
 * @constructor
 */
greppy.Styler.Upload = function()
{
};

/**
 * Styles a fileupload input in the manner of bootstrap 3.
 *
 * @param {String|Object} el Maybe a String or a jQuery object
 */
greppy.Styler.Upload.prototype.style = function(el)
{
    function showFilename() {
        $(newUploadSel + ' .file-path').text(el.val().split('\\').pop());
    }

    function showFileDialog() {
        el.trigger('click');
    }

    el = this.validate(el);

    var newUploadSel = 'div[data-fileuploadname="' + el.attr('name') + '"]';

    var markup = '<div class="input-group" data-fileuploadname="' + el.attr('name') + '"' +
        ' data-greppy-validator-mark="' + el.attr('name') +'">' +
        '<span class="input-group-addon"><i class="fa fa-file"></i></span>' +
        '<div class="form-control"><span class="file-path"></span></div>' +
                '<span class="input-group-btn">' +
                    '<button class="btn btn-default" type="button">Datei wählen</button>' +
                '</span>' +
        '</div>';

    el.wrap(markup);

    if (el.val()) {
        showFilename();
    }

    el.on('change', function() {
        showFilename();
    });

    $(newUploadSel + ' button, ' + newUploadSel + ' .form-control').on('click', function(e) {

        // if prevents endless recursion
        if (!$(e.target).is(el)) {
            showFileDialog();
        }
    });

    el.hide();
};

/**
 * Helper function that validates an input[type="file"] element.
 *
 * @param {String|Object} el A fileupload element or a selector that's pointing to one.
 * @returns {jQuery}
 */
greppy.Styler.Upload.prototype.validate = function(el)
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
