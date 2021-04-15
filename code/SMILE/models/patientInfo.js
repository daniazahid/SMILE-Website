var mongoose= require('mongoose');


var PatientSchema= new mongoose.Schema({
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String,
		patientid: String
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
	


		physicianName: String,
		physicianPhone : String,
		physicianLastvisit: String,
		health : String,
		Havemedication: String,
		medication: String,
		HaveHospitalized: String,
		hopitalized: String,
		UseTobacco: String,
		tobacco: String,
		HaveAllergies: String,
		allergies: String,
		conditions : [String],
		Havebirthcontrol: String,
		Arepregnant: String,
		Arenursing: String,
	
	
	
		dentalhealth: String,
		antibiotics: String,
		pain:String,
		sensitivity: String,
		gumtreatment: String,
		gumbleed: String,
		smilelike: String,
		changesmile: String,
		teethcolor: String,
		dentalproblem: String,
		dentallastvisit: String,
		brushtimes: String,
		flosstimes: String,
		accomodation: String,
		services : [String],
		
	}
	
	
});


module.exports= mongoose.model("Patient",PatientSchema);
