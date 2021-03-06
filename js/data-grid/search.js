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
    this.labels          = {
        fuzzySearch: 'Fuzzy search',
        searchFor: 'Search for'
    };

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
        placeholder = this.labels.fuzzySearch;
    } else {
        placeholder = this.labels.searchFor + placeholder.toLowerCase();
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

    var search = this.input.val();

    var params = params.concat([
        {name: 'search', value: search ? search.trim() : null},
        {name: 'sprop', value: this.input.attr('data-property')}
    ]);

    return params;
};

/**
 * Sets custom labels, e. g. for localizations.
 *
 * @param {Object} labels
 */
greppy.DataGrid.Search.prototype.setLabels = function(labels)
{
    $.extend(true, this.labels, labels);
};
