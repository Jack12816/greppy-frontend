/*
 * @constructor
 */
greppy.Paginator = function(datagrid, datagridElement)
{
    var self             = this;
    var doc              = $(document);
    this.datagrid        = datagrid;
    this.datagridElement = datagridElement;
    this.page            = 1;

    // Bind events

    // Page clicked
    doc.on('click', '.pagination a[data-page]', function() {
        self.page = $(this).attr('data-page');
        self.datagrid.load();
    });

    // Page limit changed
    doc.on('change', '#pagination-limit', function() {
        self.page = 1;
        self.datagrid.load();
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
            self.load();
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
            self.load();
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
                        self.load();

                        callback && callback();
                    }
                }
            );
        }
    });
};

/**
 * Load the pagination partial.
 *
 * @param {Integer} [page] - Page number to load
 * @return void
 */
greppy.Paginator.prototype.load = function(page)
{
    var params = [];

    params = params.concat(this.datagrid.search.getParameters());
    params = params.concat(this.datagrid.sort.getParameters());
    params = params.concat(this.datagrid.paginate.getParameters(page));

    params.unshift({name: 'render', value: 'pagination'});

    $.ajax({
        type : "GET",
        url  : this.datagrid.buildUrl(params)
    }).done(function(data) {
        $('.paginator').html(data);
    });
};

/**
 * Get all relevant parameters.
 *
 * @param {Integer} [page] - Page number to load
 * @return void
 */
greppy.Paginator.prototype.getParameters = function(page)
{
    return [
        {name: 'page', value: page || this.page},
        {name: 'limit', value: $('#pagination-limit :selected').val()}
    ];
};

