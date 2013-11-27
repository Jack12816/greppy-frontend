describe('Greppy', function() {

    describe('data-grid', function() {

        var rebuiltEventName = 'gDatagridRebuilt';

        it('exists', function() {

            expect($('table.datagrid').length).to.equal(1);
        });

        it('should reload when clicking the search button', function(done) {

            execOnceOnEvent(rebuiltEventName, done);

            $('#search-btn').trigger('click');
        });

        it('should not reload when clicking a currently selected ' +
                'pagination', function(done) {

            throwOnceOnEvent(rebuiltEventName);

            $('ul.pagination li.active a').first().click();

            setTimeout(function() {

                $(document).off(rebuiltEventName);
                done();
            }, 80);
        });

        it('should not reload when clicking a currently disabled pagination',
                function(done) {

            throwOnceOnEvent(rebuiltEventName);

            $('ul.pagination li.disabled a').first().click();

            setTimeout(function() {

                $(document).off(rebuiltEventName);
                done();
            }, 80);
        });

        it('should reload when clicking the first currently non-selected ' +
                'pagination item', function(done) {

            execOnceOnEvent(rebuiltEventName, done);

            $('ul.pagination li:not(.disabled):not(.active)').first().find('a').click();
        });

        it('should reload when changing the pagination-limit', function(done) {

            execOnceOnEvent(rebuiltEventName, done);

            triggerPaginationLimit(25);
        });

        it('should be able to switch to the next page after changing the ' +
                'pagination-limit', function(done) {

            // handler for rebuilt fired by pagination-limit change
            execOnceOnEvent(rebuiltEventName, function() {

                // handler for rebuilt fired by pagination-button-click
                execOnceOnEvent(rebuiltEventName, done);

                $('ul.pagination li.active').next().find('a').click();
            });

            triggerPaginationLimit(10);
        });

        it('should show the correct amount of entries for the selected ' +
                'pagination-limit', function(done) {

            execOnceOnEvent(rebuiltEventName, function() {

                expect(getTableEntryCount()).to.equal(25);
                done();
            });

            triggerPaginationLimit(25);
        });

        it('should set the current page to 1 after changing the ' +
                'pagination-limit', function(done) {

            execOnceOnEvent(rebuiltEventName, function() {

                expect(getActivePageNumber()).to.equal('1');
                done();
            });

            triggerPaginationLimit(10);
        });

        it('should focus the search box when clicking on a column icon',
                function(done) {

            $(document).one('focus', '#search-input', function() {

                done();
            });

            $('th[data-property="title"] i.search-trigger').click();
        });

        it('should rebuild when clicking on a column title',
                function(done) {

            execOnceOnEvent(rebuiltEventName, done);

            $('th[data-property="title"] span').click();
        });

        it('should rebuild when clicking the filter reset button',
                function(done) {

            execOnceOnEvent(rebuiltEventName, done);

            $('#search-clear').click();
        });
    });
});

function throwOnceOnEvent(evtName) {

    $(document).one(evtName, function() {

        throw new Error('Event ' + evtName + ' should not be triggered!');
    });
}

function execOnceOnEvent(evtName, exec) {

    $(document).one(evtName, function() {

        exec();
    });
};

function getTableEntryCount() {

    return $('table.datagrid tbody tr').length;
}

function getActivePageNumber() {

    return $('ul.pagination li.active a').text();
}

function triggerPaginationLimit(limit) {

    $('#pagination-limit').val(limit).trigger('change');
}
