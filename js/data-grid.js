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

    s.initOverlay(this.table, 'loading.datagrid.g', 'rebuilt.datagrid.g');

    // Wrap twitter bs events to prevent race conditions
    $('.btn').on({
        change : function(e) {
            setTimeout(function() {
                $(e.currentTarget).trigger('change.g');
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

        if (true == $('#search-trash label').hasClass('active')) {

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
greppy.DataGrid.prototype.loadAndRebuild = function(params)
{
    var self = this;
    params   = params || [];
    params.unshift({name: 'render', value: 'rows'});

    this.paginate.load();

    $.ajax({
        type : "GET",
        url  : this.buildUrl(params)
    }).done(function(data) {
            self.table.find('tr').not(':first').remove();
            self.table.find('tbody').append(data);
            self.table.trigger('rebuilt.datagrid.g');
    });

    this.table.trigger('loading.datagrid.g');
};

/**
 * Reset all filters.
 *
 * @return void
 */
greppy.DataGrid.prototype.reset = function()
{
    this.loadAndRebuild(this.paginate.getParameters());
    this.paginate.load(1);
};

/**
 * Load by all settings.
 *
 * @return void
 */
greppy.DataGrid.prototype.load = function()
{
    var params = [];

    params = params.concat(this.search.getParameters());
    params = params.concat(this.sort.getParameters());
    params = params.concat(this.paginate.getParameters());

    this.loadAndRebuild(params);
};

