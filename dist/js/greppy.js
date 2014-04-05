/*!
 * @name greppy-frontend
 * @date 2014-04-05 22:34
 * @version 0.10.0
 */
/**
 * Greppy Frontend Basis Class
 *
 * @constructor
 */
var greppy = {};

/**
 * @constructor
 */
greppy.Application = function() {}, /**
 * Start a bootstrap modal easily.
 *
 * @param {String|Object} body - Body of the modal
 * @param {Object} options - Options for the modal
 * @param {Array} buttons - Buttons declarations
 */
greppy.Application.prototype.dialog = function(a, b, c) {
    b = b || {}, b.header = b.header || "Confirmation required", b.keyboard = "undefined" == typeof b.keyboard ? !0 : b.keyboard, 
    b.show = "undefined" == typeof b.show ? !0 : b.show, b.closeBtn = "undefined" == typeof b.closeBtn ? !0 : b.closeBtn, 
    b.template = b.template || '<div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header">' + (!1 === b.closeBtn ? "" : '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>') + '{{header}}</div><div class="modal-body"></div><div class="modal-footer"></div></div></div></div>', 
    b.template = b.template.replace("{{header}}", '<h4 class="modal-title">' + b.header + "</h4>");
    var d = $(b.template);
    // Inject the body
    // Default buttons
    // Build buttons and bind events
    // Add modal partial to the body
    // Setup the Bootstrap modal
    // Bind on-hide event
    // Bind on-show event
    return d.find(".modal-body").html(a), c = c || [ {
        label: "Cancel",
        "class": "btn btn-default",
        icon: "fa-times",
        callback: b.cancel || function(a) {
            a();
        }
    }, {
        label: "Ok",
        "class": "btn btn-primary",
        icon: "fa-check",
        callback: b.ok || function(a) {
            a();
        }
    } ], c.forEach(function(a) {
        var b = $('<a href="#" class="' + a.class + '"><i class="fa ' + a.icon + '"></i> ' + a.label + "</a>");
        // Bind callbacks
        b.click(function() {
            return a.callback(function() {
                d.modal("hide");
            }), !1;
        }), d.find(".modal-footer").append(b);
    }), $("body").append(d), console.log(b), d.modal(b), d.on("hidden.bs.modal", function() {
        // Bind close btn if necessary
        // Bind close btn if necessary
        return "function" == typeof b.close ? b.close(function() {
            d.remove();
        }) : void d.remove();
    }), d.on("shown.bs.modal", function() {
        d.find("input:first").focus();
    }), d;
}, /**
 * @constructor
 */
greppy.Controller = function(a) {
    var b = this;
    Object.keys(a).forEach(function(c) {
        b[c] = a[c];
    });
}, /**
 * Build a link to an action.
 *
 * @param {String} action - Name of the action to link to
 * @param {Object} params - Parameters object
 * @return {String}
 */
greppy.Controller.prototype.link = function(a, b) {
    if (!this.actions.hasOwnProperty(a)) throw new Error('Action "' + a + '" is not registered for the controller');
    var c = this.basePath + this.actions[a].path;
    return b && Object.keys(b).forEach(function(a) {
        c = c.replace(new RegExp(":" + a + "[?]?", "ig"), b[a]);
    }), c;
}, /**
 * @constructor
 */
greppy.Validator = function() {}, /**
 * Initializes greppy validators.
 */
greppy.Validator.prototype.init = function() {
    var a = this;
    this.allValidators = $("input, select, textarea").filter(".greppy-validator"), this.events = [], 
    this.bindEvent("invalid", "gValidationInvalid"), this.bindEvent("change", "gValidationUpdate"), 
    this.bindEvent("keyup", "gValidationUpdate"), $(document).on({
        gValidationUpdate: function(b) {
            // check if it's valid or invalid
            a.validate(b.target);
        },
        gValidationInvalid: function(b) {
            a.markInvalid(a.getMark(b.target)), a.showMsg(b.target), b.preventDefault();
        }
    });
}, /**
 * Bind an event to trigger Greppy validator events.
 *
 * @param {String} origEvtName Name of the event to be bound.
 * @param {String} gEvtName May be 'gValidationInvalid' or 'gValidationUpdate'.
 */
