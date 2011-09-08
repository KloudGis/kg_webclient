var fr = { 
	"_homeTitle": "Kloudgis",
	"_sandboxesList": "Vos projets:",
};

var en = {
	"_homeTitle": "Kloudgis",
	"_sandboxesList": "Your projets:",
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
	$('#sandboxes-title').text("_sandboxesList".loc());
});