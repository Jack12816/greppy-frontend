/**
 * Greppy Frontend Application Class
 *
 * @version 0.8.1
 * @constructor
 */
var greppy = {};

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

/**
 * @constructor
 *
 * @param {Object} table - jQuery object of the table to  use for the DataGrid
 * @param {Object} [options] - Options to use for the DataGrid
 */
greppy.DataGrid = function(table, options)
{
    var s = new greppy.Styler();

    this.table     = table;
    this.search    = new greppy.DataGrid.Search(this, table);
    this.sort      = new greppy.DataGrid.Sort(this, table);
    this.paginator = new greppy.DataGrid.Pagination(this, table);
    this.options   = options || {};

    this.options.softDeletion = ('undefined' !== typeof options.softDeletion) ?
                                    options.softDeletion : true;

    this.options.url = options.url || document.URL;

    if (0 < table.length) {
        s.initOverlay(this.table, 'gDatagridLoading', 'gDatagridRebuilt');
    }

    // Wrap twitter bs events to prevent race conditions
    $('.btn').on({
        change : function(e) {
            setTimeout(function() {
                $(e.currentTarget).trigger('gChange');
            }, 20);
        }
    });
};

/**
 * Build URL with given params.
 *
 * @param {Array} params - Parameters to add to the request
 * @return {String}
 */
greppy.DataGrid.prototype.buildUrl = function(params)
{
    var self = this;
    var url  = this.options.url;
    params   = params || [];

    if (this.options.softDeletion) {

        if (true === $('#search-trash label').hasClass('active')) {

            params.unshift({
                name: 'filter',
                value: 'trash'
            });
        }
    }

    if (-1 === document.URL.indexOf('?')) {
        url += '?';
    }

    params.forEach(function(param) {

        if (param.value) {
            url += ('&' + param.name + '=' + encodeURIComponent(param.value));
        }
    });

    return url;
};

/**
 * Perform an AJAX request to load table rows
 * and fill the table with the results.
 *
 * @param {Array} params - Array of params to use for building the url
 * @param {Function} callback - Function to call on finish
 */
greppy.DataGrid.prototype.loadAndRebuild = function(params, callback)
{
    this.table.trigger('gDatagridLoading');

    var self = this;
    params   = params || [];

    var load = function(url) {

        $.ajax({
            type : "GET",
            url  : url
        }).done(callback);
    };

    var url = this.buildUrl(params);

    if ('function' === typeof this.options.preLoad) {

        this.options.preLoad(url, function(err, url) {

            if (err) {
                return;
            }

            load(url);
        });

    } else {
        load(url);
    }
};

/**
 * Reset all filters.
 */
greppy.DataGrid.prototype.reset = function()
{
    var self = this;

    var reset = function()
    {
        self.load(true, true, 1);
    };

    if ('function' === typeof this.options.preReset) {

        this.options.preReset(function(err) {

            if (err) {
                return;
            }

            reset();
        });

    } else {
        reset();
    }
};

/**
 * Load by all settings.
 *
 * @param {Boolean} [rows] - Load and build rows - Default: true
 * @param {Boolean} [pagination] - Load and build pagination - Default: true
 * @param {Integer} [page] - Pass page number to load (dont use the user-selected)
 */
greppy.DataGrid.prototype.load = function(rows, pagination, page)
{
    var self   = this;
    var params = [];

    if ('undefined' === typeof rows) {
        rows = true;
    }

    if ('undefined' === typeof pagination) {
        pagination = true;
    }

    params = params.concat(this.search.getParameters());
    params = params.concat(this.sort.getParameters());
    params = params.concat(this.paginator.getParameters(page));

    if (true === rows) {

        var rowParams = [].concat(params);
        rowParams.unshift({name: 'render', value: 'rows'});

        this.loadAndRebuild(rowParams, function(data) {
            self.table.find('tr').not(':first').remove();
            self.table.find('tbody').append(data);
            self.table.trigger('gDatagridRebuilt');
        });
    }

    if (true === pagination) {

        var paginationParams = [].concat(params);
        paginationParams.unshift({name: 'render', value: 'pagination'});

        this.loadAndRebuild(paginationParams, function(data) {
            $('.paginator').html(data);
        });
    }
};

