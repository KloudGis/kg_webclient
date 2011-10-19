//predefined queries
KG.LAYER_QUERY = SC.Query.local(KG.Layer, {query_url: 'to_override'});

KG.core_layer = SC.Object.create({
	
	loadLayers:function(){
		KG.LAYER_QUERY.set('query_url', '/api_data/protected/layers?sandbox=%@'.fmt(KG.get('activeSandboxKey')));
		var layers = KG.store.find(KG.LAYER_QUERY);
		KG.layersController.set('content', layers);
		layers.onReady(this, this._layersReady);
	},
	
	_layersReady: function(layers){
		//FIXME: sortProperty is not yet implemented in beta3
		var ordered = layers;//layers.sortProperty('renderOrder'); 
		
		ordered.filterProperty('visibility', YES).forEach(function(layer){
			KG.core_leaflet.addWMSLayer(layer);
		});
	},
	
	getLayersSelection: function(){
		var layers = KG.layersController.get('content');
		if(!SC.none(layers) && layers.get('length') > 0){
			var sel = layers.filterProperty('visibility', YES).filterProperty('isSelectable', YES);
			return sel;
		}
		return [];
	}
	
});