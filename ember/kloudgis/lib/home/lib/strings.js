/**
* Localize the page
**/
var fr = { 
	"_homeTitle": "Kloudgis",
	"_sandboxesListOne": "Votre projet:",
	"_sandboxesList": "Vos %@ projets:",
	"_sandboxesNothing": "Vous n'avez pas de projet.",
	"_errorLoading": "Erreur lors du chargement des projets.",
	"_welcomeUser": "Bienvenue %@",
	"_wrong-membership": "Vous n'être pas membre de ce projet.",
	"_sbDateFormat": "%@/%@/%@",
	"_by" : "Par",
	"_createSandboxTitle": "Créer un nouveau sandbox",
	"_add" : "Ajouter",
	"_cancel": "Annuler",
	"_create": "Créer",
	"_sandboxName": "Le nom du projet",
	"_nameAlreadyTaken" : "Vous avez déjà un projet de ce nom."
	
};

var en = {
	"_homeTitle": "Kloudgis",
	"_sandboxesListOne": "Your projet:",
	"_sandboxesList": "Your %@ projets:",
	"_sandboxesNothing": "You don't have any project.",
	"_errorLoading": "Cannot load the projects.",
	"_welcomeUser": "Welcome %@",
	"_wrong-membership": "You are not a member of this project.",
	"_sbDateFormat": "%@/%@/%@",
	"_by" : "By",
	"_createSandboxTitle": "Create a new sandbox",
	"_add" : "Add",
	"_cancel": "Cancel",
	"_create": "Create",
	"_sandboxName": "The Sandbox Name",
	"_nameAlreadyTaken" : "You already have a sandbox with that name"
};

if(KG.lang === 'fr'){
	SC.STRINGS = fr;
}else{
	SC.STRINGS = en;
}

//do the localize after the rendering
SC.run.schedule('render',null, function(){
	console.log('localize page');
	document.title = "_homeTitle".loc();
});