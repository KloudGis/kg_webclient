KG.core_note = SC.Object.create({

    _bounds: null,

    _div_active_note: null,
    _view_active_note: null,
    _note: null,
    _new_note_marker: null,

    locateNote: function() {
		KG.core_leaflet.cleanUpNewNoteMarker();
        var center = KG.core_leaflet.getCenter();
        var note = KG.store.createRecord(KG.Note, {
            coordinate: {
                x: center.get('lon'),
                y: center.get('lat')
            }
        });
        var marker = KG.core_leaflet.addNewNoteMarker("_moveNote".loc());
		this._new_note_marker = marker;
        return YES;
    },

    createNote: function() {		
        if (SC.none(this._new_note_marker)) {
            return NO;
        }
		var noteDiv = this._div_active_note;
		var marker = this._new_note_marker;
        var note = KG.store.createRecord(KG.Note, {
            coordinate: {
                x: marker.get('coordinate').x,
                y: marker.get('coordinate').y
            }
        });
        this._note = note;
        KG.activeNoteController.set('content', note);
        if (SC.none(this._div_active_note)) {
            this._div_active_note = document.createElement('div');
			noteDiv = this._div_active_note;
            this._view_active_note = SC.View.create({
                templateName: 'new-note-popup',
            });
            this._view_active_note.appendTo(noteDiv);
        }     
        setTimeout(function() {
            KG.core_leaflet.refreshMarkerPopup(marker, noteDiv);
			KG.core_leaflet.openMarkerPopup(marker);
            $(".new-note-popup input").focus();
        },
        1);
        return YES;
    },

    confirmCreateNote: function() {
		console.log('about to save the note!');
        var note = this._note;
        this._note = null;
        if (!SC.none(note)) {
            KG.store.commitRecords();
            note.onReady(null,
            function() {
                KG.core_note.refreshMarkers(YES);
            });
        }
		KG.core_leaflet.cleanUpNewNoteMarker();
    },

    revertCreateNote: function() {
		console.log('about to rollback the note!');
        var note = this._note;
        this._note = null;
        if (!SC.none(note)) {
            KG.store.unloadRecord(undefined, undefined, note.get('storeKey'));
            KG.core_leaflet.cleanUpNewNoteMarker();
        }
    },

    refreshMarkers: function(force) {
        var bounds = KG.core_leaflet.getBounds();
        if (force || SC.none(this._bounds) || !this._bounds.contains(bounds)) {
            var fatBounds = KG.core_leaflet.getFatBounds();
            var dist = KG.core_leaflet.pixelsToWorld(20); //cluster within 20 pixels
            if (KG.noteMarkersController.get('content')) {
                var content = KG.noteMarkersController.get('content');
                if (content.get('query') && content.get('query')._response) {
                    console.log('*** cancel note marker query');
                    content.get('query')._response.cancel();
                    content.get('query')._response = null;
                }
                content.destroy();
            }
            var query = SC.Query.remote(KG.NoteMarker, {
                query_url: '/api_data/protected/notes/clusters?sw_lon=%@&ne_lat=%@&ne_lon=%@&sw_lat=%@&distance=%@&sandbox=%@'.fmt(fatBounds.getPath('sw.lon'), fatBounds.getPath('sw.lat'), fatBounds.getPath('ne.lon'), fatBounds.getPath('ne.lat'), dist, KG.get('active_sandbox'))
            });
            var newMarkers = KG.store.find(query);
            newMarkers.addObserver('status', this, this.markersReady);
            KG.noteMarkersController.set('content', newMarkers);
            this._bounds = fatBounds;
        }
    },

    /* Super element to put in a note marker popup */
    _div_notes: null,
    /* SC view to generate html bind on the  KG.notePopupController*/
    _view_notes: null,

    markersReady: function(markers, key, nothing, context) {
        if (markers.get('status') & SC.Record.READY) {
            markers.removeObserver('status', this, this.markersReady);
            var rtype = markers.getPath('query.recordType');
            var loadedMarkers = KG.store.find(rtype);
            loadedMarkers.forEach(function(old) {
                //console.log('remove old marker %@'.fmt(old));
                KG.core_leaflet.removeMarker(old);
                old.set('isOnMap', NO);
                if (markers.indexOf(old) === -1) {
                    KG.store.unloadRecord(rtype, old.get('id'));
                }
            });
            var i;
            for (i = 0; i < markers.get('length'); i++) {
                var marker = KG.noteMarkersController.objectAt(i);
                if (marker) {
                    if (!marker.get('isOnMap')) {
                        KG.core_leaflet.addMarker(marker, this, this.markerClicked);
                        marker.set('isOnMap', YES);
                    }
                }
            }
        }
    },

    markerClicked: function(marker) {
        if (SC.none(this._div_notes)) {
            this._div_notes = document.createElement('div');
            this._view_notes = SC.View.create({
                templateName: 'notes-marker-popup',
            });
            this._view_notes.appendTo(this._div_notes);
        }
        this._view_notes.set('title', "...");
        var notes = marker.get('features');
        KG.notePopupController.set('content', notes);
        KG.core_leaflet.refreshMarkerPopup(marker, this._div_notes);
        var len = notes.get('length');
        var params = {
            count: 0,
            length: len,
            marker: marker
        }
        for (i = 0; i < len; i++) {
            var note = notes.objectAt(i);
            note.onReady(this, this.noteReady, params);
        }
    },

    noteReady: function(note, params) {
        params.count++;
        if (params.count === params.length) {
            console.log('refresh!');
            this._view.set('title', params.marker.get('title'));
			var div = this._div_notes;
            setTimeout(function() {
                KG.core_leaflet.refreshMarkerPopup(params.marker, div);
            },
            1);
        }
    }

});
