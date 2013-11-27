/**
 *
 * This is a small express-powered server used only for testing.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.resolve(__dirname + '/../../')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res) {

    var limit = ('25' === req.query.limit) ? 25 : 10;
    var htmlFolder = __dirname + '/../html';
    var fileToSend;

    if ('rows' === req.query.render) {

        fileToSend = htmlFolder + '/render/rows/limit' + limit + '/page' + req.query.page + '.html';
    } else if ('pagination' === req.query.render) {

        fileToSend = htmlFolder + '/render/pagination/limit' + limit + '/page' + req.query.page + '.html';
    } else {

        fileToSend = htmlFolder + '/data-grid.html';
    }

    sendFile(fileToSend, res);
});

function sendFile(fileName, res) {

    fs.readFile(fileName, 'utf8', function(err, text) {

        res.send(text);
    });
}


http.createServer(app).listen(app.get('port'), function(){
  console.log('Started test server on port ' + app.get('port'));
});
