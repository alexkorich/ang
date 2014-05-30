var express = require('express');
var path = require('path');

var http= require('http');

var app = express();


app.use(function(req, res, next){
    if(req.url == '/'){
        res.end('hello!');
    } 
    else{next();}

app.use(function(req, res, next){
if(req.url == '/test'){
 res.end('test');} 
 else{next();}
});


/// error handlers


});


console.log('yeah!');
module.exports = app;
app.get('/', function(req, res){
    console.log('r');

})
app.listen(3000);