greppy.Validator.prototype.bindEvent = function(a, b) {
    var c = this;
    if ("gValidationInvalid" !== b && "gValidationUpdate" !== b) throw new Error("No such Greppy validator event exists: " + b);
    this.events.push({
        origEvtName: a,
        gEvtName: b
    }), $(this.allValidators).each(function(d, e) {
        c.bindEventToValidator(e, a, b);
    });
}, /**
 * This binds an element's event to a specified greppy Validator event.
 *
 * @param {jQuery} validator
 * @param {String} origEvtName
 * @param {String} gEvtName
 */
greppy.Validator.prototype.bindEventToValidator = function(a, b, c) {
    a = $(a), a.on(b, function(a) {
        $(this).trigger(c), "gValidationInvalid" === c && a.preventDefault();
    });
}, /**
 * Gets the element which should be marked if an error occurs.
 *
 * @param {jQuery} el The validator.
 * @returns {jQuery}
 */
greppy.Validator.prototype.getMark = function(a) {
    a = $(a);
    var b, c = a.attr("name");
    return null === c ? a : (b = a.parents('*[data-greppy-validator-mark="' + c + '"]'), 
    0 === b.length && a.hasClass("multiselect") && (b = a.nextAll(".btn-group")), 0 < b.length ? b : a);
}, /**
 * Add a validator to the current set of validators.
 *
 * @param {type} el
 * @returns {undefined}
 */
greppy.Validator.prototype.addValidator = function(a) {
    if (!$(a).hasClass("greppy-validator")) throw new Error("Element passed is not a Greppy validator!");
    this.allValidators.add(a), this.bindAllEventsToValidator(a);
}, /**
 * Applies the defined events to the specified validator.
 *
 * @param {jQuery} validator
 */
greppy.Validator.prototype.bindAllEventsToValidator = function(a) {
    var b = this;
    this.events.forEach(function(c) {
        b.bindEventToValidator(a, c.origEvtName, c.gEvtName);
    });
}, /**
 * Validates an element.
 *
 * @param {Object} el The element to validate.
 */
greppy.Validator.prototype.validate = function(a) {
    return !1 === a.checkValidity() ? void this.markInvalid(this.getMark(a)) : (this.removeInvalidMark(this.getMark(a)), 
    void this.removeMsg(this.getMark(a)));
}, /**
 * Marks the provided element as invalid.
 *
 * @param {Object} el
 */
greppy.Validator.prototype.markInvalid = function(a) {
    $(a).addClass("greppy-validator-invalid");
}, /**
 * Removes an invalid mark from the provided element.
 *
 * @param {Object} el
 */
greppy.Validator.prototype.removeInvalidMark = function(a) {
    $(a).removeClass("greppy-validator-invalid");
}, /**
 * Shows the validation message of a provided element.
 *
 * @param {type} el
 */
greppy.Validator.prototype.showMsg = function(a) {
    //el       = this.getUniqueValidator(el);
    a = $(a);
    var b = this.getMark(a), c = this;
    this.hasActiveMsg(a) || $('<div class="greppy-validator-msg btn btn-danger" data-greppy-validator-name="' + a.attr("name") + '" />').html(b.attr("data-greppy-validator-msg") || a.attr("data-greppy-validator-msg") || "Validation failed").insertAfter(b).hide().fadeIn().css({
        top: b.position().top + b.outerHeight() + 4,
        left: b.position().left
    }).on("mouseleave", function() {
        c.removeMsg(b);
    });
}, /**
 * Returns wether the passed element has an active message.
 *
 * @param {jQuery} el
 * @returns {Boolean}
 */
greppy.Validator.prototype.hasActiveMsg = function(a) {
    var b = a.attr("name"), c = this.getMark(a);
    return b && c.nextAll('.greppy-validator-msg[data-greppy-validator-name="' + b + '"]').length ? !0 : !1;
}, /**
 * Removes the msg-element of a provided mark element, if there's any.
 *
 * @param {Object} el The mark element
 * @param {Boolean} fast No fading out; fast removing.
 */
