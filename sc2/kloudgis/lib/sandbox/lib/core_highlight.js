KG.core_highlight = SC.Object.create({
	
	_featureHighlight: null,
	
	clearHighlightFeature: function() {
        if (this._featureHighlight) {
            KG.core_leaflet.removeHighlight(this._featureHighlight);
        }
    },

    highlightFeature: function(feature) {
        if (!feature) {
            return NO;
        }
        this._featureHighlight = KG.core_leaflet.addHighlight(feature.get('coords'), feature.get('geo_type'));
        return YES;
    }
})