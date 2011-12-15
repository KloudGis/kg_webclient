/**
* Core functions to manage the inspector.
**/
KG.core_inspector = SC.Object.create({
	
	_highlight: null,
	
    selectFeature: function(feature) {
        KG.core_highlight.clearHighlight(this._highlight);
        this._highlight = KG.core_highlight.highlightFeature(feature);
        KG.inspectorController.set('feature', feature);
        KG.inspectorController.set('content', feature.getAttributes());
    },

    cleanSelectFeature: function() {
        KG.core_highlight.clearHighlight(this._highlight);
		this._highlight = null;
    }
});