greppy.Validator.prototype.removeMsg = function(a, b) {
    return a = $(a).nextAll(".greppy-validator-msg"), b ? void a.remove() : void a.fadeOut(function() {
        a.remove();
    });
}, /**
 * @constructor
 *
 * @param {Object} table - jQuery object of the table to  use for the DataGrid
 * @param {Object} [options] - Options to use for the DataGrid
 */
greppy.DataGrid = function(a, b) {
    var c = new greppy.Styler();
    this.table = a, this.search = new greppy.DataGrid.Search(this, a), this.sort = new greppy.DataGrid.Sort(this, a), 
    this.paginator = new greppy.DataGrid.Pagination(this, a), this.options = b || {}, 
    this.options.softDeletion = "undefined" != typeof b.softDeletion ? b.softDeletion : !0, 
    this.options.url = b.url || document.URL, this.options.labels && this.setProvidedLabels(), 
    0 < a.length && c.initOverlay(this.table, "gDatagridLoading", "gDatagridRebuilt"), 
    // Wrap twitter bs events to prevent race conditions
    $(".btn").on({
        change: function(a) {
            setTimeout(function() {
                $(a.currentTarget).trigger("gChange");
            }, 20);
        }
    });
}, /**
 * Build URL with given params.
 *
 * @param {Array} params - Parameters to add to the request
 * @return {String}
 */
greppy.DataGrid.prototype.buildUrl = function(a) {
    var b = this.options.url;
    return a = a || [], this.options.softDeletion && !0 === $("#search-trash label").hasClass("active") && a.unshift({
        name: "filter",
        value: "trash"
    }), -1 === document.URL.indexOf("?") && (b += "?"), a.forEach(function(a) {
        a.value && (b += "&" + a.name + "=" + encodeURIComponent(a.value));
    }), b;
}, /**
 * Perform an AJAX request to load table rows
 * and fill the table with the results.
 *
 * @param {Array} params - Array of params to use for building the url
 * @param {Function} callback - Function to call on finish
 */
greppy.DataGrid.prototype.loadAndRebuild = function(a, b) {
    this.table.trigger("gDatagridLoading");
    a = a || [];
    var c = function(a) {
        $.ajax({
            type: "GET",
            url: a
        }).done(b);
    }, d = this.buildUrl(a);
    "function" == typeof this.options.preLoad ? this.options.preLoad(d, function(a, b) {
        a || c(b);
    }) : c(d);
}, /**
 * Reset all filters.
 */
greppy.DataGrid.prototype.reset = function() {
    var a = this, b = function() {
        a.load(!0, !0, 1);
    };
    "function" == typeof this.options.preReset ? this.options.preReset(function(a) {
        a || b();
    }) : b();
}, /**
 * Load by all settings.
 *
 * @param {Boolean} [rows] - Load and build rows - Default: true
 * @param {Boolean} [pagination] - Load and build pagination - Default: true
 * @param {Integer} [page] - Pass page number to load (dont use the user-selected)
 */
greppy.DataGrid.prototype.load = function(a, b, c) {
    var d = this, e = [];
    if ("undefined" == typeof a && (a = !0), "undefined" == typeof b && (b = !0), e = e.concat(this.search.getParameters()), 
    e = e.concat(this.sort.getParameters()), e = e.concat(this.paginator.getParameters(c)), 
    !0 === a) {
        var f = [].concat(e);
        f.unshift({
            name: "render",
            value: "rows"
        }), this.loadAndRebuild(f, function(a) {
            d.table.find("tr").not(":first").remove(), d.table.find("tbody").append(a), d.table.trigger("gDatagridRebuilt");
        });
    }
    if (!0 === b) {
        var g = [].concat(e);
        g.unshift({
            name: "render",
            value: "pagination"
        }), this.loadAndRebuild(g, function(a) {
            $(".paginator").html(a);
        });
    }
}, /**
 * Apply each label provided via options to compatible instances.
 */