/*
 * @constructor
 *
 * @param {Object} datagrid - DataGrid instance
 * @param {Object} datagridElement - jQuery Element of the datagrid
 */
greppy.DataGrid.Pagination = function(datagrid, datagridElement)
{
    var self             = this;
    var doc              = $(document);
    this.datagrid        = datagrid;
    this.datagridElement = datagridElement;
    this.page            = 1;

    // Bind events

    // Page clicked
    doc.on('click', '.pagination a[data-page]', function() {

        var page = $(this).attr('data-page');

        if (self.page == page) {
            return;
        }

        self.page = $(this).attr('data-page');
        self.datagrid.load();
    });

    // Page limit changed
    doc.on('change', '#pagination-limit', function() {
        self.datagrid.reset();
    });

    // Keyboard usage events
    doc.on('keydown', function(e) {

        // dont process event, if editing a text
        if ($('input, textarea').is(':focus')) {
            return;
        }

        // Left arrow pressed
        if (37 == e.keyCode) {
            self.page = (self.page > 0) ? self.page-1 : 1;
            self.datagrid.load();
        }

        // Right arrow pressed
        if (39 == e.keyCode) {

            var maxPage = 1;

            $('.pagination a[data-page]').each(function(idx, itm) {
                var val = parseInt($(itm).attr('data-page'));
                maxPage = (maxPage < val) ? val : maxPage;
            });

            self.page = (self.page < maxPage) ? self.page+1 : self.page;
            self.datagrid.load();
        }

        // Quick jump to page event (g)
        if (71 == e.keyCode) {

            greppy.app.dialog(
                [
                    '<div class="col-lg-5">',
                    '<input autofocus="autofocus" class="form-control" id="page-to-jump" ',
                    ' name="page-to-jump" type="number" placeholder="Page to jump to ..">',
                    '</div><br />',
                ].join(''),
                {
                    header: 'Quick page jump',
                    ok: function(callback) {

                        self.page = parseInt($('#page-to-jump').val());
                        self.datagrid.load();

                        callback && callback();
                    }
                }
            );
        }
    });
};

/**
 * Get all relevant parameters.
 *
 * @param {Integer} [page] - Page number to load
 * @return {Array}
 */
greppy.DataGrid.Pagination.prototype.getParameters = function(page)
{
    return [
        {name: 'page', value: page || this.page},
        {name: 'limit', value: $('#pagination-limit :selected').val()}
    ];
};

/**
 * @constructor
 *
 * @param {Object} datagrid - DataGrid instance
 * @param {Object} datagridElement - jQuery Element of the datagrid
 */
greppy.DataGrid.Search = function(datagrid, datagridElement)
{
    var self             = this;
    this.datagrid        = datagrid;
    this.datagridElement = datagridElement;
    this.input           = $('#search-input');
    this.trash           = $('#search-trash');

    // Setup datagrid table headers
    this.datagridElement.find($('th[data-property]')).each(function (idx, itm) {

        var th = $(itm);
        th.html($('<span>&nbsp;' + th.text() + '&nbsp;</span>'));
        th.prepend($('<i class="search-trigger fa fa-search text-muted"></i>'));
    });

    // Bind events

    // Search or trash button clicked
    $('#search-trash').on('gChange', function(e) {

        self.datagrid.paginator.page = 1;
        self.datagrid.load();
    });

    $('#search-btn').on('click', function() {
        self.datagrid.paginator.page = 1;
        self.datagrid.load();
    });

    // Search selector clicked
    $('.search-trigger').on('click', function() {
        var cur = $(this).parent();
        self.settings(cur.attr('data-property'), cur.text());
        $('#search-input').focus();
    });

    // Clear search button clicked
    $('#search-clear').on('click', function() {
        self.clear();
        self.settings('fuzzy');
        self.datagrid.reset();
    });

    // Pressed enter on search box
    $('#search-input').keypress(function(event){
        if (event.keyCode == 13) {
            $('#search-btn').trigger('click');
        }
    });
};

