KG.core_note = SC.Object.create({

    _bounds: null,

    refreshMarkers: function(force) {
        var bounds = KG.core_leaflet.getBounds();
        if (force || SC.none(this._bounds) || !this._bounds.contains(bounds)) {
            var fatBounds = KG.core_leaflet.getFatBounds();
            var dist = KG.core_leaflet.pixelsToWorld(20);//cluster within 20 pixels
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

    _div: null,
    _view: null,

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
        $(".leaflet-popup-pane").removeClass('show');
        if (SC.none(this._div)) {
            this._div = document.createElement('div');
            this._view = SC.View.create({
                templateName: 'notes-marker-popup',
            });
            this._view.appendTo(this._div);
        }
        var notes = marker.get('features');
        KG.notePopupController.set('content', notes);
        KG.core_leaflet.refreshMarkerPopup(marker, this._div);
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
            setTimeout(function() {
                KG.core_leaflet.refreshMarkerPopup(params.marker, this._div);
                $(".leaflet-popup-pane").addClass('show');
            },
            1);
        }
    }

});
