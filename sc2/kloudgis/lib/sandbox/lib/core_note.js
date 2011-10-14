KG.createNoteImagePath = 'resources/images/note.png';
KG.cancelCreateNoteImagePath = 'resources/images/note_cancel.png';
KG.core_note = SC.Object.create({

    /* cache for refreshMarkers*/
    _bounds: null,
    _zoom: null,

    /* elements for the active note view*/
    _div_active_note: null,
    _view_active_note: null,
    _new_note_marker: null,

    /* label and image for the create note control*/
    createNoteLabel: "_createNote".loc(),
    createNoteImg: KG.createNoteImagePath,

    /* chained store to perform modifications*/
    _store: null,

    //feature to use to create a new note
    featureTemplate: null,

    _removeOnCloseMarker: null,

    beginModifications: function() {
        this.rollbackModifications();
        this._store = KG.store.chain();
        var note = KG.activeNoteController.get('content');
        if (!SC.none(note) && note.get('status') !== SC.Record.READY_NEW) {
            KG.activeNoteController.set('content', this._store.find(note));
        }
    },

    commitModifications: function() {
        this._store.commitChanges().destroy();
        this._store = null;
        KG.store.commitRecords();
    },

    rollbackModifications: function() {
        if (this._store) {
            this._store.discardChanges();
            this._store.destroy();
            this._store = null;
        }
    },

    postEdition: function() {
        this.rollbackModifications();
        if (this._highlightMarker) {
            KG.core_leaflet.removeMarker(this._highlightMarker);
        }
		this.cleanUpActiveNoteElements();
    },

    zoomActiveNote: function() {
        console.log('zoom note.');
        var note = KG.activeNoteController.get('content');
        if (note) {
            var coord = note.get('coordinate');
            if (coord) {
                KG.core_leaflet.closePopup();
                KG.core_leaflet.setCenter(KG.LonLat.create({
                    lon: coord.x,
                    lat: coord.y
                }), 15);
            }
        }
    },

    //create a marker to let the user set the position
    locateNote: function() {
        this.cancelLocateNote();
        var center = KG.core_leaflet.getCenter();
        this._new_note_marker = KG.core_leaflet.addNewNoteMarker("_moveNote".loc());
        return YES;
    },

    cancelLocateNote: function() {
        if (!SC.none(this._new_note_marker)) {
            KG.core_leaflet.removeMarker(this._new_note_marker);
            this._new_note_marker = null;
        }
    },

    //create the actual note record and activate it.
    createNote: function() {
        this.beginModifications();
        var note;
        if (!SC.none(this.get('featureTemplate'))) {
            var feature = this.get('featureTemplate');
            note = this._store.createRecord(KG.Note, {
                coordinate: {
                    x: feature.get('center').get('lon'),
                    y: feature.get('center').get('lat'),
                },
                description: feature.get('title')
            });
            this._new_note_marker = KG.core_leaflet.addNewNoteMarker("", feature.get('center'));
        } else {
            note = this._store.createRecord(KG.Note, {
                coordinate: {
                    x: this._new_note_marker.get('lon'),
                    y: this._new_note_marker.get('lat')
                }
            });
        }
        this.activateNote(note, {
            marker: this._new_note_marker
        });
    },

    clearCreateNote: function() {
        if (!SC.none(this._new_note_marker)) {
            KG.core_leaflet.removeMarker(this._new_note_marker);
            this._new_note_marker = null;
            this.set('featureTemplate', null);
        }
    },

    //show the note form to let the user fill it up
    activateNote: function(inNote, params) {
        if (!inNote) {
            return NO;
        }
        if (inNote.get('status') === SC.Record.READY_NEW || params.isFresh) {
            this.continueActivateNote(inNote, params.marker);
        } else {
            inNote.refresh(YES,
            function() {
                KG.core_note.continueActivateNote(inNote, params.marker)
            });
        }
        return YES;
    },

    continueActivateNote: function(note, marker) {      
		this.cleanUpActiveNoteElements();
		var noteDiv = this._div_active_note;
		if(SC.none(noteDiv)){
        	var noteDiv = this._div_active_note = document.createElement('div');
		}
        this._view_active_note = SC.View.create({
            templateName: 'active-note-popup',
        });
        this._view_active_note.appendTo(noteDiv);
        KG.activeNoteController.set('marker', marker);
        KG.activeNoteController.set('content', note);
        setTimeout(function() {
            SC.run.begin();
            KG.core_leaflet.showPopupMarker(marker, noteDiv);
            SC.run.end();
        },
        1);
    },

	cleanUpActiveNoteElements: function(){
		if (!SC.none(this._view_active_note)) {
            this._view_active_note.destroy();
        }
	},

    setHighlightMarker: function(marker) {
        this._highlightMarker = marker;
    },

    activateMultipleNotes: function(notes, marker) {
        KG.notesPopupController.set('marker', marker);
        KG.notesPopupController.set('content', notes);
        if (SC.none(this._div_multiple_notes)) {
            this._div_multiple_notes = document.createElement('div');
            this._view_multiple_notes = SC.View.create({
                templateName: 'notes-marker-popup',
            });
            this._view_multiple_notes.appendTo(this._div_multiple_notes);
        }
        var div = this._div_multiple_notes;
        setTimeout(function() {
            SC.run.begin();
            KG.core_leaflet.showPopupMarker(marker, div);
            SC.run.end();
        },
        1);
    },

    //the user confirm the note create (hit the create button)
    confirmCreateNote: function() {
        var note = KG.activeNoteController.get('content');
        note = KG.store.find(note);
        note.onReady(null,
        function() {
            KG.core_note.refreshMarkers(YES);
        });
    },

    deleteActiveNote: function() {
        var note = KG.activeNoteController.get('content');
        if (note) {
            var origin_note = KG.store.find(note);
            origin_note.onDestroyedClean(null,
            function() {
                console.log('destroyed completed');
                KG.core_note.refreshMarkers(YES);
            })
            note.destroy();
        }
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
            newMarkers.onReady(this, this.markersReady);
            KG.noteMarkersController.set('content', newMarkers);
            this._bounds = fatBounds;
            this._zoom = zoom;
            return YES;
        }
        return NO;
    },

    /* Super element to put in a note marker popup */
    _div_multiple_notes: null,
    /* SC view to generate html bind on the  KG.notesPopupController*/
    _view_multiple_notes: null,

    markersReady: function(markers) {
        markers.offReady();
        KG.notesPopupController.set('marker', null);
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
        //readd the hl marker if any (to put it on top)
        if (this._highlightMarker) {
            KG.core_leaflet.reAddMarker(this._highlightMarker);
        }
    },

    //the user clicked a marker, adjust the popup content
    markerClicked: function(marker) {
        KG.statechart.sendAction('clickMarkerAction', marker);
    },

    continueMarkerClicked: function(marker) {
        var notes = marker.get('features');
        var len = notes.get('length');
        var params = {
            count: 0,
            length: len,
            marker: marker
        }
        for (i = 0; i < len; i++) {
            var note = notes.objectAt(i);
            params.isFresh = note.get('status') & SC.Record.BUSY;
            if (note.get('status') === SC.Record.ERROR) {
                note.refresh(YES,
                function() {
                    KG.core_note.noteReady(note, params);
                });
            } else {
                note.onReady(this, this.noteReady, params);
            }
        }
    },

    noteReady: function(note, params) {
        params.count++;
        if (params.count === params.length) {
            if (params.count === 1) {
                setTimeout(function() {
                    SC.run.begin();
                    KG.statechart.sendAction('noteSelectedAction', note, params);
                    SC.run.end();
                },
                100);
            } else {
                setTimeout(function() {
                    SC.run.begin();
                    KG.statechart.sendAction('multipleNotesSelectedAction', params.marker.get('features'), params.marker);
                    SC.run.end();
                },
                100);
            }
        }
    },

    fetchComments: function() {
        // console.log('refresh comments');
        KG.activeCommentsController.set('isLoading', YES);
        var nested_note = KG.activeNoteController.get('content');
        var note = KG.store.find(nested_note);
        note.onReady(null,
        function() {
            KG.activeCommentsController.set('content', []);
            var comments = note.get('comments');
            var params = {
                count: 0,
                length: comments.get('length'),
                records: [],
            }
            if (params.length > 0) {
                comments.forEach(function(comment) {
                    comment.onReady(KG.core_note, KG.core_note.commentReady, params);
                });
            } else {
                KG.activeCommentsController.set('isLoading', NO);
                KG.statechart.sendAction('commentsReadyEvent');
            }
        });
    },

    commentReady: function(comment, params) {
        params.count++;
        params.records.push(comment);
        if (params.count === params.length) {
            KG.statechart.sendAction('commentsReadyEvent');
            KG.activeCommentsController.set('content', KG.activeCommentsController.sortByDate(params.records));
            KG.activeCommentsController.set('isLoading', NO);
        }
    },

    addCommentToActiveNote: function(comment) {
        var nested_note = KG.activeNoteController.get('content');
        if (nested_note) {
            var rec_comment = KG.store.createRecord(KG.Comment, {
                value: comment,
                note: nested_note.get('id')
            });
			//commit only this record
            KG.store.commitRecords(null, null, [rec_comment.get('storeKey')]);
            rec_comment.onReady(null,
            function() {
                KG.activeCommentsController.get('content').pushObject(rec_comment);
                KG.statechart.sendAction('commentsReadyEvent');
            });
        }
    }
});