/**
 * Apply the search box settings.
 *
 * @params {String} property - Name of the property to search for
 * @params {String} placeholder - Placeholder of the search box
 */
greppy.DataGrid.Search.prototype.settings = function(property, placeholder)
{
    if ('fuzzy' == property) {
        placeholder = 'Fuzzy search';
    } else {
        placeholder = 'Search for' + placeholder.toLowerCase();
    }

    this.input.attr('placeholder', placeholder + '..')
              .attr('data-property', property);
};

/**
 * Clear the search box.
 */
greppy.DataGrid.Search.prototype.clear = function()
{
    this.input.val('');
};

/**
 * Get all relevant parameters.
 *
 * @return {Array}
 */
greppy.DataGrid.Search.prototype.getParameters = function()
{
    var params = [];

    if ('' == this.input.val()) {
        return params;
    }

    var params = params.concat([
        {name: 'search', value: this.input.val()},
        {name: 'sprop', value: this.input.attr('data-property')}
    ]);

    return params;
};

/**
 * @constructor
 *
 * @param {Object} datagrid - DataGrid instance
 * @param {Object} datagridElement - jQuery Element of the datagrid
 */
greppy.DataGrid.Sort = function(datagrid, datagridElement)
{
    var self             = this;
    this.datagrid        = datagrid;
    this.datagridElement = datagridElement;

    // Bind events

    // Table header clicked
    this.datagridElement.find($('th[data-property] span')).on('click', function() {
        self.toggle($(this).parent());
    });
};

/**
 * Toggle the sorting of a column.
 *
 * @param {Object} th - Table header to toggle
 */
greppy.DataGrid.Sort.prototype.toggle = function(th)
{
    this.datagridElement.find($('th[data-property]')).not(th).each(function(idx, item) {
        item = $(item);
        item.find('.direction').remove();
        item.attr('data-sort', '');
    });

    var dir = th.attr('data-sort');

    if (!dir) {
        th.append($('<i class="direction text-muted fa fa-arrow-down"></i>'));
        th.attr('data-sort', 'asc');
    }

    if ('asc' === dir) {
        th.find('.direction').removeClass('fa-arrow-down').addClass('fa-arrow-up');
        th.attr('data-sort', 'desc');
    }

    if ('desc' === dir) {
        th.find('.direction').remove();
        th.attr('data-sort', '');
    }

    if (!th.attr('data-sort')) {
        return this.datagrid.reset();
    }

    this.datagrid.load();
};

/**
 * Get all relevant parameters.
 *
 * @return {Array}
 */
greppy.DataGrid.Sort.prototype.getParameters = function()
{
    var th = this.datagridElement.find($('th[data-property]')).not($('[data-sort=""]'));

    if (0 === th.length || !th.attr('data-sort') || '' == th.attr('data-sort')) {
        return [];
    }

    return [
        {name: 'order', value: th.attr('data-sort')},
        {name: 'oprop', value: th.attr('data-property')}
    ]
};

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

/**
 * @constructor
 */
greppy.Styler.Number = function()
{
};

/**
 * Styles an input element to be adjustable via buttons.
 *
 * @param {String|jQuery} el The element(s) to style
 */
greppy.Styler.Number.prototype.style = function(el)
{
    var self = this;

    el = $(el);

    el.each(function(idx, el) {

        el = $(el);

        self.validate(el);
        self.handleCleanup(el);
        self.addStyles(el);
        self.addButtonHandlers(el);
    });
};

/**
 * Helper function which ensures el fits the requirements.
 *
 * @param {jQuery} el
 */
greppy.Styler.Number.prototype.validate = function(el)
{
    if ('INPUT' !== el.prop('tagName')) {
        throw new Error('Element needs to be an input');
    }
};

