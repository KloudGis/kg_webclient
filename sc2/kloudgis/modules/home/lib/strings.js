var fr = { 
	"_homeTitle": "Kloudgis",
	"_sandboxesList": "Vos projets:",
	"_sandboxesNothing": "Vous n'avez pas de projet.",
	"_errorLoading": "Erreur lors du chargement des projets."
};

var en = {
	"_homeTitle": "Kloudgis",
	"_sandboxesList": "Your projets:",
	"_sandboxesNothing": "You don't have any project.",
	"_errorLoading": "Cannot load the projects."
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