greppy.DataGrid.prototype.setProvidedLabels = function() {
    for (var a in this.options.labels) this[a] && this[a].setLabels && this[a].setLabels(this.options.labels[a]);
}, /*
 * @constructor
 *
 * @param {Object} datagrid - DataGrid instance
 * @param {Object} datagridElement - jQuery Element of the datagrid
 */
greppy.DataGrid.Pagination = function(a, b) {
    var c = this, d = $(document);
    this.datagrid = a, this.datagridElement = b, this.page = 1, // Bind events
    // Page clicked
    d.on("click", ".pagination a[data-page]", function() {
        var a = $(this).attr("data-page");
        c.page != a && (c.page = $(this).attr("data-page"), c.datagrid.load());
    }), // Page limit changed
    d.on("change", "#pagination-limit", function() {
        c.datagrid.reset();
    }), // Keyboard usage events
    d.on("keydown", function(a) {
        // dont process event, if editing a text
        if (!$("input, textarea").is(":focus")) {
            // Right arrow pressed
            if (// Left arrow pressed
            37 == a.keyCode && (c.page = c.page > 0 ? c.page - 1 : 1, c.datagrid.load()), 39 == a.keyCode) {
                var b = 1;
                $(".pagination a[data-page]").each(function(a, c) {
                    var d = parseInt($(c).attr("data-page"));
                    b = d > b ? d : b;
                }), c.page = c.page < b ? c.page + 1 : c.page, c.datagrid.load();
            }
            // Quick jump to page event (g)
            71 == a.keyCode && greppy.app.dialog([ '<div class="col-lg-5">', '<input autofocus="autofocus" class="form-control" id="page-to-jump" ', ' name="page-to-jump" type="number" placeholder="Page to jump to ..">', "</div><br />" ].join(""), {
                header: "Quick page jump",
                ok: function(a) {
                    c.page = parseInt($("#page-to-jump").val()), c.datagrid.load(), a && a();
                }
            });
        }
    });
}, /**
 * Get all relevant parameters.
 *
 * @param {Integer} [page] - Page number to load
 * @return {Array}
 */
greppy.DataGrid.Pagination.prototype.getParameters = function(a) {
    return [ {
        name: "page",
        value: a || this.page
    }, {
        name: "limit",
        value: $("#pagination-limit :selected").val()
    } ];
}, /**
 * @constructor
 *
 * @param {Object} datagrid - DataGrid instance
 * @param {Object} datagridElement - jQuery Element of the datagrid
 */
greppy.DataGrid.Search = function(a, b) {
    var c = this;
    this.datagrid = a, this.datagridElement = b, this.input = $("#search-input"), this.trash = $("#search-trash"), 
    this.labels = {
        fuzzySearch: "Fuzzy search",
        searchFor: "Search for"
    }, // Setup datagrid table headers
    this.datagridElement.find($("th[data-property]")).each(function(a, b) {
        var c = $(b);
        c.html($("<span>&nbsp;" + c.text() + "&nbsp;</span>")), c.prepend($('<i class="search-trigger fa fa-search text-muted"></i>'));
    }), // Bind events
    // Search or trash button clicked
    $("#search-trash").on("gChange", function() {
        c.datagrid.paginator.page = 1, c.datagrid.load();
    }), $("#search-btn").on("click", function() {
        c.datagrid.paginator.page = 1, c.datagrid.load();
    }), // Search selector clicked
    $(".search-trigger").on("click", function() {
        var a = $(this).parent();
        c.settings(a.attr("data-property"), a.text()), $("#search-input").focus();
    }), // Clear search button clicked
    $("#search-clear").on("click", function() {
        c.clear(), c.settings("fuzzy"), c.datagrid.reset();
    }), // Pressed enter on search box
    $("#search-input").keypress(function(a) {
        13 == a.keyCode && $("#search-btn").trigger("click");
    });
}, /**
 * Apply the search box settings.
 *
 * @params {String} property - Name of the property to search for
 * @params {String} placeholder - Placeholder of the search box
 */
