/**
 * Class for sanitizing input of all kinds.
 *
 * @constructor
 */
greppy.Sanitizer = function()
{
};

/**
 * Converts a given string or object to a jQuery object and checks for it's existence.
 *
 * @param {String|Object} elem
 * @returns {Object} jQuery-object
 */
greppy.Sanitizer.prototype.toJquery = function(elem)
{
    elem = ('string' === typeof elem) ? $(elem) : elem;

    if ('undefined' === typeof elem || elem.length === 0) {
        throw new Error('No element(s) found!');
    }

    return elem;
};

/**
 * Throws an error if a jQuery object contains more than one element.
 *
 * @param {Object} elem jQuery object
 */
greppy.Sanitizer.prototype.assertSingle = function(elem)
{
    if (elem.length !== 1) {
        throw new Error('Expected 1 element, got ' + elem.length);
    }
};

