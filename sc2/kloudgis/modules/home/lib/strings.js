var fr = { 
	"_homeTitle": "Kloudgis",
	"_sandboxesList": "Vos projets:",
	"_sandboxesNothing": "Vous n'avez pas de projet."
};

var en = {
	"_homeTitle": "Kloudgis",
	"_sandboxesList": "Your projets:",
	"_sandboxesNothing": "You don't have any project."
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