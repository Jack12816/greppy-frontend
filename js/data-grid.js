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

    if (this.options.labels) {
        this.setProvidedLabels();
    }

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

/**
 * Apply each label provided via options to compatible instances.
 */
greppy.DataGrid.prototype.setProvidedLabels = function()
{
    for (var prop in this.options.labels) {

        if (this[prop] && this[prop].setLabels) {

            this[prop].setLabels(this.options.labels[prop]);
        }
    }
};
