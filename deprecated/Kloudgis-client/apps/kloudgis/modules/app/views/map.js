/** @class KG.OLMapView

  Sproutcore view to display a map from OpenLayers.

  @extends SC.View
*/
KG.MapView = SC.View.extend(
/** @scope Kloudgis.OLMapView.prototype */
 {
	_mapInDoc: NO,

    getMap: function() {
        return this.map;
    },

	render: function(context, firstTime){
		if(firstTime){
			context.push('<div id="map-id"></div>');
		}
	},

    didAppendToDocument: function() {
        if(!this._mapInDoc){
			KG.mapController.addToDocument("map-id");
			this._mapInDoc = YES;
		}else{
			KG.mapController.addToDocument();
		}
    },

	cleanUp: function(){
	},

	touchStart: function(touch) {
        touch.allowDefault();
    },

    touchesDragged: function(evt, touches) {
        evt.allowDefault();
    },

    touchEnd: function(touch) {
        touch.allowDefault();
    }
});