greppy.DataGrid.Search.prototype.settings = function(a, b) {
    b = "fuzzy" == a ? this.labels.fuzzySearch : this.labels.searchFor + b.toLowerCase(), 
    this.input.attr("placeholder", b + "..").attr("data-property", a);
}, /**
 * Clear the search box.
 */
greppy.DataGrid.Search.prototype.clear = function() {
    this.input.val("");
}, /**
 * Get all relevant parameters.
 *
 * @return {Array}
 */
greppy.DataGrid.Search.prototype.getParameters = function() {
    var a = [];
    if ("" == this.input.val()) return a;
    var a = a.concat([ {
        name: "search",
        value: this.input.val()
    }, {
        name: "sprop",
        value: this.input.attr("data-property")
    } ]);
    return a;
}, /**
 * Sets custom labels, e. g. for localizations.
 *
 * @param {Object} labels
 */
greppy.DataGrid.Search.prototype.setLabels = function(a) {
    $.extend(!0, this.labels, a);
}, /**
 * @constructor
 *
 * @param {Object} datagrid - DataGrid instance
 * @param {Object} datagridElement - jQuery Element of the datagrid
 */
greppy.DataGrid.Sort = function(a, b) {
    var c = this;
    this.datagrid = a, this.datagridElement = b, // Bind events
    // Table header clicked
    this.datagridElement.find($("th[data-property] span")).on("click", function() {
        c.toggle($(this).parent());
    });
}, /**
 * Toggle the sorting of a column.
 *
 * @param {Object} th - Table header to toggle
 */
greppy.DataGrid.Sort.prototype.toggle = function(a) {
    this.datagridElement.find($("th[data-property]")).not(a).each(function(a, b) {
        b = $(b), b.find(".direction").remove(), b.attr("data-sort", "");
    });
    var b = a.attr("data-sort");
    return b || (a.append($('<i class="direction text-muted fa fa-arrow-down"></i>')), 
    a.attr("data-sort", "asc")), "asc" === b && (a.find(".direction").removeClass("fa-arrow-down").addClass("fa-arrow-up"), 
    a.attr("data-sort", "desc")), "desc" === b && (a.find(".direction").remove(), a.attr("data-sort", "")), 
    a.attr("data-sort") ? void this.datagrid.load() : this.datagrid.reset();
}, /**
 * Get all relevant parameters.
 *
 * @return {Array}
 */
greppy.DataGrid.Sort.prototype.getParameters = function() {
    var a = this.datagridElement.find($("th[data-property]")).not($('[data-sort=""]'));
    return 0 !== a.length && a.attr("data-sort") && "" != a.attr("data-sort") ? [ {
        name: "order",
        value: a.attr("data-sort")
    }, {
        name: "oprop",
        value: a.attr("data-property")
    } ] : [];
}, /**
 * @constructor
 */
greppy.Styler = function() {
    this.upload = new greppy.Styler.Upload(), this.number = new greppy.Styler.Number();
}, /**
 * Creates an overlay which is displayed on top of an element, when a specified
 * event occurs.
 *
 * @param {String|Object} el Maybe a String or a jQuery object.
 * @param {String} showEvent Name of the event which is showing the overlay when fired.
 * @param {String} removeEvent Name of the event which is removing the overlay when fired.
 */
greppy.Styler.prototype.initOverlay = function(a, b, c) {
    var d = this, e = "gOverlay" + new Date().getTime(), f = {};
    if (a = $(a), 1 !== a.length) throw new Error("Expected single element for overlay, but got " + a.length);
    f[b] = function() {
        a.parent().find("#" + e).remove(), a.after('<div class="greppy-overlay" id="' + e + '" />'), 
        $("#" + e).css({
            top: a.position().top,
            left: a.position().left,
            width: a.outerWidth(),
            height: a.outerHeight()
        }), d.initSpinner(document.getElementById(e));
    }, f[c] = function() {
        $("#" + e).remove();
    }, a.on(f);
}, /**
 * Initializes the spinner animation for a given target.
 *
 * @param {Object} target Non-jQuery object where the spinner is placed
 * @param {Object} opts The options for the spinner. Optional.
 */
