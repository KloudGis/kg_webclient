//predefined queries

/**
* Core functions to perform feature info.
**/
KG.core_info = SC.Object.create({

    limit_query: 10,

    highlight: null,

    _finding: NO,
    _timeout: null,

    findFeaturesAt: function(lonLat) {
        if (this._finding) {
            if (this._timeout) {
                clearTimeout(this._timeout);
            }
            var self = this;
            this._timeout = setTimeout(function() {
                if (KG.infoController.get('status') & SC.Record.ERROR) {
                    this._finding = NO;
                }
                self.findFeaturesAt(lonLat);
            },
            1000);
            return NO;
        }
        this._finding = YES;
        var onePixel = KG.core_leaflet.pixelsToWorld(1);
        var sLayers = KG.core_layer.getLayersSelection();
        var layers = sLayers.map(function(item, index, self) {
            return item.get('id');
        }).join(',');
        if (KG.infoController.get('content') && KG.infoController.get('content').destroy) {
            var content = KG.infoController.get('content');
            content.destroy();
            console.log('info controller did destroy content');
        }
        if (layers.length > 0) {
			KG.INFO_QUERY.lat = lonLat.get('lat');
			KG.INFO_QUERY.lon = lonLat.get('lon');
		    KG.INFO_QUERY.one_pixel = onePixel;
		 	KG.INFO_QUERY.limit_query = this.get('limit_query');
		 	KG.INFO_QUERY.layers = layers;           
            var records = KG.store.find(KG.INFO_QUERY);
            KG.infoController.set('content', records);
            records.onReady(this, this.infoReady);
        } else {
            console.log('No valid layer to do a F_INFO');
            KG.infoController.set('content', []);
        }
		this.clearViewInfo();
    },

    infoReady: function(records) {
        records.offReady();
        if (records.get('length') > 0) {
            KG.statechart.sendAction('featureInfoReady');
        }
        if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }
        this._finding = NO;
    },

    showInfoPopup: function() {
        var records = KG.infoController.get('content');
        if (records.get('length') > 0) {
			var center = records.getPath('firstObject.center');
            if (center) {
				this.clearViewInfo();
				if (SC.none(this._div_info)) {
		            this._div_info = document.createElement('div');         
		        }
                var div = this._div_info;
				this._view_info = SC.View.create({
		            templateName: 'info-popup',
		        });
		        this._view_info.appendTo(div);
				setTimeout(function(){KG.core_leaflet.showPopupInfo(center, div);},1);               
            }
        }

    },

    hideInfoPopup: function() {
        KG.core_leaflet.closePopup();
		this.clearViewInfo();
    },

    expandPopupDidChange: function() {
        setTimeout(function() {
            KG.core_leaflet.updatePopupInfo();
        },
        1);
    }.observes('KG.infoController.listVisible'),

	clearViewInfo: function(){
		if(!SC.none(this._view_info)){
			this._view_info.destroy();
		}
	}
});
