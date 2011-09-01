sc_require('models/record')
CoreKG.NoteMarker = CoreKG.Record.extend({
	
	lon: SC.Record.attr(Number),
    lat: SC.Record.attr(Number),
	
	isOnMap: NO,
	
	notes: SC.Record.toMany('CoreKG.Note',{
			isMaster: YES
	})
});