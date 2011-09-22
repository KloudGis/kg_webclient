KG.core_note = SC.Object.create({

    _bounds: null,
	_zoom: null,

    _div_active_note: null,
    _view_active_note: null,
    _new_note_marker: null,

    //create a marker to let the user set the position
    locateNote: function() {
        KG.core_leaflet.cleanUpNewNoteMarker();
        var center = KG.core_leaflet.getCenter();
        var marker = KG.core_leaflet.addNewNoteMarker("_moveNote".loc());
        this._new_note_marker = marker;
        return YES;
    },

    //create the actual note record and activate it.
    createNote: function() {
        if (SC.none(this._new_note_marker)) {
            return NO;
        }
        var noteDiv = this._div_active_note;
        var marker = this._new_note_marker;
        this._store = KG.store.chain();
        var note = this._store.createRecord(KG.Note, {
            coordinate: {
                x: marker.get('coordinate').x,
                y: marker.get('coordinate').y
            }
        });
        this.activateNote(note, marker);
        return YES;
    },

    _store: null,

    //show the note form to let the user fill it up
    activateNote: function(inNote, marker) {
		if(!inNote){
			return NO;
		}
        var note = inNote;
        if (note.get('status') !== SC.Record.READY_NEW) {
            this._store = KG.store.chain();
            note = this._store.find(note);
        }
        console.log('Status is ' + note.get('status'));
        KG.activeNoteController.set('content', note);
        if (SC.none(this._div_active_note)) {
            this._div_active_note = document.createElement('div');
            noteDiv = this._div_active_note;
            this._view_active_note = SC.View.create({
                templateName: 'active-note-popup',
            });
            this._view_active_note.appendTo(noteDiv);
        }
        KG.core_leaflet.closeActivePopup();
        setTimeout(function() {
            KG.core_leaflet.refreshMarkerPopup(marker, noteDiv);
            KG.core_leaflet.openMarkerPopup(marker);
            $(".new-note-popup input").focus();
        },
        1);
		return YES;
    },

    //the user confirm the note create (hit the create button)
    confirmCreateNote: function() {
        var note = KG.activeNoteController.get('content');
        this.confirmUpdateNote();
        KG.core_leaflet.cleanUpNewNoteMarker();
        note = KG.store.find(note);
        console.log('XXX: Status is ' + note.get('status'));
        note.onReady(null,
        function() {
            console.log('RR: Status is ' + note.get('status'));
            KG.core_note.refreshMarkers(YES);
        });
    },

    confirmUpdateNote: function() {
        var note = KG.activeNoteController.get('content');
        if (!SC.none(note) && this._store) {
            console.log('CC: Status is ' + note.get('status'));
            this._store.commitChanges().destroy();
            this._store = null;
            KG.store.commitRecords();

        }
        this._clearActiveNote();
        KG.core_leaflet.closeActivePopup();
    },

    revertCreateNote: function() {
        this.revertUpdateNote();
        KG.core_leaflet.cleanUpNewNoteMarker();
    },

	deleteActiveNote: function(){
		var note = KG.activeNoteController.get('content');
		if(note){
			var origin_note = KG.store.find(note);
			origin_note.onDestroyedClean(null, function(){
				console.log('destroyed completed');
				KG.core_note.refreshMarkers(YES);
			})
			note.destroy();
			this.confirmUpdateNote();
		}
	},

    //the user closed the popup to cancel the note creation
    revertUpdateNote: function() {
        if (!SC.none(this._store)) {
            this._clearActiveNote();
            this._store.discardChanges();
            this._store.destroy();
            this._store = null;
            this._clearActiveNote();
            KG.core_leaflet.closeActivePopup();
        }
    },

    _clearActiveNote: function() {
        KG.activeNoteController.set('content', null);
    },

    //flush and recalculate the note clusters
    refreshMarkers: function(force) {
        var bounds = KG.core_leaflet.getBounds();
		var zoom = KG.core_leaflet.getZoom();
        if (force || SC.none(this._zoom) || this._zoom != zoom || SC.none(this._bounds) || !this._bounds.contains(bounds)) {
            var fatBounds = KG.core_leaflet.getFatBounds();
            var dist = KG.core_leaflet.pixelsToWorld(20); //cluster within 20 pixels
            if (KG.noteMarkersController.get('content')) {
                var content = KG.noteMarkersController.get('content');
                content.destroy();
            }
            var query = SC.Query.remote(KG.NoteMarker, {
                query_url: '/api_data/protected/notes/clusters?sw_lon=%@&ne_lat=%@&ne_lon=%@&sw_lat=%@&distance=%@&sandbox=%@'.fmt(fatBounds.getPath('sw.lon'), fatBounds.getPath('sw.lat'), fatBounds.getPath('ne.lon'), fatBounds.getPath('ne.lat'), dist, KG.get('activeSandboxKey'))
            });
            var newMarkers = KG.store.find(query);
            newMarkers.addObserver('status', this, this.markersReady);
            KG.noteMarkersController.set('content', newMarkers);
            this._bounds = fatBounds;
			this._zoom = zoom;
        }
    },

    /* Super element to put in a note marker popup */
    _div_notes: null,
    /* SC view to generate html bind on the  KG.notesPopupController*/
    _view_notes: null,

    markersReady: function(markers, key, nothing, context) {
        if (markers.get('status') & SC.Record.READY) {
			KG.notesPopupController.set('marker', null); 
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

    //the user clicked a marker, adjust the popup content
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
        KG.notesPopupController.set('content', notes);
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
            console.log('refresh the popup content.');
			KG.notesPopupController.set('marker', params.marker);     
            if (params.count === 1) {
				//when only one note, show the note directly
				KG.statechart.sendAction('noteSelectedAction', note, params.marker);
			} else {				
                var div = this._div_notes;
                setTimeout(function() {
                    KG.core_leaflet.refreshMarkerPopup(params.marker, div);
                },
                1);
            }
        }
    }

});
