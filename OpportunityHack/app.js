var express = require('express'),
path = require('path'),
favicon = require('serve-favicon'),
logger = require('morgan'),
cookieParser = require('cookie-parser'),
bodyParser = require('body-parser'),
multer = require('multer'),
constants = require('./helper/constants');

var apiRoute = require('./routes/api');

var app = express();

//view engine setup
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));




app.use(function(req,res,next){
	
	res.header('Access-Control-Allow-Origin', '*');
	// Specify allowed headers that you require, If you require to provide access any more header values specify here
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	// This is for sending cookie data with the request, as by default they're not sent and this value is set to false, for security reasons. Thus setting it to True explicitly
	res.header("Access-Control-Allow-Credentials", true);
	
	if(req.url === "/" || req.url === "/compare" || req.url === "/calculate"){
			next();
	}
		else{
				console.log("err 56");
				res.render("error");
			}
});


app.use('/',apiRoute);


//catch 404 and forward to error handler
app.use(function(req, res, next) {
	console.log("err 91");
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

//error handlers

//development error handler
//will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		console.log("err 103");
		res.status(err.status || 500);
		res.render('error');
	});
}

//production error handler
//no stack traces leaked to user
app.use(function(err, req, res, next) {
	console.log("err 112");
	res.status(err.status || 500);
	res.json({
		message: err.message,
		error: {}
	});
});

app.listen(5000,function(){
	console.log("Client Started ... port 5000");
});

module.exports = app;