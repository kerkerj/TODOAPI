var express = require('express');
var path = require('path');
var log4js = require('log4js');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require("./config/config.js");
var env = process.argv[2];
var app = express();

// Set env
app.set('env', env || 'development');

// require routers
var index = require('./routes/index');
var users = require('./routes/users');
var todos = require('./routes/todos');

// Set logger
log4js.configure({
    appenders: [
        { type: 'console' }, //控制台輸出
        {
            type: 'file', //文件輸出
            filename: 'logs/access.log',
            maxLogSize: 20000000, // 20 MB
            backups: 10,
            category: 'normal'
        }
    ],
    replaceConsole: true
});

var logger = log4js.getLogger('normal');
logger.setLevel('INFO');

app.use(log4js.connectLogger(logger, {level: 'auto', format:':method :url'}));

// Set body-parser
// to support JSON-encoded bodies and URL-encoded bodies
// 需要加入 { extended: true/false }, 否則會 warning
// body-parser deprecated undefined extended: provide extended option
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );

// Set Header Check
app.use( function(req, res, next) {
    var api_key = req.get('API-Key');

    if (api_key != "55665566") {
        res.status(401).send({ error: "Unauthorized"});
    }
    else {
        next();
    }
});

// Set routers
app.use('/', index);
app.use('/users', users);
app.use('/todos', todos);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.status(404).jsonp({error: "Not Found"});
    next();
});

console.log(app.get('env'));

switch(app.get('env')) {
    case 'development' :
        app.use(function(err, req, res, next) {
            res.status(err.status || 500).json({error: err.message});
        });

        mongoose.connect(config.db.development);

        break;
    case 'production' :
        app.use(function(err, req, res, next) {
            res.status(err.status || 500).json({error: ""});
        });

        mongoose.connect(config.db.production);

        break;
    case 'test' :
        app.use(function(err, req, res, next) {
            res.status(err.status || 500).json({error: err.message});
        });

        mongoose.connect(config.db.test);

        break;
}

module.exports = app;