/**
 * Decides wether to cleanup the passed element.
 *
 * @param {jQuery} el
 */
greppy.Styler.Number.prototype.handleCleanup = function(el)
{
    if (this.isNumber(el)) {
        this.clearStyled(el);
    }
};

/**
 * Adds style markup to the element.
 *
 * @param {jQuery} el
 */
greppy.Styler.Number.prototype.addStyles = function(el)
{
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
};

/**
 * Adds spinner buttons to the provided element.
 *
 * @param {jQuery} el
 */
greppy.Styler.Number.prototype.addButtonHandlers = function(el)
{
    var self = this;

    el.next('.input-group-btn').find('.g-add').on('click', function() {

        var val = self.getAddedVal(el);

        el.val(val)
            .trigger('change');
    });

    el.next('.input-group-btn').find('.g-substract').on('click', function() {

        var val = self.getSubtractedVal(el);

        el.val(val)
            .trigger('change');
    });
};

/**
 * Returns the normalized number of the passed element.
 *
 * @param {jQuery} el
 * @returns {Number}
 */
greppy.Styler.Number.prototype.getVal = function(el)
{
    return (isNaN(parseInt(el.val(), 10))) ? 0 : parseInt(el.val(), 10);
};

/**
 * Returns the added number of the passed element.
 *
 * @param {jQuery} el
 * @returns {Number}
 */
greppy.Styler.Number.prototype.getAddedVal = function(el)
{
    var val = this.getVal(el);

    return (el.attr('data-max') < (val + 1)) ? val : val + 1;
};

/**
 * Returns the subtracted number of the passed element.
 *
 * @param {jQuery} el
 * @returns {Number}
 */
greppy.Styler.Number.prototype.getSubtractedVal = function(el)
{
    var val = this.getVal(el);

    return (el.attr('data-min') > (val - 1)) ? val : val - 1;
};

/**
 * Determines wether the passed element is a number-styled input.
 *
 * @param {jQuery} el
 * @returns {Boolean}
 */
greppy.Styler.Number.prototype.isNumber = function(el)
{
    if (el.parent().hasClass('greppy-container-num')) {
        return true;
    }

    return false;
};

/**
 * Clears an input from remaining stuff of Greppy number to get a plain input.
 *
 * @param {jQuery} el
 */
greppy.Styler.Number.prototype.clearStyled = function(el)
{
    el.unwrap();
    el.next('.input-group-btn').remove();
    el.off();
};
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
/**
 * @constructor
 */
greppy.Validator = function()
{
};

/**
 * Initializes greppy validators.
 */
greppy.Validator.prototype.init = function ()
{
    var self           = this;
    this.allValidators = $('input, select, textarea').filter('.greppy-validator');
    this.events        = [];

    this.bindEvent('invalid', 'gValidationInvalid');
    this.bindEvent('change', 'gValidationUpdate');
    this.bindEvent('keyup', 'gValidationUpdate');

    $(document).on({
        gValidationUpdate: function(e) {

            // check if it's valid or invalid
            self.validate(e.target);
        },
        gValidationInvalid: function(e) {

            self.markInvalid(self.getMark(e.target));
            self.showMsg(e.target);

            e.preventDefault();
        }
    });
};

/**
 * Bind an event to trigger Greppy validator events.
 *
 * @param {String} origEvtName Name of the event to be bound.
 * @param {String} gEvtName May be 'gValidationInvalid' or 'gValidationUpdate'.
 */
greppy.Validator.prototype.bindEvent = function(origEvtName, gEvtName)
{
    var self = this;

    if ('gValidationInvalid' !== gEvtName && 'gValidationUpdate' !== gEvtName) {
        throw new Error('No such Greppy validator event exists: ' + gEvtName);
    }

    this.events.push({
        origEvtName : origEvtName,
        gEvtName    : gEvtName
    });

    $(this.allValidators).each(function(idx, el) {
        self.bindEventToValidator(el, origEvtName, gEvtName);
    });
};

