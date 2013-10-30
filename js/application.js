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
    var template = '<div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">'
                    + '<div class="modal-dialog"><div class="modal-content"><div class="modal-header">'
                    + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
                    + '{{header}}'
                    + '</div>'
                    + '<div class="modal-body">'
                    + '</div>'
                    + '<div class="modal-footer">'
                    + '</div></div></div></div>';

    options = options || {};
    options.header = options.header || 'Confirmation required';

    template = template.replace(
        '{{header}}', '<h4 class="modal-title">' + options.header + '</h4>'
    );

    var modal = $(template);

    // Inject the body
    modal.find('.modal-body').html(body);

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

    $("body").append(modal);

    modal.modal({
        keyboard : true,
        show     : true
    });

    modal.on('hidden.bs.modal', function() {
        modal.remove();
    });

    modal.on('shown.bs.modal', function() {
        modal.find('input:first').focus();
    });
};

