/**
* Core functions to perform highlights
* 
**/
KG.core_highlight = SC.Object.create({

	//use map leaflet default object.
	map: KG.core_leaflet,

    clearHighlight: function(hl) {
        if (hl) {
            this.map.removeHighlight(hl);
        }
    },

    highlightFeature: function(feature) {
        if (!feature) {
            return NO;
        }
        try {
            return this.map.addHighlight(feature.get('geo'));
        } catch(e) {
            return null;
        }
    },

    clearHighlightMarker: function(hlMarker) {
        if (hlMarker) {
            this.map.removeMarker(hlMarker);
        }
    },

    addHighlightMarker: function(lonLat) {
        if (!lonLat) {
            return NO;
        }
        try {
            var options = {
                title: null,
                animated: NO,
                iconPath: 'resources/images/highlight.png',
                draggable: NO,
                dragendTarget: this,
                dragendCb: this.markerDragged,
                injectGetNativePositionFunction: YES
            };
            var marker = Ember.Object.create({
                lon: function() {
                    return this.getNativePosition().get('lon');
                }.property(),
                lat: function() {
                    return this.getNativePosition().get('lat');
                }.property()
            });
            return this.map.addMarker(marker, lonLat.get('lon'), lonLat.get('lat'), options);
        } catch(e) {
            return NO;
        }
    },

    markerDragged: function(marker, lon, lat) {
        KG.statechart.sendAction('markerDragEnded', lon, lat);
    }
})
