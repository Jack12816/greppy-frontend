# Version 0.11.2

* [e0ab3c7](https://github.com/Jack12816/greppy-frontend/commit/e0ab3c7) **[Bugfix][Data-Grid][Search]** Always trim the search input value if available.

# Version 0.11.1

* [fc36c4b](https://github.com/Jack12816/greppy-frontend/commit/fc36c4b) **[Bugfix][Data-Grid][Search]** Always trim the search input value.

# Version 0.11.0

* [cf6946a](https://github.com/Jack12816/greppy-frontend/commit/cf6946a) **[Docs]** Added CHANGELOG.md.
* [43108b0](https://github.com/Jack12816/greppy-frontend/commit/43108b0) **[Makefile][Build-System]** Rewritten makefile. Switched from Ruby Guard to Grunt.

# Version 0.10.0

* [f4a20e4](https://github.com/Jack12816/greppy-frontend/commit/f4a20e4) **[Application]** Extended app.dialog() method to be more optional.
* [3547e61](https://github.com/Jack12816/greppy-frontend/commit/3547e61) **[Commons]** Updated readme.
* [4851ad1](https://github.com/Jack12816/greppy-frontend/commit/4851ad1) **[Commons]** Updated readme.
* [84311fe](https://github.com/Jack12816/greppy-frontend/commit/84311fe) **[Commons]** Updated readme.
* [8b7ab5d](https://github.com/Jack12816/greppy-frontend/commit/8b7ab5d) **[Commons]** Updated readme.

# Version 0.9.1

* [bc0e9db](https://github.com/Jack12816/greppy-frontend/commit/bc0e9db) **[Common][Release]** Updated all versions of our dependencies. Bumped to version 0.9.1.

# Version 0.9.0

* [c69997e](https://github.com/Jack12816/greppy-frontend/commit/c69997e) **[DataGrid/Search]** Added localization support for search-field.

# Version 0.8.1

* [9bdf55a](https://github.com/Jack12816/greppy-frontend/commit/9bdf55a) **[DataGrid]** Fixed wrong propertyname which led to malfunction.

# Version 0.8.0

* [fc886ae](https://github.com/Jack12816/greppy-frontend/commit/fc886ae) **[DataGrid/Styler]** Changed structure; fixed some bugs and inconsistencies.
* [2e1350a](https://github.com/Jack12816/greppy-frontend/commit/2e1350a) **[Styler]** Refactored for a more consistent API and cleaner methods.

# Version 0.7.0

* [20b96f2](https://github.com/Jack12816/greppy-frontend/commit/20b96f2) **[Styler]** Changed position of hidden input-file for better positioning of validator-messages.
* [dd8fdd0](https://github.com/Jack12816/greppy-frontend/commit/dd8fdd0) **[Validator/Styler]** Changes which make it possible to add elements dynamically.

# Version 0.6.2

* [25c1a6f](https://github.com/Jack12816/greppy-frontend/commit/25c1a6f) **[Styler]** Removed static-inline css flags for overlay, and moved them into the less stylesheet. Now the client can configure the background settings and anything else.

# Version 0.6.1

* [3aa8661](https://github.com/Jack12816/greppy-frontend/commit/3aa8661) **[Styler]** Number: Passing of multiple elements is now allowed. Also triggered change event when spinner buttons are pressed.

# Version 0.6.0

* [d6b6c7f](https://github.com/Jack12816/greppy-frontend/commit/d6b6c7f) **[Validator]** Some code changes for extensibility; CSS-modifications for greppy number spinner.

# Version 0.5.0

* [070efff](https://github.com/Jack12816/greppy-frontend/commit/070efff) **[Icons]** Changed icon classes to match Font Awesome 4.
* [cb774e5](https://github.com/Jack12816/greppy-frontend/commit/cb774e5) **[Merge]** Merged validator branch.
* [19255ae](https://github.com/Jack12816/greppy-frontend/commit/19255ae) **[Validator]** Now displaying only the message of a single element, when there is more than one element with the same name.
* [7994ec7](https://github.com/Jack12816/greppy-frontend/commit/7994ec7) **[Validator]** Started implementation. Unfinished.
* [cef0e76](https://github.com/Jack12816/greppy-frontend/commit/cef0e76) **[Validator][Styler]** Completed Validator. Small fixes/changes for custom upload.

# Version 0.4.3

* [90a5791](https://github.com/Jack12816/greppy-frontend/commit/90a5791) **[Config]** Updated GNU makefile to use bash as default shell.
* [40fb648](https://github.com/Jack12816/greppy-frontend/commit/40fb648) **[Styler]** Added class for overlay and gave it a z-index.

# Version 0.4.2

* [baa3b22](https://github.com/Jack12816/greppy-frontend/commit/baa3b22) **[Frontend]** Removed ability to move to the same page as you currently are at.

# Version 0.4.1

* [fc08b90](https://github.com/Jack12816/greppy-frontend/commit/fc08b90) **[Data-Grid]** Allow specification of the base url to use to fetch the grid.

# Version 0.4.0

* [8858982](https://github.com/Jack12816/greppy-frontend/commit/8858982) **[Build]** Added automatic version information to the dist files on build. Bumped to version 0.4.0.
* [8e4f662](https://github.com/Jack12816/greppy-frontend/commit/8e4f662) Removed sanitizer class.
* [c7de15e](https://github.com/Jack12816/greppy-frontend/commit/c7de15e) Smaller optimizaions, mainly parameter names and comments.

# Version 0.3.2

* [644df5a](https://github.com/Jack12816/greppy-frontend/commit/644df5a) Fixed error when no data-grid was provided.

# Version 0.3.1

* [b1fecfd](https://github.com/Jack12816/greppy-frontend/commit/b1fecfd) **[Data-Grid]** Fixed parameter adding without values while building the URL.
* [25d1edf](https://github.com/Jack12816/greppy-frontend/commit/25d1edf) **[Docs]** Updated all docblocks, removed '@return void'.

# Version 0.3.0

* [41d772b](https://github.com/Jack12816/greppy-frontend/commit/41d772b) Added number styling for input elements to styler.
* [e6db6df](https://github.com/Jack12816/greppy-frontend/commit/e6db6df) **[Backend]** Removed unnecessary url parameter from preReset hook and fixed this-self-problem.
* [65d64e2](https://github.com/Jack12816/greppy-frontend/commit/65d64e2) Changed event names to be uniqe again.
* [b7ea67e](https://github.com/Jack12816/greppy-frontend/commit/b7ea67e) **[Data-Grid]** Added preReset hook.
* [7121c67](https://github.com/Jack12816/greppy-frontend/commit/7121c67) **[DataGrid]** Build an uniform way to load and rebuild the datagrid. Added the ability to hook in before the loading will start (preLoad).
* [cce31cf](https://github.com/Jack12816/greppy-frontend/commit/cce31cf) Fixed wrong position of event triggering.

# Version 0.2.0

* [e34fc41](https://github.com/Jack12816/greppy-frontend/commit/e34fc41) **[Build][Structure]** Added build system for splitted resources. Splitted js and css (moved to less) into separate files.
* [8b49f5f](https://github.com/Jack12816/greppy-frontend/commit/8b49f5f) **[Events/Misc]** Prevented wrong event from being handled; fixed double loading of pagination on page change.

# Version 0.1.2

* [b9675ee](https://github.com/Jack12816/greppy-frontend/commit/b9675ee) Added styler and sanitizer. Fileuploads can now be styled to look like they were bootstrap elements.
* [73183cf](https://github.com/Jack12816/greppy-frontend/commit/73183cf) **[Common]** Added development notes and a makefile to automatically minify the dist files.
* [d45c2b8](https://github.com/Jack12816/greppy-frontend/commit/d45c2b8) **[Frontend]** Added important attribute to the pointer class to force the pointer type cursor.
* [ac13ded](https://github.com/Jack12816/greppy-frontend/commit/ac13ded) Made overlay-functionality independent from data-grid. Renamed custom events to fit jQuery event-namespaces. Added missing semicolons.
* [eeab5ae](https://github.com/Jack12816/greppy-frontend/commit/eeab5ae) Updated/extended fileupload replacer.
* [f132ddd](https://github.com/Jack12816/greppy-frontend/commit/f132ddd) Updated minified version.
* [0d748fa](https://github.com/Jack12816/greppy-frontend/commit/0d748fa) **[Versioning]** Retagged version to 0.1.2.

# Version 0.1.1

* [dcba9f9](https://github.com/Jack12816/greppy-frontend/commit/dcba9f9) **[Bower]** Fixed bower configuration.

# Version 0.1.0

* [94227bf](https://github.com/Jack12816/greppy-frontend/commit/94227bf) Initial commit.

