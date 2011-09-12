KG.NoteMarker = KG.Record.extend({

	lon: SC.Record.attr(Number),
    lat: SC.Record.attr(Number),
	
	isOnMap: NO,
	
	features: SC.Record.toMany('KG.Note',{
			isMaster: YES
	})
});