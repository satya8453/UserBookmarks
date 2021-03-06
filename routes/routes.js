/**
 * New node file
 */

module.exports = function(app, passport) {

	var User = require('../model/user.js');

	// Reigster New User Page============================
	app.get('/signUp', function(req, res) {
		console.log('called');
		res.render('signUp.ejs',
				{
			errors :{ signup : req.flash('signupMessage')}
				});
	});

	app.get('/', function(req, res) {
		console.log('fro index+++');
		res.render('index.ejs');
	});

	app.get('/welcome', function(req, res) {
		res.render('welcome.ejs');
	});

	app.get('/addbookmarks', isLoggedIn, function(req, res) {
		console.log(req.user.userDetails.email + " "
				+ req.user.userDetails.password + " addbook");
		res.render('add_Bookmark.ejs');
	});

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.render('login.ejs',{
			errors :{ login : "Logged out successfully. Log in again"}
		});
	});

	app.get('/login', function(req, res) {
		res.render('login.ejs',{
			errors :{ login : req.flash('loginMessage')}
		});
	});

	app.get('/showbookmarks', function(req, res) {
		res.render('show_bookmarks.ejs', {
			userd : req.user
		});
	});

	// POST requests

	// Register New User function ============
	app.post('/register',signUpValidator, passport.authenticate('local-signup', {
		successRedirect : '/welcome', // redirect to the secure profile
										// section
		failureRedirect : '/signup', // redirect back to the signup page if
										// there is an error
		failureFlash : true
	// allow flash messages
	}));

	app.post('/addlink', isLoggedIn, function(req, res) {
		console.log("inside add link" + req.body.link + " " + req.body.tags);
		User.update({
			'userDetails.email' : req.user.userDetails.email
		}, {
			$push : {
				'bookmarks' :  {
					'link' : req.body.link,
					'tags' : req.body.tags
				} 
			}
		}, function(err, numberAffected, raw) {
			if (err) {
				console.log(err);
				res.render("welcome.ejs");
			}
			// console.log("done dealsss "+numberAffected);
			res.redirect("/showbookmarks");
		});
		console.log(req);
	});

	app.post('/login',loginValidator, passport.authenticate('local-login', {
		successRedirect : "/welcome",
		failureRedirect : "/login",
		failureFlash : true
	}));

	app.get("/error_in_add", function(req, res) {
		console.log("inside error console " + req);
		console.log(req.err);
		res.render('welcome.ejs');
	});
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	console.log("authenticated " + req.user.userDetails.email);
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
};

function signUpValidator(req,res,next){
	console.log('inside reg validator');
	req.assert('name','Name is required').notEmpty();
	req.assert('email','invalid email id').isEmail();
	req.assert('email','Email is required').notEmpty();
	req.assert('password','Passwrod is required').notEmpty();
	
	var errors = req.validationErrors(true);
	if (errors){
		res.render('signUp.ejs',{
			errors:errors
		});}
	else
		return next();
}


function loginValidator(req,res,next){
	console.log('inside reg validator');
	req.checkBody('email','Invalid Email').isEmail();
	req.checkBody('email','Email is required').notEmpty();
	req.checkBody('password','Passwrod is required').notEmpty();
	
	var errors = req.validationErrors(true);
	if (errors){
		res.render('login.ejs',{
			errors:errors
		});}
	else
		return next();
}