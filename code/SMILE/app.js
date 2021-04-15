var express= require('express');
var app= express();
var bodyParser= require("body-parser");
var mongoose = require('mongoose');
var flash= require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var Campground=require('./models/campground');
var Comment= require('./models/comment');
var User = require('./models/user');
var Patient=require('./models/patientInfo');
var Dentist=require('./models/DentistInfo');
var Appointment= require('./models/appointment');
var seedDB= require('./seeds');
var commentRoutes= require('./routes/comments');
var campgroundRoutes= require('./routes/campgrounds');
var indexRoutes= require('./routes/index');
var methodOverride= require('method-override');


mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
// seedDB();

app.use(methodOverride("_method"));
app.use(flash());
app.use(require("express-session")({
	secret: "Rusty wins cutest dog!",
	resave: false,
	saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	res.locals.info=req.flash("info");
	res.locals.warning=req.flash("warning");
	next();
})

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});