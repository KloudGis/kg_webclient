sc_require('lib/OpenLayers')
KG.OLMap = SC.Object.extend({

    map: null,
    lonlatProj: new OpenLayers.Projection("EPSG:4326"),
    //jeff at home Bing key: 
    _bingApiKey: 'Anvn3DMhTFsggcirvNz1TNQrxCzksEg-b47gtD7AO1iOzZicEiF2mFZoleYMkX8z',
	infoControl: null,

    init: function() {
        sc_super();
        var pathToImage = sc_static('north-mini.png');
        var index = pathToImage.lastIndexOf("/");
        OpenLayers.ImgPath = pathToImage.substr(0, index + 1);
        if (this.map === null) {
            this.map = new OpenLayers.Map({
                //we dont want the default theme
                theme: null,
                controls: [
                new OpenLayers.Control.PanZoom(), new OpenLayers.Control.MousePosition(), new OpenLayers.Control.Scale(), new OpenLayers.Control.ScaleLine(), new OpenLayers.Control.Navigation(), new OpenLayers.Control.LayerSwitcher(), new OpenLayers.Control.Attribution()],
                displayProjection: new OpenLayers.Projection("EPSG:4326"),
                //need to set this max extent to match GWC resolution.
                maxExtent: new OpenLayers.Bounds( - 20037508.34, -20037508.34, 20037508.34, 20037508.34)
            });
            this.infoControl = new OpenLayers.Control.WMSGetFeatureInfo({
                url: '%@/wms'.fmt(CoreKG.context_server),
                layers: [],
                infoFormat: 'application/vnd.ogc.gml',
                queryVisible: true,
                buildWMSOptions: function(url, layers, clickPosition, format) {
                    var ret = OpenLayers.Control.WMSGetFeatureInfo.prototype.buildWMSOptions.apply(this, arguments);
					//security push sandbox id in the request params
					if(layers && layers.length > 0){
                    	ret.params.kg_sandbox = CoreKG.active_sandbox;
					}
                    return ret;
                }
            });
            this.infoControl.events.register("getfeatureinfo", this, this.infoFeatureEvent);
            this.map.addControl(this.infoControl);
            this.infoControl.deactivate();
        }
    },

	destroy: function(){
		sc_super();
		if(this.map){
			this.map.destroy();
			this.map = null;
		}
		this.lonlatProj = null;
		this.infoControl = null;
	},

    //interface methods
    addToDocument: function(div) {
        this.map.render(div);
    },

    addDefaultBaseLayer: function() {
        /*var google = new OpenLayers.Layer.Google("Google", {
            //type: type,
            numZoomLevels: 20
        });
        this.map.addLayer(google);*/
        var osm = new OpenLayers.Layer.OSM();
        this.map.addLayer(osm);
        var road = new OpenLayers.Layer.Bing({
            key: this._bingApiKey,
            type: "road"
        });
        this.map.addLayer(road);
        var aerial = new OpenLayers.Layer.Bing({
            key: this._bingApiKey,
            type: "Aerial"
        });
        this.map.addLayer(aerial);
        var hybrid = new OpenLayers.Layer.Bing({
            key: this._bingApiKey,
            type: "AerialWithLabels"
        });
        this.map.addLayer(hybrid);
    },

    getCenter: function() {
        var center = this.map.getCenter();
        return CoreKG.LonLat.create({
            lon: center.lon,
            lat: center.lat
        });
    },

    setCenter: function(center, zoom) {
        var lonlat = new OpenLayers.LonLat(center.get('lon'), center.get('lat'));
        var lonlatProj = lonlat.transform(this.lonlatProj, this.map.getProjectionObject());
        this.map.setCenter(lonlatProj, zoom);
    },

    updateSize: function(center) {
        this.map.updateSize();
    },

    addLayer: function(layer) {
        var wms = new OpenLayers.Layer.WMS(layer.get('label'), layer.get('url'), {
            layers: layer.get('name'),
            transparent: YES,
            format: 'image/png',
            tiled: YES,
            srs: 'EPSG:900913',
            kg_sandbox: CoreKG.active_sandbox
        },
        {
            isBaseLayer: false,
            buffer: layer.get('buffer'),
            displayOutsideMaxExtent: layer.get('displayOutsideExtent') || false,
            visibility: layer.get('visibility') && !layer.get('isGroupedLayer'),
            //transitionEffect: 'resize'
        });
        wms.kg_layer = layer;
        this.map.addLayer(wms);
		if(layer.get('isSelectable') && !layer.get('isGroupLayer')){
			this.infoControl.layers.push(wms);
		}
    },

 	activateSelection: function(){
		this.infoControl.activate();
	},
	
	deactivateSelection: function(){
		this.infoControl.deactivate();
	},
	
	//info control event handler
/*	infoFeatureEvent: function(e) {
		//console.log(e);
		var i;
		var selection = [];
		for(i=0; i < e.features.length; i++){
			var fea = e.features[i];
			var fidSplit = fea.fid.split('.');
			var qFea = CoreKG.QuickFeature.create({fid: fidSplit[1], featuretype: fidSplit[0], geowkt: fea.geometry.toString()});
			selection.push(qFea);
		}
        KG.statechart.sendEvent('featuresSelectedEvent', this, selection);
    },*/

	addMarker: function(marker){
		
	},
	
	removeMarker: function( marker){
		
	}
});
