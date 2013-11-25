describe('Greppy', function() {

    describe('data-grid', function() {

        it('exists', function() {

            expect($('table.datagrid').length).to.equal(1);
        });

        it('should display an overlay when clicking the search button',
                function(done) {

            $('#search-btn').trigger('click');

            // TODO: finish
            
            done();
        });
    });
});
