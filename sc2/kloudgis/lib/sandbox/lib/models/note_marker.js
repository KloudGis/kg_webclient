KG.NoteMarker = KG.Record.extend({

	lon: SC.Record.attr(Number),
    lat: SC.Record.attr(Number),
	
	isOnMap: NO,
	
	features: SC.Record.toMany('KG.Note',{
			isMaster: YES
	}),
	
	featureCount: function(){
		return this.getPath('features.length');
	}.property('features.length'),
	
	title: function(){
		var count = this.get('featureCount');
		var title;
		if(count > 1){
			title = '_Notes'.loc(count);
		}else{
			title = '_Note'.loc();
		}
		return title;
	}.property('featureCount'),
	
	tooltip: function(){
		return this.get('title');
	}.property('title')
});