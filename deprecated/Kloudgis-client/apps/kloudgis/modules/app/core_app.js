KG.core_app = SC.Object.create({

    _markerBounds: null,

    testMembership: function() {
        SC.Request.getUrl("%@/protected/members/membership?sandbox=%@".fmt(CoreKG.context_server, KG.projectController.get('id'))).json().notify(this, this.didTestMembership).send();
    },

    didTestMembership: function(response) {
        if (SC.ok(response)) {
            var body = response.get('body');
            if (!SC.none(body) && body.access) {
                KG.statechart.sendEvent('memberAuthenticationSucceeded');
                return;
            }
        }
        KG.statechart.sendEvent('memberAuthenticationFailed');
    },

    loadData: function() {
        //openlayers map setting
        //	KG.mapController.set('content', KG.OLMap.create({}));
        //leaflet map setting	
	//cannot create multiple instance of leaflet map... no destroy available.  We need the reuse the same instance.
		if(!KG.mapController.get('content')){
        	KG.mapController.set('content', KG.LeafletMap.create({}));
		}
        KG.mapController.addDefaultBaseLayer();

        var records = KG.layersController.get('content');
        if (records.get('status') & SC.Record.BUSY) {
            records.addObserver('status', this, this.layersLoadCallback, {});
        } else {
            SC.Logger.debug('Early layers load');
            this.doLoadLayers(records);
        }
        KG.selectionController.set('content', []);
    },

    layersLoadCallback: function(records, status, nothing, context) {
        if (status & SC.Record.READY) {
            SC.Logger.debug('Late layers load');
            this.doLoadLayers(records);
        }
        records.removeObserver('status', this, this.layersLoadCallback, context);
    },

    doLoadLayers: function(records) {
        var ordered = records.sortProperty('renderOrder');
        ordered.forEach(function(layer) {
            KG.mapController.addLayer(layer);
        });
    },

    refreshMarkers: function() {
        var bounds = KG.mapController.getFatBounds();
        this._markerBounds = bounds;
        var dist = KG.mapController.pixelsToWorld(20);
        if (KG.markersController.get('content')) {
			var content = KG.markersController.get('content');
			if(content.get('query') && content.get('query')._response){
				console.log('*** cancel note marker query');
				content.get('query')._response.cancel();
				content.get('query')._response = null;
			}
            content.destroy();
        }
        var query = SC.Query.remote(CoreKG.NoteMarker, {
            isNoteCluster: YES,
            bounds: bounds,
            distance: dist
        });
        var newMarkers = CoreKG.store.find(query);
        newMarkers.addObserver('status', this, this.markersReady);
        KG.markersController.set('content', newMarkers);
    },

    markersReady: function(markers, key, nothing, context) {
        //console.log('Markers status changed! %@'.fmt(markers.get('status')));
        if (markers.get('status') & SC.Record.READY) {
            console.log('Markers status ready.  Length=%@'.fmt(markers.get('length')));
            markers.removeObserver('status', this, this.markersReady);
			var rtype = markers.getPath('query.recordType');
            var loadedMarkers = CoreKG.store.find(rtype);
            loadedMarkers.forEach(function(old) {
                //console.log('remove old marker %@'.fmt(old));
                KG.mapController.removeMarker(old);
                old.set('isOnMap', NO);
				if(markers.indexOf(old) === -1){
					CoreKG.store.unloadRecord(rtype, old.get('id'));
				}
            });
            var i;
            for (i = 0; i < markers.get('length'); i++) {
                var marker = KG.markersController.objectAt(i);
                if (marker) {
                    if (!marker.get('isOnMap')) {
                        KG.mapController.addMarker(marker, this, this.getMarkerPopupContent);
                        marker.set('isOnMap', YES);
                    }
                }
            }
        }
    },

    checkMarkers: function(bounds) {
        if (this._markerBounds) {
            if (!this._markerBounds.contains(bounds)) {
				console.log('out of marker bounds...Refresh!');
                this.refreshMarkers();
            }
        }
    },

    cleanUpViews: function() {
        //called before the view is removed to let the node cleanup happen		
        KG.mapController.get('content').cleanUp();
        KG.appPage.get('mapview').cleanUp();
    },

    cleanUpData: function() {
        KG.selectionController.set('content', null);
        this.quickSelectFeatures(null, null);
    },

    validateProject: function() {
        var project = KG.projectController.get('content');
        if (SC.none(project)) {
            KG.statechart.sendEvent('projectInvalidEvent', this);
        } else {
            KG.statechart.sendEvent('projectValidEvent', this);
        }
        //validate member access
        //...	
    },

    gotoHomeLocation: function() {
        SC.Logger.debug('setting home location');
        var project = KG.projectController.get('content');
        var center = project.get('homeLonLatCenter') || '-71,50';
        var zoom = project.get('homeZoomLevel') || 5;
        //		SC.Logger.debug('center is ' + center);
        if (!SC.none(center)) {
            var parts = center.split(',');
            if (parts.length === 2) {
                KG.mapController.setCenter(CoreKG.LonLat.create({
                    lon: parseFloat(parts[0]),
                    lat: parseFloat(parts[1])
                }), zoom);
            }
        }
    },

    findFeaturesAt: function(lonlat) {
        var visibles = KG.layersController.filterProperty('visibility', YES);
        var selectables = visibles.filterProperty('isSelectable', YES);
        if (selectables.get('length') > 0) {
            var ordered = selectables.sortProperty('renderOrder');
            var ids = ordered.getEach('id');
            var reversed = ids.toArray().reverse();
            var layers = reversed.join(",");
            var tolerance = KG.mapController.pixelsToWorld(1);
            var query = SC.Query.remote(CoreKG.QuickFeature, {
                isQuickGeo: YES,
                lonlat: lonlat,
                layers: layers,
                one_pixel: tolerance,
                limit: 10
            });
            return CoreKG.store.find(query);
        } else {
            return [];
        }
    },

    quickSelectFeatures: function(features, lonlat) {
        var content = KG.quickSelectionController.get('content');
        if (content && content.destroy) {
            if (content.query) {
                content.query.destroy();
            }
            content.destroy();
            KG.quickSelectionController.set('content', null);
        }
        //console.log('quickSelectFeature');
        //console.log(features);
        KG.quickSelectionController.set('location', lonlat)
        KG.quickSelectionController.set('content', features);
    },

    getMarkerPopupContent: function(marker, target, method) {
        var notes = marker.get('notes');
        var html = [];
        var len = notes.get('length');
        for (i = 0; i < len; i++) {
            var note = notes.objectAt(i);
            note.onReady(this, this.doGetMarkerPopupContent, {
                html: html,
                idx: i,
                len: len,
                target: target,
                method: method,
                marker: marker
            });
        }
    },

    doGetMarkerPopupContent: function(note, params) {
        var content = '<div class="note-title">%@</div>'.fmt(note.get('title'));
        if (params.len === 1) {
            content = '%@<div class="note-description">%@</div>'.fmt(content, note.get('description'));
            content = '%@<div class="note-author">%@</div>'.fmt(content, note.get('author'));
            content = '%@<div class="note-date">%@</div>'.fmt(content, note.get('date'));
        }
        params.html[params.idx] = '<li  markerkey="' + params.marker.get('storeKey') + '" storekey="' + note.get('storeKey') + '" onclick="KG.core_app.onClickNote(this);" onmouseover="KG.core_app.onMouseOverNote(this);" onmouseout="KG.core_app.onMouseOutNote(this);">' + content + '</li>';
        var i;
        for (i = 0; i < params.len; i++) {
            if (!params.html[i]) {
                return;
            }
        }
        var title = params.len > 1 ? '_SelectedNotes'.loc(params.len) : '_SelectedNote'.loc();
        var titleHTML = '<label class="popup-note-title"><span>' + title + '</span></label>';
        var listHTML = '<ul class="popup-note-list">%@</ul>'.fmt(params.html.join(''));
        var HTML = [titleHTML, listHTML, '</u>'].join('');
        params.method.call(params.target, HTML);
    },

    onClickNote: function(element) {
        SC.Logger.debug('click note');
        SC.RunLoop.begin();
        var storeKey = element.getAttribute('storekey');
        var note = CoreKG.store.find(CoreKG.Note, CoreKG.store.idFor(storeKey));
        var markerKey = element.getAttribute('markerkey');
        KG.mapController.closeMarkerPopup(CoreKG.store.find(CoreKG.NoteMarker, CoreKG.store.idFor(markerKey)));
        console.log('Note!!');
        console.log(note);
        SC.RunLoop.end();
    },

    onMouseOverNote: function(element) {
        // SC.RunLoop.begin();
        // SC.RunLoop.end();
    },

    onMouseOutNote: function(element) {
        // SC.RunLoop.begin();
        // SC.RunLoop.end();
    },

    showQuickSelectionPopup: function(lonlat) {
        if (lonlat) {
            //SC.Logger.debug('show qFeature popup at %@'.fmt(lonlat));
            var html = [];
            var features = KG.quickSelectionController.get('content');
            if (features && features.get('length') > 0) {
                var title = features.get('length') > 1 ? '_SelectedFeatures'.loc(features.get('length')) : '_SelectedFeature'.loc();
                html.push('<label class="popup-feature-title"><span>' + title + '</span></label>');
                html.push('<ul class="popup-feature-list">');
                features.forEach(function(feature) {
                    html.push('<li storekey="' + feature.get('storeKey') + '" onclick="KG.core_app.onClickQuickFeature(this);" onmouseover="KG.core_app.onMouseOverQuickFeature(this);" onmouseout="KG.core_app.onMouseOutQuickFeature(this);"><span>' + feature.get('descr') + '</span></li>');
                });
                html.push('</ul>');
                KG.mapController.showPopup(lonlat, html.join(''));
            }
        }
    },

    onClickQuickFeature: function(element) {
        SC.Logger.debug('click quick feature');
        SC.RunLoop.begin();
        var storeKey = element.getAttribute('storekey');
        var quickFeature = CoreKG.store.find(CoreKG.QuickFeature, CoreKG.store.idFor(storeKey));
        var feature = quickFeature.get('feature');
        if (feature) {
            KG.selectionController.selectFeature(feature, YES);
            KG.mapController.closePopup();
            this.removeHighlightGeom(storeKey);
        }
        SC.RunLoop.end();
    },

    onMouseOverQuickFeature: function(element) {
        SC.RunLoop.begin();
        var storeKey = element.getAttribute('storekey');
        var quickFeature = CoreKG.store.find(CoreKG.QuickFeature, CoreKG.store.idFor(storeKey));
        this.highlightGeom(quickFeature.get('coordinates'), quickFeature.get('geo_type'), storeKey);
        SC.RunLoop.end();
    },

    onMouseOutQuickFeature: function(element) {
        SC.RunLoop.begin();
        var storeKey = element.getAttribute('storekey');
        this.removeHighlightGeom(storeKey);
        SC.RunLoop.end();
    },

    highlightGeom: function(coordinates, geotype, key) {
        KG.mapController.highlight(coordinates, geotype, key);
    },

    removeHighlightGeom: function(key) {
        KG.mapController.removeHighlight(key);
    },

    centerMapOnSelection: function(target, method) {
        var content = KG.activeSelectionController.get('content');
        if (content) {
            content.onReady(this, this.doCenterMapOnSelection, {
                target: target,
                method: method
            });
        }
    },

    doCenterMapOnSelection: function(record, params) {
        //still the active selection ?
        if (KG.activeSelectionController.get('content') === record) {
            var center = record.get('center');
            if (center) {
                center = CoreKG.LonLat.create({
                    lon: center.x,
                    lat: center.y
                });
                KG.mapController.setCenter(center);
                if (params.target) {
                    params.method.call(params.target);
                }
            }
        }
    },

    highlightSelection: function() {
        var content = KG.activeSelectionController.get('content');
        if (content) {
            console.log('HL active selection');
            content.onReady(this, this.doHighlightSelection);
        } else {
            console.log('* NO CONTENT: Cannot HL active selection');
        }
    },

    clearHighlightSelection: function() {
        KG.mapController.setSelectionHighlight();
    },

    doHighlightSelection: function(record) {
        //still the active selection ?
        if (KG.activeSelectionController.get('content') === record) {
            var coordinates = record.get('coordinates');
            var geo_type = record.get('geo_type');
            KG.mapController.setSelectionHighlight(coordinates, geo_type);
        } else {
            console.log('** NO CONTENT: Cannot HL active selection');
        }
    }

});
