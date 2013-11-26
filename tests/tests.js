describe('Greppy', function() {

    describe('data-grid', function() {

        var rebuiltEventName = 'gDatagridRebuilt';

        it('exists', function() {

            expect($('table.datagrid').length).to.equal(1);
        });

        it('should reload when clicking the search button',
                function(done) {

            $(document).one(rebuiltEventName, function() {

                done();
            });

            $('#search-btn').trigger('click');
        });

        it('should not reload when clicking a currently selected ' +
                'pagination', function(done) {

            throwOnRebuilt(rebuiltEventName);

            $('ul.pagination li.active a').first().click();

            setTimeout(function() {

                $(document).off(rebuiltEventName);
                done();
            }, 80);
        });

        it('should not reload when clicking a currently disabled pagination',
                function(done) {

            throwOnRebuilt(rebuiltEventName);

            $('ul.pagination li.disabled a').first().click();

            setTimeout(function() {

                $(document).off(rebuiltEventName);
                done();
            }, 80);
        });

        it('should reload when clicking the first currently nonselected ' +
                'pagination item', function(done) {

            $(document).one(rebuiltEventName, function() {

                done();
            });

            $('ul.pagination li:not(.disabled):not(.active)').first().find('a').click();
        });

        it('should reload when changing the pagination-limit', function(done) {

            $(document).one(rebuiltEventName, function() {

                done();
            });

            $('#pagination-limit').val('25').trigger('change');
        });

        it('should be able to switch to the next page after changing the ' +
                'pagination-limit', function(done) {

            // handler for rebuilt fired by pagination-limit change
            $(document).one(rebuiltEventName, function() {

                // handler for rebuilt fired by pagination-button-click
                $(document).one(rebuiltEventName, function() {

                    done();
                });

                $('ul.pagination li.active').next().find('a').click();
            });

            $('#pagination-limit').val('10').trigger('change');
        });
    });
});

function throwOnRebuilt(rebuiltEventName) {

    $(document).one(rebuiltEventName, function() {

        throw new Error('Event should not be triggered!');
    });
}