greppy.Styler.prototype.initSpinner = function(a, b) {
    b = b || {
        lines: 11,
        // The number of lines to draw
        length: 0,
        // The length of each line
        width: 10,
        // The line thickness
        radius: 30,
        // The radius of the inner circle
        corners: 1,
        // Corner roundness (0..1)
        rotate: 0,
        // The rotation offset
        direction: 1,
        // 1: clockwise, -1: counterclockwise
        color: "#000",
        // #rgb or #rrggbb
        speed: 1,
        // Rounds per second
        trail: 29,
        // Afterglow percentage
        shadow: !1,
        // Whether to render a shadow
        hwaccel: !0,
        // Whether to use hardware acceleration
        className: "spinner",
        // The CSS class to assign to the spinner
        zIndex: 2e9
    }, this.spinner = new Spinner(b).spin(a);
}, /**
 * @constructor
 */
greppy.Styler.Number = function() {}, /**
 * Styles an input element to be adjustable via buttons.
 *
 * @param {String|jQuery} el The element(s) to style
 */
greppy.Styler.Number.prototype.style = function(a) {
    var b = this;
    a = $(a), a.each(function(a, c) {
        c = $(c), b.validate(c), b.handleCleanup(c), b.addStyles(c), b.addButtonHandlers(c);
    });
}, /**
 * Helper function which ensures el fits the requirements.
 *
 * @param {jQuery} el
 */
greppy.Styler.Number.prototype.validate = function(a) {
    if ("INPUT" !== a.prop("tagName")) throw new Error("Element needs to be an input");
}, /**
 * Decides wether to cleanup the passed element.
 *
 * @param {jQuery} el
 */
greppy.Styler.Number.prototype.handleCleanup = function(a) {
    this.isNumber(a) && this.clearStyled(a);
}, /**
 * Adds style markup to the element.
 *
 * @param {jQuery} el
 */
greppy.Styler.Number.prototype.addStyles = function(a) {
    a.wrap('<div class="input-group greppy-container-num" data-greppy-validator-mark="' + a.attr("name") + '"></div>'), 
    a.addClass("pull-left"), a.after('<div class="input-group-btn pull-left"><button class="btn btn-default g-add" type="button"><i class="fa fa-plus"></i></button>&nbsp;<button class="btn btn-default g-substract" type="button"><i class="fa fa-minus"></i></button></div>');
}, /**
 * Adds spinner buttons to the provided element.
 *
 * @param {jQuery} el
 */
greppy.Styler.Number.prototype.addButtonHandlers = function(a) {
    var b = this;
    a.next(".input-group-btn").find(".g-add").on("click", function() {
        var c = b.getAddedVal(a);
        a.val(c).trigger("change");
    }), a.next(".input-group-btn").find(".g-substract").on("click", function() {
        var c = b.getSubtractedVal(a);
        a.val(c).trigger("change");
    });
}, /**
 * Returns the normalized number of the passed element.
 *
 * @param {jQuery} el
 * @returns {Number}
 */
greppy.Styler.Number.prototype.getVal = function(a) {
    return isNaN(parseInt(a.val(), 10)) ? 0 : parseInt(a.val(), 10);
}, /**
 * Returns the added number of the passed element.
 *
 * @param {jQuery} el
 * @returns {Number}
 */
greppy.Styler.Number.prototype.getAddedVal = function(a) {
    var b = this.getVal(a);
    return a.attr("data-max") < b + 1 ? b : b + 1;
}, /**
 * Returns the subtracted number of the passed element.
 *
 * @param {jQuery} el
 * @returns {Number}
 */
greppy.Styler.Number.prototype.getSubtractedVal = function(a) {
    var b = this.getVal(a);
    return a.attr("data-min") > b - 1 ? b : b - 1;
}, /**
 * Determines wether the passed element is a number-styled input.
 *
 * @param {jQuery} el
 * @returns {Boolean}
 */
