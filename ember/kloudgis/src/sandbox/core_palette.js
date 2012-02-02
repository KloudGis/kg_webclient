KG.core_palette = Ember.Object.create({
    //palette view
    _view: null,
    _paletteMarker: null,

    createView: function() {
        if (!this._view) {
			var self = this;
            setTimeout(function() {
                self._view = Ember.View.create({
                    templateName: 'palette'
                });
                self._view.appendTo('#main-sandbox-view');
            },
            1000);
        }
    },

    createFeature: function(paletteItem) {
        //wipe previous marker, if any
        this.clearCreateFeature();
        var center = KG.core_leaflet.getCenter();
        var marker = Ember.Object.create({
            paletteItem: paletteItem
        });
        this._paletteMarker = marker;
        var options = {
            title: paletteItem.get('title'),
            animated: YES,
            iconPath: 'css/images/palette_marker.png',
            draggable: YES,
            popupContent: "_moveFeature".loc(paletteItem.get('label')),
            openPopup: YES,
            dragendTarget: this,
            dragendCb: this.markerDragged,
            injectGetNativePositionFunction: YES
        };
        KG.core_leaflet.addMarker(marker, center.get('lon'), center.get('lat'), options);
        KG.paletteController.set('isDirty', YES);
    },

    clearCreateFeature: function() {
        if (!Ember.none(this._paletteMarker)) {
            KG.core_leaflet.removeMarker(this._paletteMarker);
            this._paletteMarker = null;
        }
        KG.paletteController.set('isDirty', NO);
    },

    markerDragged: function(marker, lon, lat) {
        KG.statechart.sendAction('paletteMarkerDragEnded', {
            paletteItem: marker.paletteItem,
            lon: lon,
            lat: lat
        });
    }
});
