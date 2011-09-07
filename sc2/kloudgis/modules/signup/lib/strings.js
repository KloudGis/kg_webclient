
var fr = { 
	"_signupTitle": "Kloudgis - Compte",
    "_Empty": "Le champ est obligatoire.",
	"_signupKloudgis": "Créer un compte Kloudgis",
	"_serverError": "Erreur du serveur",
	"_nullTokenError" : "Erreur lors de l'authentification.",
	"_pwdMinLength": "Doit contenir au minimum 6 caractères.",
	"_email" : "Courriel",
	"_pwd": "Mot de passe",
	"_name": "Nom complet",
	"_company": "Compagnie",
	"_location": "Emplacement",
	"_createAccount": "Créer"
};

var en = {
	"_signupTitle": "Kloudgis - Account",
	"_Empty": "This field is required.",
	"_signupKloudgis": "Signup to Kloudgis",
	"_serverError": "Server error.",
	"_nullTokenError" : "Authentification error.",
	"_pwdMinLength": "Must contained atleast 6 characters.",
	"_email" : "Email",
	"_pwd": "Password",
	"_name": "Full Name",
	"_company": "Company",
	"_location": "Location",
	"_createAccount": "Create"
};

if(KG.lang === 'fr'){
	SC.STRINGS = fr;
}else{
	SC.STRINGS = en;
}

//do the localize after the rendering
SC.run.schedule('render',null, function(){
	console.log('localize page');
	document.title = "_signupTitle".loc();
	$("#kloud-welcome").text("_signupKloudgis".loc());
	$("#email-label").text("_email".loc());
	$("#pwd-label").text("_pwd".loc());
	$("#name-label").text("_name".loc());
	$("#company-label").text("_company".loc());
	$("#location-label").text("_location".loc());
	$("#create-button").text("_createAccount".loc());	
});