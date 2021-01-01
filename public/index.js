#!/usr/bin/nodejs


// -------------- load packages -------------- //
var express = require('express');
var request = require('request');
var app = express();
var path = require('path');
var hbs = require('hbs');
var cookieSession = require('cookie-session');
var simpleoauth2 = require("simple-oauth2");
var fs = require('fs');
var mysql = require('mysql');


// -------------- express initialization -------------- //
app.set('port', process.env.PORT || 8080 );
app.set('view engine', 'hbs');


// -------------- serve static folders -------------- //
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/img', express.static(path.join(__dirname, 'img')));


// -------------- variable definition -------------- //
var visitorCount = 0;
var name_array = [];
var view_dict = {};
var theQuery = undefined;
var ion_client_id = '6LPVQ94RENaQV6i7kAXXw84c4W4qH3bkV5JDkoF5';
var ion_client_secret = 'bkaEEHCVndLJBAAaWTtKnuiOHdIImXD3SWhNV6prA31FWHLIlTFDO9O3SpPRxdMBnTldCCI2dUbmlNP7t185ccp5eabcQeIUrNGVDX01yu64oGnKJUDJQ3afSeu7H7RS';
var ion_redirect_uri = 'https://user.tjhsst.edu/2020sliu/login_worker';
var words = [];
var wildcard_count = 0;
var letter_dict = {};
var oauth2 = simpleoauth2.create({
  client: {
    id: ion_client_id,
    secret: ion_client_secret,
  },
  auth: {
    tokenHost: 'https://ion.tjhsst.edu/oauth/',
    authorizePath: 'https://ion.tjhsst.edu/oauth/authorize',
    tokenPath: 'https://ion.tjhsst.edu/oauth/token/'
  }
});
var authorizationUri = oauth2.authorizationCode.authorizeURL({
    scope: "read",
    redirect_uri: ion_redirect_uri
});
var pool  = mysql.createPool({
  connectionLimit : 10,
  user            : 'site_2020sliu',
  password        : '33btcZSEWpm4RNdpAXy4F4qY',
  host            : 'mysql1.csl.tjhsst.edu',
  port            : 3306,
  database        : 'site_2020sliu'
});
var accessSQL = false;
var score_array = [];

// -------------- express 'get' handlers -------------- //

app.get('/', function(req, res){
    console.log('no sub-page');
    res.sendFile(__dirname + '/profile.html');
});

app.get('/map', function(req, res){
    console.log('user at map');
    name_array = [];
    res.sendFile(__dirname + '/map.html');
});

app.get('/clickpage', function(req, res){
    var click = req.query.clicked;
    var feed_dict = {c: click};
    res.render('clicks', feed_dict);
});

function reqNames(req, res, next){
    console.log(req.query.user_name);
    name_array.push(req.query.user_name);
    next();
}

app.get('/namepage', [reqNames], function(req, res){
    var info_dict = {info_list : name_array};
    console.log(info_dict);
    res.render('name_list', info_dict);
});

// -------------- cookie configuration -------------- //
 
app.use(cookieSession({
  name: 'snorkles',                         // ==> the name of the cookie is snorkles      
  keys: ['enkey1', 'enkey2']                // ==> these two keys encrypt the cookie. 
}));
 
// -------------- express endpoints -------------- //

function logged_in(req, res, next){
    if(theQuery !== undefined){
        view_dict = {username: theQuery, views: 'You have logged in successfully, and have unlimited views.'};
        res.render('content', view_dict);
    }
    next();
}

function callback(word, bag, has_wildcard, char, index) {
    if (this.bag !== undefined) {
        var indiv_letter_dict = {};
        wildcard_count = 0;
        for (var idx = 0; idx < word.length; idx++) {
            if (!(word.charAt(idx) in indiv_letter_dict)) {
                indiv_letter_dict[word.charAt(idx)] = 0;
            }
        }
        for (var idx1 = 0; idx1 < word.length; idx1++) {
            indiv_letter_dict[word.charAt(idx1)]++;
            if (!(this.bag.includes(word.charAt(idx1)))) {
                if (this.has_wildcard !== undefined && wildcard_count === 0) {
                    wildcard_count++;
                }
                else {
                    return false;
                }
            }
            else {
                if (indiv_letter_dict[word.charAt(idx1)] > letter_dict[word.charAt(idx1)]) {
                    if (this.has_wildcard !== undefined) {
                        if (wildcard_count == 1) {
                            return false;
                        }
                        wildcard_count++;
                        continue;
                    }
                    return false;
                }
            }
        }
    }
    if (this.char !== '' && this.index !== '') {
        if (word.charAt(this.index) != this.char) {
            return false;
        }
    }
    return true;
    // return word.charAt(this.index) == this.char;
}