/**
 * This binds an element's event to a specified greppy Validator event.
 *
 * @param {jQuery} validator
 * @param {String} origEvtName
 * @param {String} gEvtName
 */
greppy.Validator.prototype.bindEventToValidator = function(validator,
        origEvtName, gEvtName)
{
    validator = $(validator);

    validator.on(origEvtName, function(e) {
        $(this).trigger(gEvtName);

        if ('gValidationInvalid' === gEvtName) {
            e.preventDefault();
        }
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
    el = $(el);
    var name = el.attr('name');
    var result;

    if (null === name) {
        return el;
    }

    result = el.parents('*[data-greppy-validator-mark="' + name + '"]');

    if (0 === result.length && el.hasClass('multiselect')) {
        result = el.nextAll('.btn-group');
    }

    return 0 < result.length ? result : el;
};

/**
 * Add a validator to the current set of validators.
 *
 * @param {type} el
 * @returns {undefined}
 */
greppy.Validator.prototype.addValidator = function(el)
{
    if (!$(el).hasClass('greppy-validator')) {
        throw new Error('Element passed is not a Greppy validator!');
    }

    this.allValidators.add(el);
    this.bindAllEventsToValidator(el);
};

/**
 * Applies the defined events to the specified validator.
 *
 * @param {jQuery} validator
 */
greppy.Validator.prototype.bindAllEventsToValidator = function(validator)
{
    var self = this;

    this.events.forEach(function(el, idx) {
        self.bindEventToValidator(validator, el.origEvtName, el.gEvtName);
    });
};

/**
 * Validates an element.
 *
 * @param {Object} el The element to validate.
 */
greppy.Validator.prototype.validate = function (el)
{
    if (false === el.checkValidity()) {

        this.markInvalid(this.getMark(el));
        //this.showMsg(el);
        return;
    }

    this.removeInvalidMark(this.getMark(el));
    this.removeMsg(this.getMark(el));
};

/**
 * Marks the provided element as invalid.
 *
 * @param {Object} el
 */
greppy.Validator.prototype.markInvalid = function(el)
{
    $(el).addClass('greppy-validator-invalid');
};

/**
 * Removes an invalid mark from the provided element.
 *
 * @param {Object} el
 */
greppy.Validator.prototype.removeInvalidMark = function(el)
{
    $(el).removeClass('greppy-validator-invalid');
};

/**
 * Shows the validation message of a provided element.
 *
 * @param {type} el
 */
greppy.Validator.prototype.showMsg = function(el)
{
    //el       = this.getUniqueValidator(el);
    el       = $(el);
    var mark = this.getMark(el);
    var self = this;

    if (this.hasActiveMsg(el)) {
        return;
    }

    $('<div class="greppy-validator-msg btn btn-danger" data-greppy-validator-name="' + el.attr('name') + '" />')
    .html(mark.attr('data-greppy-validator-msg') || el.attr('data-greppy-validator-msg') || 'Validation failed')
    .insertAfter(mark)
    .hide()
    .fadeIn()
    .css({
        top: mark.position().top + mark.outerHeight() + 4,
        left: mark.position().left
    })
    .on('mouseleave', function() {
        self.removeMsg(mark);
    });
};

/**
 * Returns wether the passed element has an active message.
 *
 * @param {jQuery} el
 * @returns {Boolean}
 */
greppy.Validator.prototype.hasActiveMsg = function(el)
{
    var name = el.attr('name');
    var mark = this.getMark(el);

    if (name && mark.nextAll('.greppy-validator-msg[data-greppy-validator-name="' + name + '"]').length) {
        return true;
    }

    return false;
};

/**
 * Removes the msg-element of a provided mark element, if there's any.
 *
 * @param {Object} el The mark element
 * @param {Boolean} fast No fading out; fast removing.
 */
greppy.Validator.prototype.removeMsg = function(el, fast)
{
    el = $(el).nextAll('.greppy-validator-msg');

    if (fast) {
        el.remove();
        return;
    }

    el.fadeOut(function() {
        el.remove();
    });
};
greppy.app = new greppy.Application();

