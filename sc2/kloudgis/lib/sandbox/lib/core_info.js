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
            KG.INFO_QUERY._lonLat = lonLat;
            var records = KG.store.find(KG.INFO_QUERY);
            KG.infoController.set('content', records);
            records.onReady(this, this.infoReady);
        } else {
			console.log('No valid layer to do a F_INFO');
            KG.infoController.set('content', []);
        }
        if (SC.none(this._div_info)) {
            this._div_info = document.createElement('div');
            this._view_info = SC.View.create({
                templateName: 'info-popup',
            });
            this._view_info.appendTo(this._div_info);
        }
    },

    infoReady: function(records) {
        records.offReady();
		if(records.get('length') > 0){
        	KG.statechart.sendAction('featureInfoReady');
		}
    },

    showInfoPopup: function() {
        var records = KG.infoController.get('content');
        if (records.get('length') > 0) {
            var center = records.getPath('firstObject.center');
            if (!center) {
                center = records.get('query')._lonLat;
            }
            if (center) {
                var div = this._div_info;
                KG.core_leaflet.showPopupInfo(center, div);
            }
        }

    },

    hideInfoPopup: function() {
        KG.core_leaflet.hidePopupInfo();
    },

    selectFeature: function() {
        var records = KG.infoController.get('content');
        if (records.get('length') > 0) {
            var center = records.getPath('firstObject.center');
            if (!center) {
                center = records.get('query')._lonLat;
            }
            if (center) {
                $('#super-map').addClass('map-info-selection');
                $('#side-panel').addClass('map-info-selection');
                setTimeout(function() {
                    KG.core_leaflet.mapSizeDidChange(center)
                },
                700);
            }
        }

    },

    cleanSelectFeature: function() {
        $('#super-map').removeClass('map-info-selection');
        $('#side-panel').removeClass('map-info-selection');
        setTimeout(function() {
            KG.core_leaflet.mapSizeDidChange(center)
        },
        700);
    }
});
