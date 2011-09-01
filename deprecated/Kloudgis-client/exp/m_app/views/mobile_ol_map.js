/** @class KG.MObileOLMapView

  Sproutcore view to display a map from OpenLayers.

  @extends SC.View
*/
KG.MobileOLMapView = SC.View.extend(
/** @scope Kloudgis.OLMapView.prototype */
 {
    map: null,	
	_mapInDoc: NO,

    /**
	*	get the openlayers map reference
	*/
    getMap: function() {
        return this.map;
    },

    init: function() {
		sc_super();
        this.map = new OpenLayers.Map({
            //we dont want the default theme
            theme: null,
            displayProjection: new OpenLayers.Projection("EPSG:4326"),
            //need to set this max extent to match GWC resolution.
            //maxExtent: new OpenLayers.Bounds( - 20037508.34, -20037508.34, 20037508.34, 20037508.34)
			controls: [
			            new OpenLayers.Control.Attribution(),
			            new OpenLayers.Control.TouchNavigation({
			                dragPanOptions: {
			                    interval: 100,
			                    enableKinetic: true
			                }
			            }),
			            new OpenLayers.Control.ZoomPanel()
			        ],
					layers: [
			            new OpenLayers.Layer.OSM("OpenStreetMap", null, {
			                transitionEffect: 'resize'
			            })
			        ],
			        center: new OpenLayers.LonLat(742000, 5861000),
			        zoom: 3
        });	
    },

    addLayer: function(layer) {
        if (this.map) {
            this.map.addLayer(layer);
        }
    },

    addControl: function(control) {
        if (this.map) {
            this.map.addControl(control);
        }
    },

    didAppendToDocument: function() {
        if(!this._mapInDoc){
		this.addMapToDocument();
		this._mapInDoc = YES;
		}
    },

    addMapToDocument: function() {
        var mapCanvasId = this.get("layerId");
        if (this.map) {
            this.map.render(mapCanvasId);
        } else {
            console.log("Map was'nt init!  Call setup() method.");
        }
    }
});
