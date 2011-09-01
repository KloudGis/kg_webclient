sc_require('lib/leaflet')
KG.LeafletMap = SC.Object.extend({

    map: null,
    _pendingAddDefaultBaseLayer: NO,
    _pendingCenter: null,
    _pendingAddLayer: [],
    _pendingAddMarker: [],

    popup: null,
    highlights: [],

    init: function() {
        sc_super();
        var pathToImage = sc_static('marker-shadow.png');
        var index = pathToImage.lastIndexOf("/images");
        L.ROOT_URL = pathToImage.substr(0, index + 1);
        L.Icon.prototype.iconUrl = L.ROOT_URL + 'images/marker.png';
        L.Icon.prototype.shadowUrl = L.ROOT_URL + 'images/marker-shadow.png';
		this._pendingAddDefaultBaseLayer = NO;
		this._pendingCenter = null;
	    this._pendingAddLayer = [];
	    this._pendingAddMarker = [];
    },

    cleanUp: function() {
		var map = this.map;
		for(idLayer in map._layers){
			map.removeLayer(map._layers[idLayer]);
		}
    },

    //interface methods
    addToDocument: function(div) {
        console.log('map init');
		if(div){
        	this.map = new L.Map(div);			
		}
        if (this._pendingCenter) {
            this.setCenter(this._pendingCenter.center, this._pendingCenter.zoom);
            this._pendingCenter = null;
        }
        if (this._pendingAddDefaultBaseLayer) {
            this.addDefaultBaseLayer();
            this._pendingAddDefaultBaseLayer = NO;
        }
        if (this._pendingAddLayer.length > 0) {
            var self = this;
            this._pendingAddLayer.forEach(function(layer) {
                self.addLayer(layer);
            });
            this._pendingAddLayer = [];
        }
        if (this._pendingAddMarker.length > 0) {
            var self = this;
            this._pendingAddMarker.forEach(function(marker) {
                self.addMarker(marker);
            });
            this._pendingAddMarker = [];
        }     
		if(div){
			this.map.on('zoomend', this.onZoom, this);
			this.map.on('moveend', this.onMove, this);		
	        this.popup = new L.Popup();
	        this.map.on('click', this.onMapClick, this);
		}
        KG.statechart.sendEvent('mapReadyEvent', this);
    },

    onMapClick: function(e) {
        KG.statechart.sendEvent('mapDidClickEvent', this, CoreKG.LonLat.create({
            lon: e.latlng.lng,
            lat: e.latlng.lat
        }));
    },

    //zoom changed
    onZoom: function(e) {
        KG.statechart.sendEvent('zoomChangedEvent', this, this.map.getZoom());
    },

	//pan the map
    onMove: function(e) {
		var lbounds = this.map.getBounds();
		var sw = CoreKG.LonLat.create({lon: lbounds.getSouthWest().lng, lat: lbounds.getSouthWest().lat});
		var ne = CoreKG.LonLat.create({lon: lbounds.getNorthEast().lng, lat: lbounds.getNorthEast().lat});
		var bounds = CoreKG.Bounds.create({sw: sw, ne: ne});
        KG.statechart.sendEvent('moveChangedEvent', this, bounds);
    },

    showPopup: function(lonlat, html) {
        this.popup.setLatLng(new L.LatLng(lonlat.get('lat'), lonlat.get('lon')));
        this.popup.setContent(html);
        this.map.openPopup(this.popup);
    },

    closePopup: function() {
        this.map.closePopup();
    },

    addDefaultBaseLayer: function() {
        if (this.map === null) {
            this._pendingAddDefaultBaseLayer = YES;
        } else {
            var osmURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            var at = 'OSM';
            var osm = new L.TileLayer(osmURL, {
                maxZoom: 20,
                attribution: at
            });
            this.map.addLayer(osm);
        }
    },

    getCenter: function() {
        var center = this.map.getCenter();
        return CoreKG.LonLat.create({
            lon: center.lng,
            lat: center.lat
        });
    },

    getCenterOffsetPixels: function(pixels) {
        var viewHalf = this.map.getSize().divideBy(2);
        var centerPoint = this.map._getTopLeftPoint().add(viewHalf);
        var pointOff = centerPoint.add(new L.Point(pixels, pixels));
        var offcenter = this.map.unproject(pointOff);
        return CoreKG.LonLat.create({
            lon: offcenter.lng,
            lat: offcenter.lat
        });
    },

	getFatBounds: function(){
		console.log("Fat bounds calc");
		var distX = this.map.getSize().x/4;
		var distY = this.map.getSize().y/4;
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
		var bounds= CoreKG.Bounds.create({sw: CoreKG.LonLat.create({lon: sw.lng, lat: sw.lat}), ne: CoreKG.LonLat.create({lon: ne.lng, lat: ne.lat})});
		//console.log(bounds);
		return bounds;
	},

    setCenter: function(center, zoom) {
        if (this.map === null) {
            this._pendingCenter = {
                center: center,
                zoom: zoom
            };
        } else {
            if (!zoom) {
                zoom = this.map.getZoom();
            }
            SC.Logger.debug('setting the map center to: Lat:' + center.get('lat') + ' Lon:' + center.get('lon'));
            this.map.setView(new L.LatLng(center.get('lat'), center.get('lon')), zoom);
        }
    },

    updateSize: function(center) {
        this.map.invalidateSize();
        if (center) {
            this.map.setView(new L.LatLng(center.get('lat'), center.get('lon')), this.map.getZoom());
        }
    },

    addLayer: function(layer) {
        if (this.map === null) {
            this._pendingAddLayer.push(layer);
        } else {
            if (layer.get('visibility')) {
                var wms = new L.TileLayer.WMS(layer.get('url'), {
                    layers: layer.get('name'),
                    transparent: YES,
                    format: 'image/png',
                    kg_layer: layer.get('id'),
                    kg_sandbox: CoreKG.active_sandbox
                });
                wms.kg_layer = layer;
                this.map.addLayer(wms);
            }
        }
    },

    addMarker: function(marker, contentTarget, contentMethod) {
        if (this.map === null) {
            this._pendingAddMarker.push(marker);
        } else {
            //	console.log('leaflet add marker');
            //	console.log(marker);
            var lmarkerLocation = new L.LatLng(marker.get('lat'), marker.get('lon')),
            lmarker = new L.Marker(lmarkerLocation, {
                draggable: true
            });
            this.map.addLayer(lmarker);
            var len = marker.getPath('notes.length');
            var loadingMessage;
            if (len === 1) {
                loadingMessage = 'Loading the note...';
            } else {
                loadingMessage = '%@ notes to load...'.fmt(len);
            }
            lmarker.bindPopup(loadingMessage);
            lmarker.on('click',
            function() {
                contentMethod.call(contentTarget, marker, lmarker._popup, lmarker._popup.setContent);
            });
            marker._native_marker = lmarker;
        }
    },

    removeMarker: function(marker) {
        if (marker._native_marker) {
            this.map.removeLayer(marker._native_marker);
			marker._native_marker = null;
        }
    },

	closeMarkerPopup: function(marker){
		marker._native_marker.closePopup();
	},

    highlight: function(coordinates, geo_type, key) {
        var options = {
            color: '#0033ff',
            weight: 5,
            opacity: 0.5,
            fillColor: null,
            //same as color by default
            fillOpacity: 0.2,
            clickable: false
        };
        var layer = this.createLayerFromCoordinates(coordinates, geo_type, options);
        if (layer) {
            this.map.addLayer(layer);
            this.highlights.push(SC.Object.create({
                key: key,
                layer: layer
            }));
        }
    },

    removeHighlight: function(key) {
        var hl = this.highlights.findProperty('key', key);
        if (hl) {
            this.map.removeLayer(hl.layer);
            this.highlights.removeObject(hl);
        }
    },

    createLayerFromCoordinates: function(coordinates, geo_type, options) {
        var layer;
        geo_type = geo_type.toLowerCase();
        if (geo_type === 'point') {
            var circleLocation = new L.LatLng(coordinates[0].y, coordinates[0].x);
            //8 pixels radius circle
            options.radius = 7;
            options.weight = 2;
            options.fill = YES;
            layer = new L.CircleMarker(circleLocation, options);
        } else if (geo_type === 'linestring') {
            var latlngs = [];
            coordinates.forEach(function(c) {
                var coord = new L.LatLng(c.y, c.x);
                latlngs.push(coord);
            });
            layer = new L.Polyline(latlngs, options);
        } else if (geo_type === 'polygon') {
            var latlngs = [];
            coordinates.forEach(function(c) {
                var coord = new L.LatLng(c.y, c.x);
                latlngs.push(coord);
            });
            layer = new L.Polygon(latlngs, options);
        }
        return layer;
    },

    setSelectionHighlight: function(coordinates, geo_type) {
        if (this._currentSelectionHL) {
            this.map.removeLayer(this._currentSelectionHL);
        }
        if (coordinates) {
            var options = {
                color: '#ff0000',
                weight: 6,
                opacity: 0.5,
                fillColor: null,
                //same as color by default
                fillOpacity: 0.3,
                clickable: false,
            };
            var layer = this.createLayerFromCoordinates(coordinates, geo_type, options);
            if (layer) {
                this.map.addLayer(layer);
                this._currentSelectionHL = layer;
            }
        }
    }

});
