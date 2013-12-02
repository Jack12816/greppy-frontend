var rebuiltEventName = 'gDatagridRebuilt';
var loadingEventName = 'gDatagridLoading';

describe('Greppy', function() {

    describe('data-grid', function() {

        it('exists', function() {

            expect($('table.datagrid').length).to.equal(1);
        });

        describe('rebuilding', function() {

            it('should be triggered when clicking the search button',
                    function(done) {

                doneAfterEvent(rebuiltEventName, done);

                $('#search-btn').trigger('click');
            });

            it('should be triggered when clicking the first currently ' +
                    'non-selected pagination item', function(done) {

                doneAfterEvent(rebuiltEventName, done);

                $('ul.pagination li:not(.disabled):not(.active)').first()
                        .find('a').click();
            });

            it('should be triggered when changing the pagination-limit',
                    function(done) {

                doneAfterEvent(rebuiltEventName, done);

                changePaginationLimitTo(25);
            });

            it('should be triggered when clicking on a column title',
                    function(done) {

                doneAfterEvent(rebuiltEventName, done);

                $('th[data-property="title"] span').click();
            });

            it('should be triggered when clicking the filter reset button',
                    function(done) {

                doneAfterEvent(rebuiltEventName, done);

                $('#search-clear').click();
            });

            it('should not be triggered when clicking a currently selected ' +
                    'pagination', function(done) {

                throwOnceOnEvent(rebuiltEventName);

                $('ul.pagination li.active a').first().click();

                setTimeout(function() {

                    $(document).off(rebuiltEventName);
                    done();
                }, 80);
            });

            it('should not be triggered when clicking a currently disabled ' +
                    'pagination', function(done) {

                throwOnceOnEvent(rebuiltEventName);

                $('ul.pagination li.disabled a').first().click();

                setTimeout(function() {

                    $(document).off(rebuiltEventName);
                    done();
                }, 80);
            });
        });

        it('should be able to switch to the next page after changing the ' +
                'pagination-limit', function(done) {

            // handler for rebuilt fired by pagination-limit change
            execOnceOnEvent(rebuiltEventName, function() {

                // handler for rebuilt fired by pagination-button-click
                doneAfterEvent(rebuiltEventName, done);

                $('ul.pagination li.active').next().find('a').click();
            });

            changePaginationLimitTo(10);
        });

        it('should show the correct amount of entries for the selected ' +
                'pagination-limit', function(done) {

            execOnceOnEvent(rebuiltEventName, function() {

                expect(getTableEntryCount()).to.equal(25);
                done();
            });

            changePaginationLimitTo(25);
        });

        it('should set the current page to 1 after changing the ' +
                'pagination-limit', function(done) {

            execOnceOnEvent(rebuiltEventName, function() {

                expect(getActivePageNumber()).to.equal(1);
                done();
            });

            changePaginationLimitTo(10);
        });

        it('should focus the search box when clicking on a column icon',
                function(done) {

            $(document).one('focus', '#search-input', function() {

                done();
            });

            $('th[data-property="title"] i.search-trigger').click();
        });

        describe('sending correct requests', function() {

            it('should work for a page change to the next page', function(done) {

                var nextPage = getActivePageNumber() + 1;

                $(document).one(loadingEventName, function(e) {

                    throwIfQueryStringDoesntMatch(e.url, 'render', 'rows');
                    throwIfQueryStringDoesntMatch(e.url, 'page', nextPage);

                    doneAfterEvent(rebuiltEventName, done);
                });

                clickNextPageButton();
            });

            it('should work for a page change to the previous page', function(done) {

                var prevPage = getActivePageNumber() - 1;

                $(document).one(loadingEventName, function(e) {

                    throwIfQueryStringDoesntMatch(e.url, 'render', 'rows');
                    throwIfQueryStringDoesntMatch(e.url, 'page', prevPage);

                    doneAfterEvent(rebuiltEventName, done);
                });

                clickPrevPageButton();
            });

            it('should work for an ascending sorting of a column',
                    function(done) {

                resetDatagridAndSortingThen(function() {

                    clickContentSortingThen(function(err, e) {

                        throwIfQueryStringDoesntMatch(e.url, 'render',
                                'rows');

                        throwIfQueryStringDoesntMatch(e.url, 'oprop',
                                'content');

                        throwIfQueryStringDoesntMatch(e.url, 'order',
                                'asc');

                        doneAfterEvent(rebuiltEventName, done);
                    });
                });
            });

            it('should work for a descending sorting of a column',
                    function(done) {

                resetDatagridAndSortingThen(function() {

                    clickContentSortingThen(function() {

                        clickContentSortingThen(function(err, e) {

                            throwIfQueryStringDoesntMatch(e.url, 'render',
                                    'rows');

                            throwIfQueryStringDoesntMatch(e.url, 'oprop',
                                    'content');

                            throwIfQueryStringDoesntMatch(e.url, 'order',
                                    'desc');

                            doneAfterEvent(rebuiltEventName, done);
                        });
                    });
                });
            });

            it('should work for a reset sorting of a column',
                    function(done) {

                // TODO: get async-solution to work, remove current solution
                /*async.waterfall([

                    resetDatagridAndSortingThen,
                    clickContentSortingThen,
                    clickContentSortingThen,
                    clickContentSortingThen
                ], function(err, result) {

                    console.log(result.url);
                    doneAfterEvent(rebuiltEventName, done);
                });*/

                resetDatagridAndSortingThen(function() {

                    clickContentSortingThen(function() {

                        clickContentSortingThen(function() {

                            clickContentSortingThen(function(err, e) {

                                throwIfQueryStringDoesntMatch(e.url,
                                        'render', 'rows');

                                throwIfQueryStringHasKey(e.url,
                                        'oprop');

                                throwIfQueryStringHasKey(e.url,
                                        'order');

                                doneAfterEvent(rebuiltEventName, done);
                            });
                        });
                    });
                });
            });

            it('should work for a column specific search', function(done) {

                var searchTerm = 'xyz';

                execOnceOnEvent(loadingEventName, function(err, e) {

                    throwIfQueryStringDoesntMatch(e.url, 'search', searchTerm);
                    throwIfQueryStringDoesntMatch(e.url, 'sprop', 'content');

                    doneAfterEvent(rebuiltEventName, done);
                });

                clickContentSearch();

                enterSearchTerm(searchTerm);

                clickSearchButton();
            });
        });
    });
});

