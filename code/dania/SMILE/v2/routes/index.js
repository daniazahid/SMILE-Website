var express= require('express');
var router= express.Router();
var passport=require('passport');
var PatientID= require('short-id');
var EmployeeID= require('short-id');
var User = require('../models/user');
var Patient= require('../models/patientInfo');
var Dentist= require('../models/DentistInfo');

EmployeeID.configure({
	length: 6,
});
router.get('/', function(req,res){
	res.render("landing");
});


router.get('/register',function(req,res){
	res.render("register");
});

router.get('/about',function(req,res){
	res.render("about");
});

router.post('/register',function(req,res){
	var newUser= new User({username: req.body.username});
	if(newUser.username.substring(0,3)=="Dr."){
		newUser.Employee.employeeid=EmployeeID.generate().toUpperCase();
		newUser.Employee.isEmployee=true;
		var author ={
				id: newUser._id,
		username: newUser.username,
		employeeid: newUser.Employee.employeeid,
		}
		var patientNoChecked=0;
		var newDentist={
		author: author,
		patientNoChecked:patientNoChecked,
	}
		Dentist.create(newDentist,function(err,newlyCreated){
			if(err){
				console.log(err);
			}else{
				
			}
		});
	}
	else{
		newUser.patientid=PatientID.generate().toUpperCase().substring(0,4);
	}

	if(req.body.username==='Admin' && req.body.password==='admin123'){
		newUser.isAdmin=true;
		newUser.patientid="null";
	}
	User.register(newUser,req.body.password, function(err,user){
		if(err){
			req.flash("error",err.message);
			return res.render('register');
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to Smile " + user.username);
			res.redirect('/campgrounds');
	
			
		})
	});
});

router.get('/login',function(req,res){
	res.render("login");
	
});

router.post('/login',passport.authenticate("local" , 
	{	successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req,res){
	
});
router.get('/logout', function(req,res){
	req.user.Employee.attendanceStart=false;
	req.user.Employee.attendanceEnd=false;
	req.user.save();
	req.logout();
	req.flash("success","Logged you out");
	res.redirect('/campgrounds');
});

router.get('/profile',function(req,res){
	res.render("profile");
});

module.exports=router;