KG.core_leaflet = SC.Object.create({

    map: null,
    popup: null,

    noteIcon: new L.Icon(),
    groupIcon: new L.Icon('resources/images/group.png'),

    //	layerControl: new L.Control.Layers(),
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
        //	map.addControl(this.layerControl);
        map.setView(new L.LatLng(46, -72), 8).addLayer(layer);
        //this.layerControl.addBaseLayer(layer, "Base");
        this.map = map;
        this.popup = new L.Popup();
        this.map.on('zoomend', this.onZoom, this);
        this.map.on('moveend', this.onMove, this);
        this.map.on('click', this.onClick, this);
        this.map.on('layeradd', this.onLayerAdd);
    },

    onZoom: function(e) {
        console.log('zoom changed');
        SC.run.begin();
        KG.statechart.sendAction('mapZoomed', this);
        SC.run.end();
    },

    onMove: function(e) {
        console.log('map moved');
        SC.run.begin();
        KG.statechart.sendAction('mapMoved', this);
        SC.run.end();
    },

    onClick: function(e) {
        console.log('map clicked');
    },

    onLayerAdd: function(e) {},

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
        return this._getBounds(this.pixelsToWorld(this.map.getSize().divideBy(6).x));
    },

    getBounds: function() {
        return this._getBounds(0);
    },

    _getBounds: function(fat) {
        var lbounds = this.map.getBounds();
        var lcenter = this.map.getCenter();

        var sw = lbounds._southWest;
        var ne = lbounds._northEast;
        if (!lbounds.contains(lcenter)) {
            console.log('quick fix to find the real bounds');
            ne.lat = Math.min(ne.lat + fat, 90);
            ne.lng = Math.min(sw.lng + fat, 180);
            sw.lng = -180;
        } else {
            sw.lat = Math.max(sw.lat - fat, -90);
            sw.lng = Math.max(sw.lng - fat, -180);
            ne.lat = Math.min(ne.lat + fat, 90);
            ne.lng = Math.min(ne.lng + fat, 180);
        }

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
        return bounds;
    },

    setCenter: function(center, zoom) {
        if (!zoom) {
            zoom = this.map.getZoom();
        }
        SC.Logger.debug('setting the map center to: Lat:' + center.get('lat') + ' Lon:' + center.get('lon'));
        this.map.setView(new L.LatLng(center.get('lat'), center.get('lon')), zoom);
    },

    addMarker: function(marker, click_target, click_cb) {
        //	console.log('leaflet add marker');
        //	console.log(marker);
        var lmarkerLocation = new L.LatLng(marker.get('lat'), marker.get('lon'));
        var icon = this.noteIcon;
        if (marker.get('featureCount') > 1) {
            icon = this.groupIcon;
        }
        lmarker = new L.Marker(lmarkerLocation, {
            draggable: false,
            title: marker.get('tooltip'),
            icon: icon
        });
        this.map.addLayer(lmarker);
        var len = marker.getPath('notes.length');
        lmarker.bindPopup("...");
        lmarker.on('click',
        function() {
            SC.run.begin();
            click_cb.call(click_target, marker);
            SC.run.end();
        });
        //patch to make the popup hide on Safari Mac.
        if ($.browser.safari && navigator.platform.indexOf('Mac') == 0) {
            lmarker._popup._close = function() {
                if (this._opened) {
                    this._map.removeLayer(this);
                    var element = $(".leaflet-popup-pane")[0];
					if(element.style.width == '1px'){
						element.style.width = '0px';
					}else{
						element.style.width = '1px';
					}			
                }
            };
        }
        marker._native_marker = lmarker;
    },

    removeMarker: function(marker) {
        if (marker._native_marker) {
            this.map.removeLayer(marker._native_marker);
            marker._native_marker = null;
        }
    },

    refreshMarkerPopup: function(marker, div) {
        if (marker._native_marker._popup) {
            marker._native_marker._popup.setContent(div);
        }
    },

    closeMarkerPopup: function(marker) {
        marker._native_marker.closePopup();
    },

    addWMSLayer: function(layer) {
        var wms = new L.TileLayer.WMS(layer.get('url'), {
            layers: layer.get('name'),
            transparent: YES,
            format: 'image/png',
            kg_layer: layer.get('id'),
            kg_sandbox: KG.get('active_sandbox')
        });
        layer._native_layer = wms;
        this.map.addLayer(wms);
        //	this.layerControl.addOverlay(wms, layer.get('label'));
    },

    _temp: null,
    printBounds: function() {
        if (!SC.none(this._temp)) {
            this.map.removeLayer(this._temp);
        }
        var bounds = this.getBounds();
        var sw = bounds.sw;
        var ne = bounds.ne;
        var p1 = new L.LatLng(sw.lat, sw.lon);
        var p2 = new L.LatLng(ne.lat, sw.lon);
        var p3 = new L.LatLng(ne.lat, ne.lon);
        var p4 = new L.LatLng(sw.lat, ne.lon);
        var pts = [p1, p2, p3, p4];
        this._temp = new L.Polygon(pts);
        this.map.addLayer(this._temp);
        return bounds;
    },

});

/*var osmURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var at = 'OSM';
var layer = new L.TileLayer(osmURL, {
    maxZoom: 20,
    attribution: at
});
*/

