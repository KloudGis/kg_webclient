KG.core_inspector = SC.Object.create({
	
	_highlight: null,
	
    selectFeature: function(feature) {
		//refresh the map size after the anim
        var center = feature.get('center');
        setTimeout(function() {
            KG.core_leaflet.mapSizeDidChange(center);
        },
        600);
        KG.core_highlight.clearHighlight(this._highlight);
        this._highlight = KG.core_highlight.highlightFeature(feature);
        KG.inspectorController.set('feature', feature);
        KG.inspectorController.set('content', feature.getAttributes());
    },

    cleanSelectFeature: function() {
        KG.core_highlight.clearHighlight(this._highlight);
		this._highlight = null;
		//refresh the map size after the anim
        var center = KG.core_leaflet.getCenter();     
        setTimeout(function() {
            KG.core_leaflet.mapSizeDidChange(center)
        },
        600);
    },
});
