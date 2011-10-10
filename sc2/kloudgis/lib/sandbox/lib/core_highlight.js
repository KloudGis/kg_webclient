KG.core_highlight = SC.Object.create({
	
	clearHighlight: function(hl) {
        if (hl) {
            KG.core_leaflet.removeHighlight(hl);
        }
    },

    highlightFeature: function(feature) {
        if (!feature) {
            return NO;
        }
        return KG.core_leaflet.addHighlight(feature.get('coords'), feature.get('geo_type'));
    },

	clearHighlightMarker: function(hlMarker) {
        if (hlMarker) {
            KG.core_leaflet.removeMarker(hlMarker);
        }
    },

    addHighlightMarker: function(lonLat) {
        if (!lonLat) {
            return NO;
        }
        return KG.core_leaflet.addHighlightMarker(lonLat);
    }
})