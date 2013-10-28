/**
 * @constructor
 */
greppy.Validator = function()
{
};

greppy.Validator.prototype.init = function ()
{
    var self       = this;
    var validators = $('*[data-greppy-validator-validate]');

    validators.on('invalid', function(e) {
        $(this).trigger('gValidationInvalid');
        e.preventDefault();
    });

    validators.on('change', function() {
        $(this).trigger('gValidationUpdate');
    });

    $(document).on('gValidationUpdate', function(e) {

        // check if it's valid or invalid
        self.validate(e.target);
    });

    $(document).on('gValidationInvalid', function(e) {
        self.markInvalid(self.getMark(e.target));
        self.showMsg(e.target);
        e.preventDefault();
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
    var id = $(el).attr('data-greppy-validator-id');
    var result;

    if (null === id) {
        return el;
    }

    result = $('*[data-greppy-validator-mark][data-greppy-validator-id="' + id + '"]');

    return 0 < result.length ? result : el;
};

greppy.Validator.prototype.validate = function (el)
{
    if (false === el.checkValidity()) {

        this.markInvalid(this.getMark(el));
        this.showMsg(el);
    } else {

        this.removeInvalid(this.getMark(el));
    }
};

greppy.Validator.prototype.markInvalid = function(el)
{
    $(el).addClass('greppy-validator-invalid');
};

greppy.Validator.prototype.removeInvalid = function(el)
{
    $(el).removeClass('greppy-validator-invalid');
};

greppy.Validator.prototype.showMsg = function(el)
{
    el = $(el);
    var mark = this.getMark(el);

    $('<div class="greppy-validator-msg" />')
        .text(el.attr('data-greppy-validator-msg') + ' blaa')
        .insertAfter(el)
        .css({
            top: mark.position().top + mark.outerHeight(),
            left: mark.position().left
        })
        .on('mouseleave', function() {
            $(this).fadeOut(function() {
                $(this).remove();
            });
        });
};
