var request = require('request');

var params = {
    url : 'https://api.weather.gov/points/39.7456,-97.0892',  // /+req.query.lat
    headers : {
     'User-Agent': 'request'
  }
    
};
// url : 'https://ion.tjhsst.edu/api/schedule/2019-02-07?format=json'
// url : 'https://api.weather.gov/points/39.7456,-97.0892'
function callback(e, r, body) {

    var obj = JSON.parse(body);
    console.log( obj );
}
console.log(5); //prints 5 first, then obj because callback is called below
request.get( params, callback );

//npm JS  
//code beautify