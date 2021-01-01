#!/usr/bin/nodejs

// -------------- load packages -------------- //
// INITIALIZATION STUFF

var express = require('express');
var app = express();


// -------------- express initialization -------------- //
// PORT SETUP - NUMBER SPECIFIC TO THIS SYSTEM

app.set('port', process.env.PORT || 8080 );


// -------------- express 'get' handlers -------------- //
// These 'getters' are what fetch your pages

app.get('/', function(req, res){
    console.log("user at page");
    res.sendFile(__dirname + '/index.html');
});

app.get('/dogs.jpg', function(req, res){
    res.sendFile(__dirname + '/cat.jpg');
});

app.get('/cats.jpg', function(req, res){
    res.sendFile(__dirname + '/dog.jpg');
});

app.get('/pet', function(req, res){
    var theQuery = req.query.type;
    if (theQuery == 'dog')
        res.sendFile(__dirname + '/dog.jpg');
    else if (theQuery == 'cat')
        res.sendFile(__dirname + '/cat.jpg');
    else
        res.send('undefined');
});

function index(req, res){
    res.sendFile(__dirname + '/index.html');
}

app.get('/fish.jpg', index);

// function index(req, res){
//     res.sendFile(__dirname + 'hola.jpg')
// Or:
//     res.sendFile(
//         path.join(__dirname, 'hola.jpg') //better, but have to write var path = require('path')
//     ); 
// }

// app.get('/', function(req, res){  //anonymous function; can also be defined
//     res.send('hola');
// });

// app.get('/not_a_search', function(req, res){  //request and response
//     var theQuery = req.query.q;  //key is named q
//     res.send('query parameter:' + theQuery);  //sends to browser
// });



// -------------- listener -------------- //
// // The listener is what keeps node 'alive.' 

var listener = app.listen(app.get('port'), function() {
  console.log( 'Express server started on port: '+listener.address().port );
});

//cd public
//in command prompt, type npm install express to import node_modules