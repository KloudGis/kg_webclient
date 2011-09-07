
var fr = { 
	"_signupTitle": "Kloudgis - Compte",
    "_Empty": "Le champ est obligatoire.",
	"_signupKloudgis": "Créer un compte Kloudgis",
	"_serverError": "Erreur du serveur",
	"_nullTokenError" : "Erreur lors de l'authentification.",
	"_pwdMinLength": "Doit contenir au minimum 6 caractères."
};

var en = {
	"_signupTitle": "Kloudgis - Account",
	"_Empty": "This field is required.",
	"_signupKloudgis": "Signup to Kloudgis",
	"_serverError": "Server error.",
	"_nullTokenError" : "Authentification error.",
	"_pwdMinLength": "Must contained atleast 6 characters."
};

if(KG.lang === 'fr'){
	SC.STRINGS = fr;
}else{
	SC.STRINGS = en;
}