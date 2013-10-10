/**
 * @constructor
 */
greppy.DataGrid = function(table, options)
{
    var s = new greppy.Styler();

    this.table    = table;
    this.search   = new greppy.Search(this, table);
    this.sort     = new greppy.Sort(this, table);
    this.paginate = new greppy.Paginator(this, table);
    this.options  = options;

    this.options.softDeletion = ('undefined' !== typeof options.softDeletion) ?
                                    options.softDeletion : true;

    s.initOverlay(this.table, 'gDatagridLoading', 'gDatagridRebuilt');

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
 * @return void
 */
greppy.DataGrid.prototype.buildUrl = function(params)
{
    var self = this;
    var url  = document.URL;
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
        url += ('&' + param.name + '=' + encodeURIComponent(param.value));
    });

    return url;
};

/**
 * Perform an AJAX request to load table rows
 * and fill the table with the results.
 *
 * @return void
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
    }

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
 *
 * @return void
 */
greppy.DataGrid.prototype.reset = function()
{
    var reset = function()
    {
        this.load(true, true, 1);
    }

    if ('function' === typeof this.options.preReset) {

        this.options.preReset(url, function(err) {

            if (err) {
                return;
            }

            reset();
        });

    } else {
        load();
    }
};

/**
 * Load by all settings.
 *
 * @return void
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

    if (rows || pagination) {
        self.table.trigger('gDatagridRebuilt');
    }

    params = params.concat(this.search.getParameters());
    params = params.concat(this.sort.getParameters());
    params = params.concat(this.paginate.getParameters(page));

    if (true === rows) {

        var rowParams = [].concat(params);
        rowParams.unshift({name: 'render', value: 'rows'});

        this.loadAndRebuild(rowParams, function(data) {
            self.table.find('tr').not(':first').remove();
            self.table.find('tbody').append(data);
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

