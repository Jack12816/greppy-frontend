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

