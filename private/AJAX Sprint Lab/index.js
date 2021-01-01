#!/usr/bin/nodejs


// -------------- load packages -------------- //
var express = require('express');
var request = require('request');
var app = express();
var hbs = require('hbs');
var path = require('path');

// -------------- express initialization -------------- //
app.set('port', process.env.PORT || 8080 );
app.set('view engine', 'hbs');

// -------------- express 'get' handlers -------------- //
// These 'getters' are what fetch your pages

app.get('/', function(req, res){
    console.log("user at page");
    res.sendFile(
        path.join(__dirname, 'index.html')
    );
});

app.get('/survey', function(req, res){
    res.render('ajax');
});
var red_count = 0;
var green_count = 0;
var blue_count = 0;
app.get('/handle_voting', function(req, res) {
    if(req.query.name == 'red'){
        red_count += 1;
        }
    else if (req.query.name == 'green'){
        green_count += 1;
    }
    else {
        blue_count += 1;
    }
    votes_obj = {red: red_count, green: green_count, blue: blue_count};
    res.render('index', votes_obj);
});

// -------------- listener -------------- //
// The listener is what keeps node 'alive.' 

var listener = app.listen(app.get('port'), function() {
  console.log( 'Express server started on port: '+listener.address().port );
});