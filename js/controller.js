/**
 * @constructor
 */
greppy.Controller = function(options)
{
    var self = this;

    Object.keys(options).forEach(function(key) {
        self[key] = options[key];
    });
};

/**
 * Build a link to an action.
 *
 * @param {String} action - Name of the action to link to
 * @param {Object} params - Parameters object
 * @return {String}
 */
greppy.Controller.prototype.link = function(action, params)
{
    if (!this.actions.hasOwnProperty(action)) {
        throw new Error(
            'Action "' + action + '" is not registered for the controller'
        );
        return;
    }

    var link = this.basePath + this.actions[action].path;

    if (params) {

        Object.keys(params).forEach(function(param) {
            link = link.replace(new RegExp(':' + param + '[\?]?', 'ig'), params[param]);
        });
    }

    return link;
};

