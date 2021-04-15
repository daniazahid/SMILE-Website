var mongoose= require('mongoose');
var appointmentSchema= new mongoose.Schema({
	patientid: String,
	name: String,
	date: String,
	time: String,
	dentist: String,
	description: String,
	checked: {type: Boolean, default: false},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
	//,
	//  comments: [
	// {
	// type: mongoose.Schema.Types.ObjectId,
	// ref: "Comment"
	// }
	// ]
});

module.exports= mongoose.model("Appointment",appointmentSchema);