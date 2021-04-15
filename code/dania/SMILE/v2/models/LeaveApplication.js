var mongoose= require('mongoose');
var leaveSchema= new mongoose.Schema({
	all:{
		firstname: String,
	lastname: String,
	designation: String,
	employeeid: String,
	LeaveType: [String],
	fromDate: String,
	toDate: String,
	LeaveNo: String,
	reason: String,
	todayDate: String,	
	},
	
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
	
});

module.exports= mongoose.model("Leave",leaveSchema);