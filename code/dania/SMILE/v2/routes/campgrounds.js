var express= require('express');
var router= express.Router();
var Campground= require('../models/campground');
var Appointment= require('../models/appointment');
var Leave= require('../models/LeaveApplication');
var middleware= require('../middleware');
var Patient= require('../models/patientInfo');
var Dentist= require('../models/DentistInfo');
var User= require('../models/user');
var moment1= require('moment');
var moment= require('moment-timezone');
router.get('/campgrounds', function(req,res){
	Campground.find({},function(err,allCampgrounds){
		if(err){
			console.log(err);
		}else{
			
			res.render("campgrounds/index",{campgrounds: allCampgrounds, currentUser: req.user});
		}
	});
	
});
router.get('/deleteEverything', function(req,res){
	Patient.deleteOne({},function(err,allPatients){
		if(err){
			console.log(err);
		}else{
			
		}
	});
	Dentist.deleteOne({},function(err,allDentists){
		if(err){
			console.log(err);
		}else{
			
			
		}
		
	});
	User.deleteOne({},function(err,allUsers){
		if(err){
			console.log(err);
		}else{
			
		}
	});
	Appointment.deleteOne({},function(err,allAppointments){
		if(err){
			console.log(err);
		}else{
			
		}
	});
	Leave.deleteOne({},function(err,allLeaves){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	});
	
});
router.get("/campgrounds/payroll",middleware.isLoggedIn,function(req,res){
	User.findById(req.user._id,function(err,foundUser){
		if(err){
			console.log(err);	
		}else{
			
	Dentist.find({"author.employeeid":req.user.Employee.employeeid},function(err,dentistInfo){
			if(err){
				console.log(err);
			}else{
				if(dentistInfo[0].all.consultationfee=="Rs 2500")
				{
					var consult=2500;
				}
				else{
					var consult=1500;
				}
				
				var amount=dentistInfo[0].basepay + dentistInfo[0].patientNoChecked * consult; 
				res.render("campgrounds/payroll",{foundUser:foundUser,dentistInfo:dentistInfo,consult:consult,amount:amount});
			}	 
			});
					
		}
		
	});
	
});
router.get('/campgrounds/dentistprofileform',middleware.isLoggedIn, function(req,res){
 res.render("campgrounds/dentistprofileform");
});
router.post('/campgrounds/dentistprofileform',middleware.isLoggedIn, function(req,res){
// var author= {
// 		id: req.user._id,
// 		username: req.user.username,
// 		employeeid: req.user.Employee.employeeid,
// 	}
	if(req.body.speciality=="General Dentist"){
		
		var basepay=146000;	
	}
	if(req.body.speciality=="Pedodontist"){
		
		var basepay=276000;	
	}
	if(req.body.speciality=="Orthodontist"){
		
		var basepay=347000;	
	}
	if(req.body.speciality=="Periodontist"){
		
		var basepay=247000;	
	}
	if(req.body.speciality=="Endodontist"){
		
		var basepay=333000;	
	}
	if(req.body.speciality=="Prosthodontist"){
		
		var basepay=555000;	
	}
	if(req.body.speciality=="Oral Pathologist"){
		
		var basepay=166000;	
	}
	
	var all=req.body;
	
	var newDentist={
		// author: author,
		all:all,
		basepay:basepay,
		
	}
	console.log(newDentist);
		
			if(req.body.experience=="10 years" || req.body.experience=="15 years or more"){
		newDentist.all.consultationfee="Rs 2500";
		
	}
	
	Dentist.updateOne({"author.id":req.user._id},newDentist,function(err,newlyCreated){
		if(err){
			req.flash("error","Something went wrong. Please try again");
			console.log(err);
		}
		else{
			
				
			req.flash("success","Form submitted successfully ");
			res.redirect("/campgrounds");
			
		}
		
	})

});
router.get('/campgrounds/attendanceMarked',middleware.isLoggedIn, function(req,res){
	 var pakistan = moment.tz("Asia/Karachi");
	 var elementTobefound=pakistan.format('ll');
	var o=req.user.Employee.Markattendance;
	console.log(o.length);
	 if(o.length>1){
		var m=o.slice(o.length-1,o.length);
		var n=m.toString();
		var p=n.slice(5,17);
		
		 if(elementTobefound==p){
		req.flash("warning","Your attendance has already been marked for today");
		res.redirect("/campgrounds");
		 }
	 }
	else if(o.length==1)
	   { console.log("hello here");
		  var n=o.toString();
		console.log(n);
		  var p=n.slice(5,17);
		console.log(p);
		   if(elementTobefound==p){
		req.flash("warning","Your attendance has already been marked for today");
		res.redirect("/campgrounds");
		 }
		else{
			req.user.Employee.attendanceStart=true;
    var pakistan1 = moment.tz("Asia/Karachi");
	req.user.Employee.Markattendance.push(pakistan1.format('llll'));
	req.user.save();
	req.flash("success","Attendance Marked for " + pakistan1.format('ll'));
	res.redirect("/campgrounds");
			
		}
	 }
	else{
	req.user.Employee.attendanceStart=true;
	var pakistan1 = moment.tz("Asia/Karachi");
	req.user.Employee.Markattendance.push(pakistan1.format('llll'));
	req.user.save();
	req.flash("success","Attendance Marked for " + pakistan1.format('ll'));
	res.redirect("/campgrounds");
	}


	
});
router.get('/campgrounds/checkedOut',middleware.isLoggedIn, function(req,res){
	req.user.Employee.attendanceEnd=true;
	req.user.Employee.attendanceStart=false;
    var pakistan1 = moment.tz("Asia/Karachi");
	req.user.Employee.MarkCheckout.push(pakistan1.format('llll'));
	req.user.save();
	req.flash("success","Checked Out at " + pakistan1.format('LT') + " today");
	res.redirect("/campgrounds");
	
});


