/**
 * Fixture js which is executed at the bottom (before the tests) of data-grid.html
 */

$(function() {

    $('#mocha').hide();

    $('#reset-datagrid-and-sorting').on('click', function() {
        datagrid.sort.remove();
        datagrid.reset();
    });

    $('#show-mocha-results').on('click', function() {
        $('#mocha').slideToggle();
    });

});
