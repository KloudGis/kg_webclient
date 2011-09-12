KG.core_note = SC.Object.create({
	
	refreshMarkers: function() {
        var bounds = KG.core_leaflet.getFatBounds();
        var dist = KG.core_leaflet.pixelsToWorld(20);
        if (KG.noteMarkersController.get('content')) {
			var content = KG.noteMarkersController.get('content');
			if(content.get('query') && content.get('query')._response){
				console.log('*** cancel note marker query');
				content.get('query')._response.cancel();
				content.get('query')._response = null;
			}
            content.destroy();
        }
        var query = SC.Query.remote(KG.NoteMarker, {
            query_url: '/api_data/protected/notes/clusters?sw_lon=%@&ne_lat=%@&ne_lon=%@&sw_lat=%@&distance=%@&sandbox=%@'.fmt(bounds.getPath('sw.lon'), bounds.getPath('sw.lat'), bounds.getPath('ne.lon'), bounds.getPath('ne.lat'), dist, KG.get('active_sandbox'))
        });
        var newMarkers = KG.store.find(query);
        newMarkers.addObserver('status', this, this.markersReady);
        KG.noteMarkersController.set('content', newMarkers);
    },
	
	markersReady: function(markers, key, nothing, context) {
        if (markers.get('status') & SC.Record.READY) {
            markers.removeObserver('status', this, this.markersReady);
			var rtype = markers.getPath('query.recordType');
            var loadedMarkers = KG.store.find(rtype);
            loadedMarkers.forEach(function(old) {
                //console.log('remove old marker %@'.fmt(old));
                KG.core_leaflet.removeMarker(old);
                old.set('isOnMap', NO);
				if(markers.indexOf(old) === -1){
					KG.store.unloadRecord(rtype, old.get('id'));
				}
            });
            var i;
            for (i = 0; i < markers.get('length'); i++) {
                var marker = KG.noteMarkersController.objectAt(i);
                if (marker) {
                    if (!marker.get('isOnMap')) {
						var view = SC.View.create({
						  	templateName: 'notes-marker-popup',
						});
                        KG.core_leaflet.addMarker(marker, view, this, this.markerClicked);
                        marker.set('isOnMap', YES);
                    }
                }
            }
        }
    },

	_marker: null,
	
	markerClicked: function(marker){
		this._marker = marker;
		var notes = marker.get('features');
		KG.notePopupController.set('content', notes);
		var len = notes.get('length');
		for (i = 0; i < len; i++) {
            var note = notes.objectAt(i);
            note.onReady(null, function(){setTimeout(function(){KG.core_leaflet.refreshMarkerPopup(marker);},1)});
        }
	}
	
});