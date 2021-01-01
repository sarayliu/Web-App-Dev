app.get('/', function(req, res){
    request.get( params, callback );  //make it anonymous (below) so that it actually gets callback
    
    res.sendFile(path.join(__dirname, 'ajax_with_jquery.html')); //putting this in callback doesn't work because it doesn't have res arg
});

app.get('/', function(req, res){
    request.get( params, function(e, r, body) {
        var obj = JSON.parse(body);
        
    } );  //making it anonymous so that it actually gets callback
    
    res.sendFile(path.join(__dirname, 'ajax_with_jquery.html'));
});