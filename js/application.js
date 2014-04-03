/**
 * @constructor
 */
greppy.Application = function()
{
};

/**
 * Start a bootstrap modal easily.
 *
 * @param {String|Object} body - Body of the modal
 * @param {Object} options - Options for the modal
 * @param {Array} buttons - Buttons declarations
 */
greppy.Application.prototype.dialog = function(body, options, buttons)
{
    options = options || {};
    options.header = options.header || 'Confirmation required';
    options.keyboard = ('undefined' === typeof options.keyboard) ? true : options.keyboard;
    options.show = ('undefined' === typeof options.show) ? true : options.show;
    options.closeBtn = ('undefined' === typeof options.closeBtn) ? true : options.closeBtn;

    options.template = options.template || '<div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">'
        + '<div class="modal-dialog"><div class="modal-content"><div class="modal-header">'
        + (
            (false === options.closeBtn)
            ? ''
            : '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
          )
        + '{{header}}'
        + '</div>'
        + '<div class="modal-body">'
        + '</div>'
        + '<div class="modal-footer">'
        + '</div></div></div></div>';

    options.template = options.template.replace(
        '{{header}}', '<h4 class="modal-title">' + options.header + '</h4>'
    );

    var modal = $(options.template);

    // Inject the body
    modal.find('.modal-body').html(body);

    // Default buttons
    buttons = buttons || [
        {
            label    : 'Cancel',
            class    : 'btn btn-default',
            icon     : 'fa-times',
            callback : options.cancel || function(callback) {callback();}
        },
        {
            label    : 'Ok',
            class    : 'btn btn-primary',
            icon     : 'fa-check',
            callback : options.ok || function(callback) {callback();}
        }
    ];

    // Build buttons and bind events
    buttons.forEach(function(btn) {

        var btnObj = $('<a href="#" class="' + btn.class + '">'
                        + '<i class="fa ' + btn.icon + '"></i> '
                        + btn.label
                        + '</a>');

        // Bind callbacks
        btnObj.click(function() {
            btn.callback(function() {
                modal.modal('hide');
            });
            return false;
        });

        modal.find('.modal-footer').append(btnObj);
    });

    // Add modal partial to the body
    $("body").append(modal);

    console.log(options);

    // Setup the Bootstrap modal
    modal.modal(options);

    // Bind on-hide event
    modal.on('hidden.bs.modal', function() {

        // Bind close btn if necessary
        if ('function' === typeof options.close) {
            return options.close(function() {
                modal.remove();
            });
        }

        modal.remove();
    });

    // Bind on-show event
    modal.on('shown.bs.modal', function() {
        modal.find('input:first').focus();
    });

    return modal;
};

