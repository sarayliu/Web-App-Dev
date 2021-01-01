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

// -------------- helper functions (middleware) -------------- //

function reqForecastURL(req, res, next){
    var params = {
        url : 'https://api.weather.gov/points/' + req.query.lat + ',' + req.query.long,
        headers : {
            'User-Agent': 'request'
        }
    };
    
    request.get( params, function(e, r, body) {
        var obj = JSON.parse(body);
        res.locals.forecastURL = obj.properties.forecastHourly;
        res.locals.coordinates = {'Location': obj.geometry.coordinates};
        console.log(obj);
        next();
    } );
}

function reqForecastHourly(req, res, next){
    var params2 = {
        url : res.locals.forecastURL,
        headers : {
            'User-Agent': 'request'
         }
    };
    
    request.get(params2, function(e, r, body) {
        var obj2 = JSON.parse(body);
        res.locals.periodInfo = obj2.properties.periods;
        res.locals.info = [];
        for (var pd = 0; pd < res.locals.periodInfo.length; pd++) {
            res.locals.info.push('Start Time: ' + res.locals.periodInfo[pd].startTime + 
                                 '\t End Time: ' + res.locals.periodInfo[pd].endTime + 
                                 '\t Temperature: ' + res.locals.periodInfo[pd].temperature + 
                                 res.locals.periodInfo[pd].temperatureUnit + '\n');
        }
        console.log(obj2);
        next();
    });
}
// -------------- express 'get' handlers -------------- //
// These 'getters' are what fetch your pages

// app.get('/getweather', function(req, res){
//     res.sendFile(__dirname + '/index.html'); //doesn't work because after sendFile, it terminates
    
//     var params = {
//         url : 'https://api.weather.gov/points/' + req.query.lat + ',' + req.query.long,
//         headers : {
//         'User-Agent': 'request'
//         }
//     };
// });

app.get('/', function(req, res){
    console.log("user at page");
    res.sendFile(
        path.join(__dirname, 'ajax.html')
    );
});

app.get('/getweather', [reqForecastURL, reqForecastHourly], function(req, res) {
    var info_dict = {
        info_list : res.locals.info
    };
    res.render('index', info_dict);
    console.log(info_dict);
}
    
);

// -------------- listener -------------- //
// The listener is what keeps node 'alive.' 

var listener = app.listen(app.get('port'), function() {
  console.log( 'Express server started on port: '+listener.address().port );
});

// function reqListener () {
//   console.log(this.responseText);
// }

// var oReq = new XMLHttpRequest();
// oReq.addEventListener("load", reqListener); //called when data is ready
// oReq.open("GET", "http://www.example.org/example.txt");
// oReq.send();

// //$.ajax - means JQuery

// "menu_item=12&foo=hello&format=json"