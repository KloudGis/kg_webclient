//predefined queries
KG.INFO_QUERY = SC.Query.remote(KG.Feature, {
    query_url: 'to_override'
});

KG.core_info = SC.Object.create({

    limit_query: 10,

    findFeaturesAt: function(lonLat) {
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
            var url = '/api_data/protected/features/features_at?sandbox=%@&lat=%@&lon=%@&one_pixel=%@&limit=%@&layers=%@'.fmt(KG.get('activeSandboxKey'), lonLat.get('lat'), lonLat.get('lon'), onePixel, this.get('limit_query'), layers);
            KG.INFO_QUERY.set('query_url', url);
			KG.INFO_QUERY._lonLat=lonLat;
            var records = KG.store.find(KG.INFO_QUERY);
            KG.infoController.set('content', records);
            records.onReady(this, this.infoReady);
        } else {
            KG.infoController.set('content', []);
        }
    },

    infoReady: function(records) {
        records.offReady();
		var center;
        if (records.get('length') > 0) {
			center = records.get('query')._lonLat;
            $('#super-map').addClass('map-info-selection');
            $('#side-panel').addClass('map-info-selection');
        } else {
            $('#super-map').removeClass('map-info-selection');
            $('#side-panel').removeClass('map-info-selection');
        }
		
		setTimeout(function(){KG.core_leaflet.mapSizeDidChange(center)}, 700);
    }

    /*
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
*/
});
