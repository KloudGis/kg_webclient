/**
* Localize the login page.
**/
var fr = { 
	"_loginTitle": "Se connecter à Kloudgis",
	"_email" : "Courriel:",
	"_pwd": "Mot de passe:",
	"_login": "Connecter",
	"_signupTitle": "Pas encore membre ?",
	"_signup": "Créer un compte",
	"_rememberMe": "Rester connecter",
    "_serverError": "Erreur du serveur.",
	"_serverDown" : "Le serveur n'est pas disponible.",
	"_unexpectedError": "Erreur interne.",
	"_unauthorized": "Le courriel ou le mot de passe est incorrect.",
	"_UsernameHint": "Votre courriel",
	"_PasswordHint": "Mot de passe",
	"_UsernameRequired": "Le courriel est obligatoire.",
	"_PasswordRequired": "Le mot de passe est obligatoire."
};

var en = {
	"_loginTitle": "Login to Kloudgis",
	"_email" : "Email:",
	"_pwd": "Password:",
	"_login": "Sign in",
	"_signupTitle": "Not yet member ?",
	"_signup": "Create an account",
	"_rememberMe": "Stay signed in",
	"_serverError": "Server error.",
	"_serverDown" : "The server is offline.",
	"_unexpectedError": "Internal error.",
	"_unauthorized": "The email or password you entered is incorrect.",
	"_UsernameHint": "Your Email",
	"_PasswordHint": "Mot de passe",
	"_UsernameRequired": "The email is required.",
	"_PasswordRequired": "The password is required."
};

if(KG.lang === 'fr'){
	jQuery.extend(Ember.STRINGS, fr);
}else{
	jQuery.extend(Ember.STRINGS, en);
}
