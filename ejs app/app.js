var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http= require('http');
var routes = require('./routes/index');
var users = require('./routes/users');
var config=require('./config')
var app = express();
//db
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log('connected!')
    });
//schema defining
var Schema = mongoose.Schema;
var userSchema = new Schema({_id:Number, name: String});
var Patient =mongoose.model('Patient', userSchema);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', 3000)

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/users', users);

//adding test user
var p1=new Patient({_id:1, name:"lee"})
p1.save();

//process
app.get('/:id', function(req, res){
    Patient.find({name: req.params.id}, function(err, patients) {
        console.log(patients.name);
        if(patients.length==0) {res.render("index", {
        title:"No such patients!"

    })    }
       
     res.render("index", {
        title:patients

    })    
})
});


app.get('/index', function(req, res){

    res.render("index", {
        title:'hello'

    })    
});
/// catch 404 and forwarding to error handler
app.use(function(req, res, next){
if(req.url == '/test'){
 res.end('test');} 
 else{next();}
});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers
app.use(function(req, res, next){
    if(req.url == '/'){
        res.end('hello!');
    } 
    else{next();}

});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

console.log('yeah!');
module.exports = app;
app.get('/', function(req, res){
    console.log('r');

})
app.listen(3000);