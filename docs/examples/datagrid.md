## Data-Grid

### Pass additional data to the backend

    /**
     * Build DataGrid instances for the whole index page
     */
    var datagrid = new greppy.DataGrid($('table.datagrid'), {
      softDeletion: true,
      preLoad: function(url, callback) {

        // You can modify the url, to pass additional data to the backend
        callback && callback(null, url + '&addon=text');
      }
    });

