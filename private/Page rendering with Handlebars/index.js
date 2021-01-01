#!/usr/bin/nodejs


// -------------- load packages -------------- //
var express = require('express');
var app = express();

var hbs = require('hbs');


// -------------- express initialization -------------- //
app.set('port', process.env.PORT || 8080 );

// tell express that the view engine is hbs
app.set('view engine', 'hbs');


// -------------- variable definition -------------- //
var visitorCount = 0; 


// -------------- express 'get' handlers -------------- //

app.get('/', function(req, res){
    console.log("user at page");
    res.sendFile(__dirname + '/index.html');
});

// app.get('/1', function(req, res){
//     res.render('index', { number : 1 + ' is a number'});
// });

// app.get('/2', function(req, res){
//     res.render('index', { number : 2 + ' is also a number'});
// });

app.get('/:page', function(req, res){
    
    // var numFacts = req.query.num_facts;
    // for (var i = 0; i < numFacts; i++) {
    //     res.render('index', { number : 4 + ' is a number'});
    //     console.log('it works'); //doesn't work because when it does render, it stops
    // }
    
    var num_facts = req.query.num_facts;
    var landing_page = req.params.page;
    var facts = [];
    if (landing_page == '1') {
        facts = ['1 is the number after 0',
                     '1 is the number before 2',
                     '1 is an odd number'].slice(0, num_facts);
    }
    else if (landing_page == '2') {
        facts = ['2 is the number after 1',
                     '2 is the number before 3',
                     '2 is an even number'].slice(0, num_facts);
    }
    else if (landing_page == '3') {
        facts = ['3 is the number after 2',
                     '3 is the number before 3',
                     '3 is an odd number'].slice(0, num_facts);
    }

    var fact_dict = {
        fact_list : facts
    };
    
    res.render('index', fact_dict);
    
    var js_format = req.query.format;
    
    if (js_format == 'json')
        res.json(facts);
});

// -------------- listener -------------- //
// The listener is what keeps node 'alive.' 

var listener = app.listen(app.get('port'), function() {
  console.log( 'Express server started on port: '+listener.address().port );
});