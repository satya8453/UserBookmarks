
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');
var app = express();

var passport = require('passport');
var session      = require('express-session');

var flash    = require('connect-flash');

var mongoose = require('mongoose');
var dbConfig = require('./config/database.js');
var User = require('./model/user.js');

mongoose.connect(dbConfig.url);

require('./config/passport')(passport); // pass passport for configuration


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.multipart());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

//required for passport
app.use(express.cookieParser());
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


//routes ======================================================================
require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}



/*app.post("/register",function(req,res){
	var user=new User();
	user.userDetails.name = req.body.name;
	user.userDetails.email = req.body.email;
	user.userDetails.password = user.generateHash(req.body.password);
	console.log(user);
	user.save(function(err,user) {
          if (err){
              console.log(err);
              res.render('SignUp.ejs');
          }
      });
	console.log(user);
});*/


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
