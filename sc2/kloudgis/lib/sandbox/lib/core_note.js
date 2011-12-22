/**
* Core functions to manage the Notes
**/
KG.core_note = SC.Object.create({

    /* cache for refreshMarkers*/
    _bounds: null,
    _zoom: null,

    /* elements for the active note view*/
    _view_active_note: null,
    _new_note_marker: null,

    /* SC view to generate html bind on the  KG.notesPopupController*/
    _view_multiple_notes: null,

    /* chained store to perform modifications*/
    _store: null,

    //feature to use to create a new note
    featureTemplate: null,

    _removeOnCloseMarker: null,

    /**
	* Create a nested store with chain() to start doing modifications
	**/
    beginModifications: function() {
        this.rollbackModifications();
        this._store = KG.store.chain();
        var note = KG.activeNoteController.get('content');
        if (!SC.none(note) && note.get('status') !== SC.Record.READY_NEW) {
            KG.activeNoteController.set('content', this._store.find(note));
        }
    },

    /**
	* Commit the nested store into the main store and commits all the changes to the server
	**/
    commitModifications: function() {
        this._store.commitChanges().destroy();
        this._store = null;
        KG.store.commitRecords();
    },

    /**
	* Discard the changes made in the nested store.
	**/
    rollbackModifications: function() {
        if (this._store) {
            this._store.discardChanges();
            this._store.destroy();
            this._store = null;
        }
    },

    /**
	* The user quit the not edtion view.  Rollback the unsaved changes and clean up.
	**/
    postEdition: function() {
        this.rollbackModifications();
        if (this._highlightMarker) {
            KG.core_leaflet.removeMarker(this._highlightMarker);
        }
        this.cleanUpActiveNoteElements();
    },

    /**
	* Zoom and center the map on the active note
	**/
    zoomActiveNote: function() {
        var note = KG.activeNoteController.get('content');
        if (note) {
            var coord = note.get('coordinate');
            if (coord) {
                KG.core_leaflet.closePopup();
                KG.core_leaflet.setCenter(KG.LonLat.create({
                    lon: coord.x,
                    lat: coord.y
                }), 14);
            }
        }
    },

    /**
	* Create a temp marker to let the user drag it to the wanted position
	**/
    locateNote: function() {
        this.cancelLocateNote();
        var center = KG.core_leaflet.getCenter();
        this._new_note_marker = KG.core_leaflet.addNewNoteMarker("_moveNote".loc());
        return YES;
    },

    /**
	* Cancel locate note : Remove the temp marker
	**/
    cancelLocateNote: function() {
        if (!SC.none(this._new_note_marker)) {
            KG.core_leaflet.removeMarker(this._new_note_marker);
            this._new_note_marker = null;
        }
    },

    /**
	* Create a new note record and activate it.
	**/
    createNote: function() {
        this.beginModifications();
        var note;
        if (!SC.none(this.get('featureTemplate'))) {
            var feature = this.get('featureTemplate');
            var center = feature.get('center');
            if (!SC.none(center) && center.get('lon') && center.get('lat')) {
                note = this._store.createRecord(KG.Note, {
                    coordinate: {
                        x: feature.get('center').get('lon'),
                        y: feature.get('center').get('lat'),
                    },
                    description: feature.get('title')
                });
                this._new_note_marker = KG.core_leaflet.addNewNoteMarker("", feature.get('center'));
            }
        } else {
            if (this._new_note_marker.get('lon') && this._new_note_marker.get('lat')) {
                note = this._store.createRecord(KG.Note, {
                    coordinate: {
                        x: this._new_note_marker.get('lon'),
                        y: this._new_note_marker.get('lat')
                    }
                });
            }
        }
        if (note) {
            var marker = this._new_note_marker;
            this.activateNote(note, {
                marker: marker
            });
        } else {
            KG.statechart.sendAction('cancelCreateNoteAction');
        }
    },

    /**
	* Cleanup the temp marker used to locate the new note and other resources.
	**/
    clearCreateNote: function() {
        if (!SC.none(this._new_note_marker)) {
            KG.core_leaflet.removeMarker(this._new_note_marker);
            this._new_note_marker = null;
            this.set('featureTemplate', null);
        }
    },

    /**
	* attempt to activate a note.  If not fresh, the note is refreshed before.
	**/
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

    /**
	* activate note is accepted, set the active note controller and show the popup marker
	**/
    continueActivateNote: function(note, marker) {
        this.cleanUpActiveNoteElements();
        var noteDiv = document.createElement('div');
        this._view_active_note = SC.View.create({
            templateName: 'active-note-popup',
        });
        this._view_active_note.appendTo(noteDiv);
        KG.activeNoteController.set('marker', marker);
        KG.activeNoteController.set('content', note);
        if (KG.activeNoteController.canEdit()) {
            console.log('note is draggable');
            KG.core_leaflet.enableDraggableMarker(marker);
        }
        setTimeout(function() {
            if (!SC.none(marker)) {
                SC.run.begin();
                KG.core_leaflet.showPopupMarker(marker, noteDiv);
                SC.run.end();
            }
        },
        1);
    },

    /**
	* cleanup the view used to render the active note.
	**/
    cleanUpActiveNoteElements: function() {
        if (!SC.none(this._view_active_note)) {
            this._view_active_note.destroy();
            this._view_active_note = null;
        }
    },

    /**
	* cleanup the view used to render the active note.
	**/
    cleanUpMultipleNotesElements: function() {
        if (!SC.none(this._view_multiple_notes)) {
            this._view_multiple_notes.destroy();
            this._view_multiple_notes = null;
        }
    },

    setHighlightMarker: function(marker) {
        this._highlightMarker = marker;
    },

    /**
	* More then one note to activate. Show a list of notes.
	**/
    activateMultipleNotes: function(notes, marker) {
        this.cleanUpMultipleNotesElements();
        KG.notesPopupController.set('marker', marker);
        KG.notesPopupController.set('content', notes);
        var div = document.createElement('div');
        this._view_multiple_notes = SC.View.create({
            templateName: 'notes-marker-popup',
        });
        this._view_multiple_notes.appendTo(div);
        setTimeout(function() {
            SC.run.begin();
            KG.core_leaflet.showPopupMarker(marker, div);
            SC.run.end();
        },
        1);
    },

    /**
	* The user hit the Create or Update button. 
	**/
    confirmCreateNote: function() {
        var note = KG.activeNoteController.get('content');
        note = KG.store.find(note);
        note.onReady(null,
        function() {
            KG.core_note.refreshMarkers(YES);
        });
    },

    /**
	* The user hit the Delete button.
	**/
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

    /**
	* flush and recalculate the note clusters
	**/
    refreshMarkers: function(force) {
	console.log('Refresh markers, Force:' + force);
        var bounds = KG.core_leaflet.getBounds();
        var zoom = KG.core_leaflet.getZoom();
        if (force || SC.none(this._zoom) || this._zoom != zoom || SC.none(this._bounds) || !this._bounds.contains(bounds)) {
            var fatBounds = KG.core_leaflet.getFatBounds();
            var dist = KG.core_leaflet.pixelsToWorld(20); //cluster within 20 pixels
            var currentMarkers = [];
            if (KG.noteMarkersController.get('content')) {
                var content = KG.noteMarkersController.get('content');
                currentMarkers = content.toArray();
                content.destroy();
            }
            KG.NOTE_MARKER_QUERY.fat_bounds = fatBounds;
            KG.NOTE_MARKER_QUERY.distance = dist;
            var newMarkers = KG.store.find(KG.NOTE_MARKER_QUERY);
            newMarkers.onReady(this, this.markersReady, {
                olds: currentMarkers
            });
            KG.noteMarkersController.set('content', newMarkers);
            this._bounds = fatBounds;
            this._zoom = zoom;
            return YES;
        }
        return NO;
    },

    /**
	* Markers from the server are now READY
	**/
    markersReady: function(markers, params) {
        markers.offReady();
        KG.notesPopupController.set('marker', null);

        params.olds.forEach(function(old) {
            if (markers.indexOf(old) !== -1) {
				//remove the shadow but keep the markers because it is still visible - will be removed on insert of the new one
                KG.core_leaflet.removeShadow(old);             
            }else{
				//completly remove the marker - no good anymore
				KG.core_leaflet.removeMarker(old);
                var rtype = old.get('store').recordTypeFor(old.get('storeKey'));
                KG.store.unloadRecord(rtype, old.get('id'));
			}
        });
        var i;
        var len = markers.get('length');
        for (i = 0; i < len; i++) {
            var marker = KG.noteMarkersController.objectAt(i);
            if (marker) {
                //add the marker - If the marker was already visible, it replace it (remove the old one)
                KG.core_leaflet.addMarker(marker, this, this.markerClicked);
            }
        }
        //readd the hl marker if any (to put it on top)
        if (this._highlightMarker) {
            KG.core_leaflet.reAddMarker(this._highlightMarker);
        }
    },

    /**
	* The user just click a marker. Try to continue.
	**/
    markerClicked: function(marker) {
        KG.statechart.sendAction('clickMarkerAction', marker);
    },

    /**
	* Find the notes bind to this marker and wait until its READY.
	**/
    continueMarkerClicked: function(marker) {
        if (SC.none(marker)) {
            return NO;
        }
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

    /**
	* A note from the marker is READY.  If no more note, try to continue.
	**/
    noteReady: function(note, params) {
        params.count++;
        if (params.count === params.length) {
            if (params.count === 1) {
                KG.statechart.sendAction('noteSelectedAction', note, params);
            } else {
                KG.statechart.sendAction('multipleNotesSelectedAction', params.marker.get('features'), params.marker);
            }
        }
    },

    /**
	* Fetch the comments for the active note.
	**/
    fetchComments: function(refresh) {
        var nested_note = KG.activeNoteController.get('content');
        if (!SC.none(nested_note)) {
            var note = KG.store.find(nested_note);
            var onReady = function() {
                if (!refresh) {
                    KG.noteCommentsController.set('isLoading', YES);
                }
                var comments = note.get('comments');
                var params = {
                    count: 0,
                    length: comments.get('length'),
                    records: []
                };
                if (params.length > 0) {
                    console.log('comments count:' + params.length);
                    comments.forEach(function(comment) {
                        comment.onReady(KG.core_note, KG.core_note.commentReady, params);

                    });
                } else {
                    console.log('NO comments');
                    KG.noteCommentsController.set('isLoading', NO);
                    KG.statechart.sendAction('noteCommentsReadyEvent');
                }
            };
            if (refresh) {
                note.refresh(YES, onReady);
            } else {
                note.onReady(null, onReady);
            }
        }
    },

    /**
	* A comment from the active note is READY.  If no more comment, try to continue.
	**/
    commentReady: function(comment, params) {
        params.count++;
        params.records.pushObject(comment);
        if (params.count === params.length) {
            KG.statechart.sendAction('noteCommentsReadyEvent');
            KG.noteCommentsController.set('isLoading', NO);
        }
    },

    /**
	* Create a new Comment record.
	**/
    addCommentToActiveNote: function(comment) {
        var nested_note = KG.activeNoteController.get('content');
        if (nested_note) {
            var rec_comment = KG.store.createRecord(KG.NoteComment, {
                comment: comment,
                note: nested_note.get('id')
            });
            //commit only this record
            KG.store.commitRecords(null, null, [rec_comment.get('storeKey')]);
            rec_comment.onReady(null,
            function() {
                nested_note.get('comments').get('editableStoreIds').pushObject(rec_comment.get('id'));
                KG.statechart.sendAction('noteCommentsReadyEvent');
            });
        }
    },

    /**
	* Delete a commment record and commit it to the server.
	**/
    deleteComment: function(comment) {
        var nested_note = KG.activeNoteController.get('content');
        nested_note.get('comments').get('editableStoreIds').removeObject(comment.get('id'));
        comment.destroy();
        //commit only on record
        KG.store.commitRecords(null, null, [comment.get('storeKey')]);
    },

    updatePosition: function(lon, lat) {
        KG.activeNoteController.get('content').set('coordinate', {
            x: lon,
            y: lat
        });
        /*var marker = KG.activeNoteController.get('marker');
        var dataHash = KG.store.readDataHash(marker.get('storeKey'));
		dataHash.lat = lat;
		dataHash.lon = lon;
		KG.store.pushRetrieve(null, null, dataHash, marker.get('storeKey'));*/
        KG.core_leaflet.updatePopupMarkerPosition(lon, lat);
    }
});
