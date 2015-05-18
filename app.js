var express = require('express')
var sassMiddleware = require('node-sass-middleware')
var swig = require('swig')
var logger = require('morgan')
var bodyParser = require('body-parser')
var path = require('path')

var routes = require('./routes/index')
var days = require('./routes/days')

var app = express()

app.use(sassMiddleware({
    src: __dirname + '/assets',
    dest: path.join(__dirname, 'public'),
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/prefix'
}));

//view engine
app.engine('html',swig.renderFile)
app.set('views',path.join(__dirname,'views'))
app.set('view engine','html')

//middleware
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))
console.log("DIR",path.join(__dirname,'public'))
app.use(express.static(path.join(__dirname,'public')))
app.use('/bower_components',express.static(path.join(__dirname,'bower_components')))

app.use('/',routes)
app.use('/days',days)

// catch 404 (i.e., no route was hit) and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// handle all errors (anything passed into next())
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log({error: err});
    res.render('error',{
    	message: err.message,
    	error: err
    })
});
//comment
module.exports = app;