router.post('/campgrounds', middleware.isLoggedIn, function(req,res){

	var name=req.body.name;
	var image= req.body.image;
	var description= req.body.description;
	var author= {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground={
		name:name,
		image:image,
		description:description ,
		author: author
	}
	Campground.create(newCampground,function(err,newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/campgrounds");
			
		}
		
	})
	
});
router.get('/campgrounds/new', middleware.isLoggedIn, function(req,res){
 res.render("campgrounds/new"); 
	
});
router.get('/campgrounds/patientreport', middleware.isLoggedIn, function(req,res){
	User.find({},function(err,foundUsers){
		if(err){
			console.log(err);	
		}else{
			var isReport= false;
			var isRecord=false;	
		 res.render("campgrounds/patientreport", {isReport: isReport, isRecord: isRecord,foundUsers:foundUsers}); 	
		}
			
	});
	
	
});

router.post('/campgrounds/patientreport', middleware.isLoggedIn, function(req,res){
	
	var isReport=true;
	Patient.find({"author.patientid" : req.body.patientid },function(err,foundreport){
		if(err){
			console.log(err);
		}else{
			User.find({},function(err,foundUsers){
				if(err){
			console.log(err);	
		}else{
									
				if(foundreport.toString().length>0){
					var isRecord=true;
res.render("campgrounds/patientreport",{report : foundreport, isReport: isReport,isRecord: isRecord,foundUsers:foundUsers}); 	
				}
			else{
				var isRecord=false;
res.render("campgrounds/patientreport",{report : foundreport, isReport: isReport,isRecord: isRecord,foundUsers:foundUsers}); 	

			}
		}
			
	});				
		}
	});
	
});

router.post('/campgrounds/medicalprofileform',middleware.isLoggedIn, function(req,res){
	var author= {
		id: req.user._id,
		username: req.user.username,
		patientid: req.user.patientid
	}
	var all=req.body;
	
	var newPatient={
		author: author,
		all:all,
		
	}
	console.log(newPatient);
	Patient.create(newPatient,function(err,newlyCreated){
		if(err){
			req.flash("error","Something went wrong. Please try again");
			console.log(err);
		}
		else{
			req.user.isForm=true;
			req.user.save();
			req.flash("success","Form submitted successfully ");
			res.redirect("/campgrounds");
		}
		
	})

});
router.get('/campgrounds/leaveApplication',middleware.isLoggedIn, function(req,res){
	
	User.findById(req.user._id,function(err,foundUser){
		if(err){
			console.log(err);	
		}else{
			
	Dentist.find({"author.id":req.user._id},function(err,dentistInfo){
			if(err){
				console.log(err);
			}else{
				var pakistann = moment.tz("Asia/Karachi");
			var minDate=pakistann.format('YYYY-MM-DD');	
				res.render("campgrounds/leaveApplication",{foundUser:foundUser,dentistInfo:dentistInfo,minDate:minDate});
			}	 
			});
					
		}
		
	});

});
router.post('/campgrounds/leaveApplication',middleware.isLoggedIn, function(req,res){
	var all=req.body;
	
	var author= {
		id: req.user._id,
		username: req.user.username
	}
	var newLeave={
		all:all,
		author: author
	}
	
	Leave.create(newLeave,function(err,newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			req.flash("success","Your form has been sent for approval"); 
			res.redirect("/campgrounds");
		}
		
	});

});

