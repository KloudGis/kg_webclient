var fr = { 
	"_Map": "Carte",
	"_Note": "Note",
	"_Notes": "%@ Notes"
};

var en = {
	"_Map": "Map",
	"_Note": "Note",
	"_Notes": "%@ Notes"
};

if(KG.lang === 'fr'){
	SC.STRINGS = fr;
}else{
	SC.STRINGS = en;
}

//do the localize after the rendering
SC.run.schedule('render',null, function(){
	console.log('localize page');
});