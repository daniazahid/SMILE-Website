var mongoose= require('mongoose');
var passportLocalMongoose= require('passport-local-mongoose');
var ID= require('short-id');
ID.configure({
	length: 4,
});

var UserSchema= new mongoose.Schema({
	username: String,
	password: String,
	isAdmin: {type: Boolean, default: false},
	patientid: {type: String, default: "null"},
	Employee:{
		isEmployee: {
		 type: Boolean, default: false} ,
		attendanceStart: { type: Boolean, default: false},
		attendanceEnd: {type: Boolean, default: false},
		 employeeid: {
			 type: String,
			 default:"null"
		 },
		Markattendance : [String],
		MarkCheckout : [String],
	},
	isForm : {type: Boolean, default: false}
	
});

UserSchema.plugin(passportLocalMongoose);
module.exports= mongoose.model("User",UserSchema);