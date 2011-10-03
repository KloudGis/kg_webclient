KG.core_inspector = SC.Object.create({
	selectFeature: function(feature) {
        if (!SC.none(feature)) {
            var center = feature.get('center');
			var panel = $('#left-side-panel');
	        panel.addClass('active');
			KG.core_highlight.clearHighlightFeature();
			KG.core_highlight.highlightFeature(feature);
            setTimeout(function() {
				KG.core_leaflet.mapSizeDidChange(center);           				
            },
            600);
			KG.inspectorController.set('feature', feature);
			KG.inspectorController.set('content', feature.getAttributes());
        }
    },

    cleanSelectFeature: function() {
		KG.core_highlight.clearHighlightFeature();
		var center = KG.core_leaflet.getCenter();
		var panel = $('#left-side-panel');
		panel.removeClass('active');
        setTimeout(function() {
            KG.core_leaflet.mapSizeDidChange(center)
        },
        600);
    },
});