app.get('/content', [logged_in], function (req, res) {

  // req.session is the cookie. It defaults to an object that you can add key-value pairs to.  
  // req.session is 'silently' passed in as part of the request AND returned back to the browser. The data in req.session is stored in the browser 
  //   until the client makes another request.
  // the contents of req.session are unique to each browser
  // req.session will live in the cookies of the browser with the name provided
  //   (in this example, "snorkles") until the user deletes the cookie.

    if(theQuery === undefined){
        if( typeof(req.session.views)=='undefined' ) {            // if the cookie has not been set
            req.session.views = 1;                                //   set it to 1;
        } 
        else {                                                  // otherwise, 
            req.session.views++;                                  //   increment its value
        }
        if (req.session.views <= 5){
            view_dict = {username: '', views : 'You have visited this page ' + req.session.views + ' times. \
            Content is blocked once you have visited more than 5 times. Login to get unlimited visits.'};
            res.render('content', view_dict);
        }
        else{
            res.sendFile(__dirname + '/blocked.html');
        }
    }
});

app.get('/reset', function (req, res, next) {
  req.session = null;                                       // programmatically deletes the cookie
  res.send('cookie has been reset');
});

app.get('/login', function(req, res){
    theQuery = req.query.username;
    var login_dict = {message : ''};
    if(theQuery === undefined)
        login_dict = {message : 'Type ?username=NAME at the end of the url to login. You can replace NAME with your name.'};
    else
        login_dict = {message : 'Welcome ' + theQuery + '! Go to https://user.tjhsst.edu/2020sliu/content to view the picture unlimited times.'};
    res.render('login', login_dict);
});

app.get('/logout', function(req, res){
    theQuery = undefined;
    res.sendFile(__dirname + '/logout.html');
});

app.get('/oauth', function (req, res) {
    // Here we ask if the token key has been attached to the session...
    if (typeof(req.session.token) == 'undefined') {
        // ...if the token does not exist, this means that the user has not logged in
        req.session.views = 0;                                //   set it to 1;
    
        // THIS GENERATES AN HTML PAGE BY COMBINING STRINGS.
        res.render('profile_page', {auth_uri:authorizationUri});

    } else {
        // ... if the user HAS logged in, we'll send them to a creepy page that knows their name

        // Now, we create a personalized greeting page. Step 1 is to 
        // ask ION for your name, which means conducting a request in the
        // background before the user's page is even rendered.

        // To start the process of creating an authenticated request, 
        // I take out the string 'permission slip' from 
        // the token. This will be used to make an ION request with your
        // credentials                                                 // otherwise, 
        req.session.views++;                                  //   increment its value
        var access_token = req.session.token.token.access_token;
        
        // Next, construct an ION api request that queries the profile using the 
        // individual who has logged in's credentials (it will return) their
        // profile
        var my_ion_request = 'https://ion.tjhsst.edu/api/profile?format=json&access_token='+access_token;

        // Perform the asyncrounous request ...
        // [seems like a PERFECT place for middleware!!!]
        request.get( {url:my_ion_request}, function (e, r, body) {
            // and here, at some later (indeterminite point) we land.
            // Note that this is occurring in the future, when ION has responded
            // with our profile.

            // The response from ION was a JSON string, so we have to turn it
            // back into a javascript object
            var res_object = JSON.parse(body);
        
            // from this javascript object, extract the user's name
            var user_name = res_object.short_name;
            req.session.fullname = res_object.ion_username;
            var counselor = res_object.counselor.full_name;
            console.log(accessSQL);
            if (accessSQL) {
                pool.query('CALL new_user(?)', [req.session.fullname], function(error, results, fields) {
                    if (error) throw error;
                    console.log(req.session.fullname + ' added to SQL table');
                })
            };
            res.render('oauth', {username_ion: user_name, counselor_ion: counselor, page_views: req.session.views});
        });
    }
});

// -------------- intermediary login helper -------------- //

// The name '/login' here is not arbitrary!!! The location absolutely
// must match ion_redirect_uri for OAUTH to work!
//
//  HOWEVER - THE USER WILL NEVER ACTUALLY TYPE IN https://user.tjhsst.edu/pckosek/login_worker!!!!
//    This is a hidden endpoint used for authentication purposes. It is used as 
//    an intermediary worker that ultimately redirects authenticaed users

app.get('/login_worker', async function (req, res) {

    // The whole purpose of this 'get' handler is to attach your  token to the session. 
    // Your users should not be going here if they are not trying to login in - and you
    // should not be attaching your login token in any other methods (like the default landing page)

    // Step one. Assuming we were send here following an authentication and that there is a code attached.
    if (typeof(req.query.code) != 'undefined') {
        
        // This code was generated by ION. We need it to...
        var theCode = req.query.code;

        // .. construct options that will be used to generate a login token
        var options = {
            code: theCode,
            redirect_uri: ion_redirect_uri,
            scope: 'read'
         };

        // This code will be passed back to ion to request a token.
        var result = await oauth2.authorizationCode.getToken(options);      // await serializes asyncronous fcn call
        var token = oauth2.accessToken.create(result);
        
        // attach the token to the cookie
        req.session.token = token;
        req.session.logged_in = true;
        req.session.cookie = 0;

        // Finally, we are going to redirect the user back to the home page.
        // They'll never even know that they landed on this '/login' helper
        // because we are going to redirect them - but there will be a token
        // attached to the cookie this time upon arrival - which will render 
        // a different page this time.
        res.redirect('https://user.tjhsst.edu/2020sliu/oauth');
        
    } else {
        res.send('no code attached')
    }
});

