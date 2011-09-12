KG.core_leaflet = SC.Object.create({

    map: null,
    popup: null,

    addToDocument: function() {
        var key = '8ccaf9c293f247d6b18a30fce375e298';
        var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/' + key + '/997/256/{z}/{x}/{y}.png',
        cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
        layer = new L.TileLayer(cloudmadeUrl, {
            maxZoom: 18,
            attribution: cloudmadeAttribution
        });

        // initialize the map on the "map" div
        var map = new L.Map('map');
        map.setView(new L.LatLng(46, -72), 8).addLayer(layer);
        this.map = map;
        this.popup = new L.Popup();
        this.map.on('zoomend', this.onZoom, this);
        this.map.on('moveend', this.onMove, this);
        this.map.on('click', this.onClick, this);
		this.map.on('layeradd', this.onLayerAdd);
    },

    onZoom: function(e) {
        console.log('zoom changed');
    },

    onMove: function(e) {
        console.log('map moved');
    },

    onClick: function(e) {
        console.log('map clicked');
    },

	onLayerAdd: function(e) {
        console.log('layer added');
    },

    pixelsToWorld: function(pixels) {
        var center = this.getCenter();
        var centerOff = this.getCenterOffsetPixels(pixels);
        var dLat = centerOff.lat - center.lat;
        var dLon = centerOff.lon - center.lon;
        return Math.sqrt(dLat * dLat + dLon * dLon);
    },

    getCenter: function() {
        var center = this.map.getCenter();
        return KG.LonLat.create({
            lon: center.lng,
            lat: center.lat
        });
    },

    getCenterOffsetPixels: function(pixels) {
        var viewHalf = this.map.getSize().divideBy(2);
        var centerPoint = this.map._getTopLeftPoint().add(viewHalf);
        var pointOff = centerPoint.add(new L.Point(pixels, pixels));
        var offcenter = this.map.unproject(pointOff);
        return KG.LonLat.create({
            lon: offcenter.lng,
            lat: offcenter.lat
        });
    },

    getFatBounds: function() {
        console.log("Fat bounds calc");
        var distX = this.map.getSize().x / 4;
        var distY = this.map.getSize().y / 4;
        var lbounds = this.map.getPixelBounds();
        var min = lbounds.min;
        var max = lbounds.max;
        //sw
        var x = min.x - distX;
        var y = max.y + distY;
        var sw = this.map.unproject(new L.Point(x, y));
        //ne
        var x1 = max.x + distX;
        var y1 = min.y - distY;
        var ne = this.map.unproject(new L.Point(x1, y1));
        var bounds = KG.Bounds.create({
            sw: KG.LonLat.create({
                lon: sw.lng,
                lat: sw.lat
            }),
            ne: KG.LonLat.create({
                lon: ne.lng,
                lat: ne.lat
            })
        });
        console.log(bounds);
        return bounds;
    },

    setCenter: function(center, zoom) {
        if (!zoom) {
            zoom = this.map.getZoom();
        }
        SC.Logger.debug('setting the map center to: Lat:' + center.get('lat') + ' Lon:' + center.get('lon'));
        this.map.setView(new L.LatLng(center.get('lat'), center.get('lon')), zoom);
    },

    addMarker: function(marker, contentView, click_target, click_cb) {
        //	console.log('leaflet add marker');
        //	console.log(marker);
        var lmarkerLocation = new L.LatLng(marker.get('lat'), marker.get('lon')),
        lmarker = new L.Marker(lmarkerLocation, {
            draggable: false
        });
        this.map.addLayer(lmarker);
        var len = marker.getPath('notes.length');
        if (contentView) {
            var div = document.createElement('div');
            contentView.appendTo(div);
            lmarker.bindPopup(div, {title:'_Notes'.loc()});
			lmarker.on('click', function(){
				click_cb.call(click_target, marker);
			});
        }
        marker._native_marker = lmarker;
    },

    removeMarker: function(marker) {
        if (marker._native_marker) {
            this.map.removeLayer(marker._native_marker);
            marker._native_marker = null;
        }
    },

	refreshMarkerPopup: function(marker){
		if(marker._native_marker._popup._container){
			marker._native_marker._popup._updateLayout();
			marker._native_marker._popup._updatePosition();
		}
	},

    closeMarkerPopup: function(marker) {
        marker._native_marker.closePopup();
    },

});

/*var osmURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var at = 'OSM';
var layer = new L.TileLayer(osmURL, {
    maxZoom: 20,
    attribution: at
});
*/