function throwOnceOnEvent(evtName) {

    $(document).one(evtName, function() {

        throw new Error('Event ' + evtName + ' should not be triggered!');
    });
}

function throwIfQueryStringDoesntMatch(qs, key, val) {

    var isMatching = doesQueryStringMatch(qs, key, val);

    if (!isMatching) {
        throw new Error('Query string doesn\'t match "' + key + '=' + val +
            '": ' + qs);
    }
}

function doesQueryStringMatch(qs, key, val) {

    var keyVal      = key + '=' + val;
    var regExpStart = new RegExp('/\?' + keyVal + '$/');
    var regExpEnd   = new RegExp('&' + keyVal + '$');

    if (-1 < qs.indexOf('?' + keyVal + '&') ||
            qs.match(regExpStart) ||
            -1 < qs.indexOf('&' + keyVal + '&') ||
            qs.match(regExpEnd)) {

        return true;
    }

    return false;
}

function hasQueryStringKey(qs, key) {

    if (-1 < qs.indexOf('?' + key + '=') ||
            -1 < qs.indexOf('&' + key + '=')) {

        return true;
    }

    return false;
}

function throwIfQueryStringHasKey(qs, key) {

    if (hasQueryStringKey(qs, key)) {

        throw new Error('Query string has forbidden key: ' + key);
    }
}

function execOnceOnEvent(evtName, exec) {

    $(document).one(evtName, function() {

        var myArgs = Array.prototype.slice.call(arguments);
        myArgs.unshift(null);

        exec.apply(this, myArgs);
    });
}

function doneAfterEvent(evtName, done) {

    $(document).one(evtName, function() {

        done();
    });
}

function getTableEntryCount() {

    return $('table.datagrid tbody tr').length;
}

function getActivePageNumber() {

    return parseInt($('ul.pagination li.active a').text(), 10);
}

function changePaginationLimitTo(limit) {

    $('#pagination-limit').val(limit).trigger('change');
}

function clickNextPageButton() {

    $('ul.pagination li').last().find('a').click();
}

function clickPrevPageButton() {

    $('ul.pagination li').first().find('a').click();
}

function clickContentSorting() {

    $('th[data-property="content"] span').click();
}

function clickContentSearch() {

    $('th[data-property="content"] i.search-trigger').trigger('click');
}

function clickSearchButton() {

    $('#search-btn').trigger('click');
}

function enterSearchTerm(searchTerm) {

    $('#search-input').val(searchTerm);
}

function resetDatagridAndSortingThen(exec) {

    $('#reset-datagrid-and-sorting').click();

    execOnceOnEvent(rebuiltEventName, function() {

        exec();
    });
}

function clickContentSortingThen(exec) {

    $(document).one(loadingEventName, function() {

        if ('function' !== typeof exec) {
            throw new Error('The specified callback isn\'t a function');
        }

        var myArgs = Array.prototype.slice.call(arguments);
        myArgs.unshift(null);

        exec.apply(null, myArgs);
    });

    clickContentSorting();
}
