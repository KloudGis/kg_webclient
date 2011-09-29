KG.core_inspector = SC.Object.create({
	selectFeature: function(feature) {
        if (!SC.none(feature)) {
            var center = feature.get('center');
            $('#super-map').addClass('map-info-selection');
            $('#side-panel').addClass('map-info-selection');
			KG.core_highlight.clearHighlightFeature();
			KG.core_highlight.highlightFeature(feature);
            setTimeout(function() {
                KG.core_leaflet.mapSizeDidChange(center);				
            },
            700);
			KG.inspectorController.set('feature', feature);
			KG.inspectorController.set('content', feature.getAttributes());
        }
    },

    cleanSelectFeature: function() {
		KG.core_highlight.clearHighlightFeature();
		var center = KG.core_leaflet.getCenter();
        $('#super-map').removeClass('map-info-selection');
        $('#side-panel').removeClass('map-info-selection');
        setTimeout(function() {
            KG.core_leaflet.mapSizeDidChange(center)
        },
        700);
    },
});