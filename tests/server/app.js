
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.resolve(__dirname + '/../../')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// TODO: refactor
app.get('/', function(req, res) {

    if ('rows' === req.query.render) {

        res.send('test');
    } else {

        fs.readFile(__dirname + '/../html/data-grid.html', 'utf8',
                function(err, text) {

            res.send(text);
        });
    }
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
