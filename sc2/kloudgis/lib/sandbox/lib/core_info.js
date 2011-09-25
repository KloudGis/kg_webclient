//predefined queries
KG.INFO_QUERY = SC.Query.remote(KG.Feature, {
    query_url: 'to_override'
});

KG.core_info = SC.Object.create({

    limit_query: 10,

    findFeaturesAt: function(lonlat) {
        var onePixel = KG.core_leaflet.pixelsToWorld(1);
        var sLayers = KG.core_layer.getLayersSelection();
        var layers = sLayers.map(function(item, index, self) {
            return item.get('id');
        }).join(',');
		if (KG.infoController.get('content') && KG.infoController.get('content').destroy) {
            var content = KG.infoController.get('content');
            content.destroy();
        }
        if (layers.length > 0) {
            var url = '/api_data/protected/features/features_at?sandbox=%@&lat=%@&lon=%@&one_pixel=%@&limit=%@&layers=%@'.fmt(KG.get('activeSandboxKey'), lonlat.get('lat'), lonlat.get('lon'), onePixel, this.get('limit_query'), layers);
            KG.INFO_QUERY.set('query_url', url);
            KG.infoController.set('content', KG.store.find(KG.INFO_QUERY));
        } else {
            KG.infoController.set('content', []);
        }
    },


	selectionInfoDidChange: function(){
		console.log('selection changed!');
		if(KG.infoController.get('hasSelection')){
			$('#super-map').addClass('map-info-selection');
			$('#side-panel').addClass('map-info-selection');
		}else{
			$('#super-map').removeClass('map-info-selection');
			$('#side-panel').removeClass('map-info-selection');
		}
		setTimeout(function(){KG.core_leaflet.mapSizeDidChange()}, 1100);
	}.observes('KG.infoController.hasSelection')
	
});
