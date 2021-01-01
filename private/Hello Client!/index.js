#!/usr/bin/nodejs


// -------------- load packages -------------- //
var express = require('express');
var app = express();
var path = require('path');
var hbs = require('hbs');


// -------------- express initialization -------------- //
app.set('port', process.env.PORT || 8080 );
app.set('view engine', 'hbs');

// -------------- serve static folders -------------- //
app.use('/css', express.static(path.join(__dirname, 'css')));


// -------------- variable definition -------------- //
var visitorCount = 0; 

// -------------- express 'get' handlers -------------- //
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

// app.get('/funpage', function(req, res){
//     res.sendFile(__dirname + '/funpage.html');
// });

app.get('/funpage', function(req, res){
    feed_dict = {name: req.query.name};
    res.render('index', feed_dict);
});


// -------------- listener -------------- //
// The listener is what keeps node 'alive.' 

var listener = app.listen(app.get('port'), function() {
  console.log( 'Express server started on port: '+listener.address().port );
});