router.post('/campgrounds/appointment',middleware.isLoggedIn,function(req,res){
	var name=req.body.name;
	var date=req.body.date;
	var time=req.body.time;
	var dentist=req.body.dentist;
	var description=req.body.description;
	var author= {
		id: req.user._id,
		username: req.user.username
	}
	var newAppointment={
		patientid:req.user.patientid,
		name:name,
		date: date,
		time:time,
		dentist:dentist,
		description:description ,
		author: author
	}
	Appointment.create(newAppointment,function(err,newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/campgrounds");
		}
		
	})
	
});



router.get('/campgrounds/newAppointment',middleware.isLoggedIn, function(req,res){
	User.find({},function(err,foundUsers){
		if(err){
			console.log(err);	
		}else{
		var pakistann = moment.tz("Asia/Karachi");
		var minDate=pakistann.format('YYYY-MM-DD');	
	res.render("campgrounds/newAppointment",{foundUsers:foundUsers,minDate:minDate});
		}
	 		
	});

});
router.get('/campgrounds/appointments',middleware.isLoggedIn, function(req,res){
	if(req.user.isAdmin){
		Appointment.find({},function(err,allAppointments){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/appointments",{appointments: allAppointments, currentUser: req.user});
		}
	});	
	}else{
		
		Appointment.find({"dentist": req.user.Employee.employeeid},function(err,allAppointments){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/appointments",{appointments: allAppointments, currentUser: req.user});
		}
	});
	}
	
});
router.get('/campgrounds/appointments/:id/appointmentEdit',function(req,res){
	Appointment.findById( req.params.id,function(err,appointment){
		if(err){
			res.redirect("/campgrounds/appointments");
		}else{
			
			User.find({},function(err,foundUsers){
		if(err){
			console.log(err);	
		}else{
		
			res.render("campgrounds/appointmentEdit",{foundUsers:foundUsers,appointment:appointment});		
		}		
	});
					

		}
	});
	
});
router.delete('/campgrounds/appointments/:id', function(req,res){
	Appointment.findByIdAndRemove(req.params.id, function(err,allAppointments){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/campgrounds/appointments");
		}
	});
});

router.put('/campgrounds/appointments/:id',function(req,res){
	console.log(req.body.appointment);
	Appointment.findByIdAndUpdate(req.params.id,req.body.appointment,function(err,updatedAppointment){
		if(err){
			res.redirect("back")
		} else{
			 
			res.redirect("/campgrounds/appointments");
		}
	});
});
router.post('/campgrounds/appointments/:id', function(req,res){
	
	Appointment.findById(req.params.id, function(err,foundAppointment){
		if(err){
			console.log(err);
		}
		else{
			foundAppointment.checked=true;
			foundAppointment.save();
			Dentist.find({"author.employeeid": req.user.Employee.employeeid},function(err,foundDentist){
				if(err){
					console.log(err);
				}else{
					
					foundDentist[0].patientNoChecked=foundDentist[0].patientNoChecked + 1;
					foundDentist[0].save();

				}
			});
			Appointment.find({},function(err,allAppointments){
				if(err){
					console.log(err);
				}
				else{
					res.redirect("/campgrounds/appointments");			
				}
			});
			
		}
	});
});

router.get('/campgrounds/medicalprofileform',middleware.isLoggedIn, function(req,res){
 res.render("campgrounds/medicalprofileform");
});

router.get('/campgrounds/medicalprofileform/:id/editMedicalProfile',middleware.isLoggedIn, function(req,res){
	
 Patient.find({"author.id":req.params.id},function(err,patient){
		if(err){
			res.redirect("/campgrounds");
		}else{
			
			res.render("campgrounds/editMedicalProfile",{patient:patient});
		}
	});
});
router.put('/campgrounds/medicalprofileform/:id', function(req,res){
	
var author= {
		id: req.user._id,
		username: req.user.username,
		patientid: req.user.patientid
	}
	var all=req.body;
	
	var updatedPatient={
		author: author,
		all:all,
		
	}
	Patient.findByIdAndUpdate(req.params.id,updatedPatient,function(err,updatedPatientInfo){
		if(err){
			res.redirect("back")
		} else{
			req.flash("success","Form updated successfully "); 
			res.redirect("/campgrounds");
		}
	});
});
router.get('/campgrounds/:id', function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}
		else{
			console.log(foundCampground);
			
			 res.render("campgrounds/show",{campground:foundCampground});
		}
	});

});

router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
		Campground.findById(req.params.id,function(err,foundCampground){
					res.render("campgrounds/edit", {campground: foundCampground});   
				  
		});
	
});
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/" + req.params.id)
		}
	});
});

router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect('/campgrounds');
		}
		else{
			res.redirect('/campgrounds');
		}
	});
});


module.exports=router;