greppy.Styler.Number.prototype.isNumber = function(a) {
    return a.parent().hasClass("greppy-container-num") ? !0 : !1;
}, /**
 * Clears an input from remaining stuff of Greppy number to get a plain input.
 *
 * @param {jQuery} el
 */
greppy.Styler.Number.prototype.clearStyled = function(a) {
    a.unwrap(), a.next(".input-group-btn").remove(), a.off();
}, /**
 * @constructor
 */
greppy.Styler.Upload = function() {}, /**
 * Styles a fileupload input in the manner of bootstrap 3.
 *
 * @param {String|jQuery} el The element(s) to style
 */
greppy.Styler.Upload.prototype.style = function(a) {
    var b = this;
    a = $(a), a.each(function(a, c) {
        c = $(c), b.validate(c), b.addStyles(c), b.handleFilePreselected(c), b.addNewFileSelectedHandler(c), 
        b.addButtonHandlers(c), b.hideOriginalInput(c);
    });
}, /**
 * Helper function that validates an input[type="file"] element.
 *
 * @param {jQuery} el A fileupload element or a selector that's pointing to one
 */
greppy.Styler.Upload.prototype.validate = function(a) {
    var b = a.attr("name");
    if (!b || $('*[name="' + b + '"]').length > 1) throw new Error("Element needs to have a unique name");
}, /**
 * Adds the new markup to the input element.
 *
 * @param {jQuery} el
 */
greppy.Styler.Upload.prototype.addStyles = function(a) {
    var b = this.getMarkup(a);
    a.wrap(b);
}, /**
 * Computes the markup to style an upload element.
 *
 * @param {jQuery} el
 * @returns {String} The markup as HTML
 */
greppy.Styler.Upload.prototype.getMarkup = function(a) {
    return '<div class="input-group" data-fileuploadname="' + a.attr("name") + '" data-greppy-validator-mark="' + a.attr("name") + '"><span class="input-group-addon"><i class="fa fa-file"></i></span><div class="form-control"><span class="file-path"></span></div><span class="input-group-btn"><button class="btn btn-default" type="button">Datei wählen</button></span></div>';
}, /**
 * Shows the filename of the current selected file in the specified element.
 *
 * @param {jQuery} el
 */
greppy.Styler.Upload.prototype.showFilename = function(a) {
    $(this.getStyledUploadSelector(a) + " .file-path").text(a.val().split("\\").pop());
}, /**
 * Gets the selector of the styled upload for the specified element.
 *
 * @param {type} el
 * @returns {String}
 */
greppy.Styler.Upload.prototype.getStyledUploadSelector = function(a) {
    return 'div[data-fileuploadname="' + a.attr("name") + '"]';
}, /**
 * Handles the displaying of files that were already selected before styling.
 *
 * @param {jQuery} el
 */
greppy.Styler.Upload.prototype.handleFilePreselected = function(a) {
    a.val() && this.showFilename(a);
}, /**
 * Adds a handler for the selection of new files.
 *
 * @param {jQuery} el
 */
greppy.Styler.Upload.prototype.addNewFileSelectedHandler = function(a) {
    var b = this;
    a.on("change", function() {
        b.showFilename(a);
    });
}, greppy.Styler.Upload.prototype.addButtonHandlers = function(a) {
    var b = this, c = this.getStyledUploadSelector(a);
    $(c + " button, " + c + " .form-control").on("click", function(c) {
        // if prevents endless recursion
        $(c.target).is(a) || b.showFileDialog(a);
    });
}, /**
 * Shows the file select dialog to the user.
 *
 * @param {jQuery} el
 */
greppy.Styler.Upload.prototype.showFileDialog = function(a) {
    a.trigger("click");
}, /**
 * Hides the old input element so the user doesn't notice it anymore.
 *
 * @param {jQuery} el The old input element to hide.
 */
greppy.Styler.Upload.prototype.hideOriginalInput = function(a) {
    a.hide();
}, greppy.app = new greppy.Application();