app.get('/logout_oauth', function(req, res) {
    req.session = null;                                       // programmatically deletes the cookie
    res.send('Cookie has been reset');
});

app.get('/scrabble', function (req, res){
    if (req.session.logged_in) {
        lines = fs.readFileSync(__dirname + '/resources/enable1.txt', function (err, data) {
            if (err) throw err;
            console.log(data);
        }).toString();
        words = lines.split('\n');
        res.sendFile(__dirname + '/scrabble.html');
    }
    else {
        req.session.views = 0;
        res.render('profile_page', {auth_uri:authorizationUri});
    }
});

app.get('/getwords', function (req, res){
    // console.log(req.query.letter_pos);
    wildcard_count = 0;
    letter_dict = {};
    if (req.query.word_bag !== undefined) {
        for (var idx = 0; idx < req.query.word_bag.length; idx++) {
            if (!(req.query.word_bag.charAt(idx) in letter_dict)) {
                letter_dict[req.query.word_bag.charAt(idx)] = 1;
            }
            else {
                letter_dict[req.query.word_bag.charAt(idx)]++;
            }
        }
    }
    console.log({bag: req.query.word_bag, has_wildcard: req.query.wildcard, 
        char: req.query.letter, index: req.query.letter_pos});
    var filter_array = words.filter(callback, {bag: req.query.word_bag, has_wildcard: req.query.wildcard, 
        char: req.query.letter, index: req.query.letter_pos});
    console.log(filter_array);
    res.render('scrabble_words', {letter_list:filter_array});
    // res.send('Possible words:\n' + filter_array);
});

app.get('/clicker', function (req, res) {
    if (req.session.logged_in) {
        pool.query('SELECT * FROM students', function(error, results, fields) {
            if (error) throw error;
            console.log(results);
            score_array = [];
            for (i = 0; i < results.length; i++) {
                score_array.push(results[i].s_name + ': ' + results[i].score);
            }
            pool.query('SELECT score, booster FROM students WHERE s_name=?', [req.session.fullname], function(error, results, field) {
                if (error) throw error;
                res.render('clicker', {username: req.session.fullname, cookies: results[0].score, boost: results[0].booster, s_array: score_array.join("\n")});
            });
        });
    }
    else {
        req.session.views = 0;
        accessSQL = true;
        res.render('profile_page', {auth_uri:authorizationUri});
    }
});

app.get('/cookie_writer', function (req, res) {
    // req.session.cookie++;
    // menu_item = req.query.menu_item;
    console.log(req.session.fullname);
    pool.query('UPDATE students set score = score + 1 + 5 * booster WHERE s_name=?', [req.session.fullname], function(e, r, f) {
        if (e) throw e;
        pool.query('SELECT score FROM students WHERE s_name=?', [req.session.fullname], function (error, results, fields) {
            if (error) throw error;
            // CONSTRUCT AND SEND A RESPONSE
            console.log(results);
            // var outstr = '' + results[0].score;
            var outObj = {cookieCount: results[0].score};
            console.log(outObj);
            res.send(' ' + outObj['cookieCount']);
        });
    });
});

app.get('/reset_clicker', function (req, res) {
    pool.query('UPDATE students set score = 0, booster = 0 WHERE s_name=?', [req.session.fullname], function(e, r, f) {
        if (e) throw e;
        pool.query('SELECT score, booster FROM students WHERE s_name=?', [req.session.fullname], function (error, results, fields) {
            if (error) throw error;
            // CONSTRUCT AND SEND A RESPONSE
            console.log(results);
            var outObj = {cookie_count: results[0].score, grandma_count: results[0].booster};
            console.log(outObj);
            res.send(outObj);
        });
    });
});

app.get('/grandma_clicker', function (req, res) {
    pool.query('CALL new_grandma(?)', [req.session.fullname], function(e, r, f) {
        if (e) throw e;
        pool.query('SELECT score, booster FROM students WHERE s_name=?', [req.session.fullname], function (error, results, fields) {
            if (error) throw error;
            // CONSTRUCT AND SEND A RESPONSE
            console.log(results);
            var outObj = {cookie_count: results[0].score, grandma_count: results[0].booster};
            console.log(outObj);
            res.send(outObj);
        });
    });
});

app.get('/scoreboard_writer', function (req, res) {
    pool.query('SELECT score FROM students WHERE s_name=?', [req.session.fullname], function(error, results, fields) {
        if (error) throw error;
        seen_name = false;
        for (i = 0; i < score_array.length; i++) {
            if (score_array[i].includes(req.session.fullname)) {
                score_array[i] = req.session.fullname + ': ' + results[0].score;
                seen_name = true;
                break;
            }
        }
        if (!seen_name) {
            score_array.push(req.session.fullname + ': ' + results[0].score);
        }
        res.send({s_array: score_array});
    });
});

// -------------- listener -------------- //
// The listener is what keeps node 'alive.' 

var listener = app.listen(app.get('port'), function() {
  console.log( 'Express server started on port: '+listener.address().port );
});