
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');
var PriceProvider = require('./PriceProvider').PriceProvider;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var priceProvider = new PriceProvider('localhost', 27017);
// Routes

app.get('/', function(req, res){
    priceProvider.findAll( function(error,docs){
        res.render('index.jade', {
            locals: {
                title:'prices',
                prices:docs
            }
        });
    })
});

app.get('/search', function(req, res){
    priceProvider.findByName(req.param('name'), function(error,result){
        res.send(JSON.stringify(result), { layout: false });
    })
});

app.listen(3000);
