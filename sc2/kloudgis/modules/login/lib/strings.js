
var fr = { 
    "_serverError": "Erreur du serveur.",
	"_unexpectedError": "Erreur interne.",
	"_unauthorized": "Le courriel ou le mot de passe est incorrect.",
	"_UsernameHint": "Votre courriel",
	"_PasswordHint": "Mot de passe",
	"_UsernameRequired": "Le courriel est obligatoire.",
	"_PasswordRequired": "Le mot de passe est obligatoire."
};

var en = {
	"_serverError": "Server error.",
	"_unexpectedError": "Internal error.",
	"_unauthorized": "The email or password you entered is incorrect.",
	"_UsernameHint": "Your Email",
	"_PasswordHint": "Mot de passe",
	"_UsernameRequired": "The email is required.",
	"_PasswordRequired": "The password is required."
};

if(KG.lang === 'fr'){
	SC.STRINGS = fr;
}else{
	SC.STRINGS = en;
}