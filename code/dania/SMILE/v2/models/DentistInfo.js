var mongoose= require('mongoose');


var DentistSchema= new mongoose.Schema({
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String,
		employeeid: String
	},
	
	
all :{
	firstname: String,
	lastname: String,
	address1 : String,
	address2: String,
	city: String,
	state: String,
	zip : String,
	email: String,	
	gender: String,
	
		home: String,
		work: String,
		cell: String,
	


		speciality: String,
	    experience: String,
	    //timings
	    monday: String,
		tuesday: String,
		wednesday: String,
		thursday: String,
		friday: String,
		saturday: String,
		consultationfee: String,
		
		
	},
	basepay: { type: Number, default: 25000},
	patientNoChecked:{type: Number, default: 0},
	
});


module.exports= mongoose.model("Dentist",DentistSchema);
