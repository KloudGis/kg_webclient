/**
* Core functions to manage the map (leaflet framework)
**/
KG.core_leaflet = SC.Object.create({

    map: null,

    //private variables
    _popupInfo: null,
    _popupMarker: null,

    //icons
    noteIcon: new L.Icon(),
    groupIcon: new L.Icon('resources/images/group.png'),
    newNoteIcon: new L.Icon('resources/images/new.png'),
    hlNoteIcon: new L.Icon('resources/images/highlight.png'),

    //	layerControl: new L.Control.Layers(),
    addToDocument: function() {
        /* var key = '8ccaf9c293f247d6b18a30fce375e298';
        var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/' + key + '/997/256/{z}/{x}/{y}.png',
        cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
        cloudmade = new L.TileLayer(cloudmadeUrl, {
            maxZoom: 18,
            attribution: cloudmadeAttribution
        });*/

        //patch to make the popup hide on Safari Mac.
        if ($.browser.safari && navigator.platform.indexOf('Mac') == 0) {
            L.Popup.prototype._close = function() {
                if (this._opened) {
                    this._map.removeLayer(this);
                    var element = $(".leaflet-popup-pane")[0];
                    if (element.style.width == '1px') {
                        element.style.width = '0px';
                    } else {
                        element.style.width = '1px';
                    }
                }
            };
        }

        var mapquestUrl = 'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
        mapquestAttribution = "Data CC-By-SA by <a href='http://openstreetmap.org/' target='_blank'>OpenStreetMap</a>, Tiles Courtesy of <a href='http://open.mapquest.com' target='_blank'>MapQuest</a>",
        mapquest = new L.TileLayer(mapquestUrl, {
            maxZoom: 18,
            attribution: mapquestAttribution,
            subdomains: ['1', '2', '3', '4']
        });

        // initialize the map on the "map" div
        var map = new L.Map('map', {});
/*
        //bug fix in LEAFLET
        L.Marker.prototype._removeIcon = function() {
            //add this if
            if (!this._map) {
                this._map = map;
            }
            this._map._panes.markerPane.removeChild(this._icon);
            if (this._shadow) {
                this._map._panes.shadowPane.removeChild(this._shadow);
            }
            this._icon = this._shadow = null;
        };

        L.Path.prototype._updateSvgViewport = function() {
            //add this if
            if (!this._map) {
                this._map = map;
            }
            this._updateViewport();
            var vp = this._map._pathViewport,
            min = vp.min,
            max = vp.max,
            width = max.x - min.x,
            height = max.y - min.y,
            root = this._map._pathRoot,
            pane = this._map._panes.overlayPane;

            // Hack to make flicker on drag end on mobile webkit less irritating
            // Unfortunately I haven't found a good workaround for this yet
            if (L.Browser.mobileWebkit) {
                pane.removeChild(root);
            }

            L.DomUtil.setPosition(root, min);
            root.setAttribute('width', width);
            root.setAttribute('height', height);
            root.setAttribute('viewBox', [min.x, min.y, width, height].join(' '));

            if (L.Browser.mobileWebkit) {
                pane.appendChild(root);
            }
        };
*/
        //	map.addControl(this.layerControl);
        map.setView(new L.LatLng(46, -72), 8).addLayer(mapquest);

        //this.layerControl.addBaseLayer(layer, "Base");
        this.map = map;
        this.map.on('zoomend', this.onZoom, this);
        this.map.on('moveend', this.onMove, this);
        this.map.on('click', this.onClick, this);
        this.map.on('layeradd', this.onLayerAdd, this);
        this.map.on('layerremove', this.onLayerRemove, this);
        //2 reasons:
        //- If touch, no need to track the "mouse" position, there is no mouse.
        //- On mobile safari (4.3.2), the input textfield in a popup cannot take the focus is the mouseMove event is set in the map.
        if (!L.Browser.touch) {
            this.map.on('mousemove', this.onMouseMove, this);
        }

        this._popupInfo = new L.Popup({
            closeButton: false
        });
        this._popupMarker = new L.Popup({
            closeButton: true,
            offset: new L.Point(0, -33),
        });
        //disable interaction with the map over the popup
        this._popupInfo._initLayout();
        if (L.Browser.touch) {
            L.DomEvent.addListener(this._popupInfo._wrapper, L.Draggable.START, KG.core_leaflet.stopPropagation);
            L.DomEvent.addListener(this._popupInfo._wrapper, L.Draggable.END, KG.core_leaflet.stopPropagation);
            L.DomEvent.addListener(this._popupInfo._wrapper, L.Draggable.MOVE, KG.core_leaflet.stopPropagation);
        }
        L.DomEvent.addListener(this._popupInfo._wrapper, 'mousewheel', L.DomEvent.stopPropagation);

        this._popupMarker._initLayout();
        if (L.Browser.touch) {
            L.DomEvent.addListener(this._popupMarker._wrapper, L.Draggable.START, KG.core_leaflet.stopPropagation);
            L.DomEvent.addListener(this._popupMarker._wrapper, L.Draggable.END, KG.core_leaflet.stopPropagation);
            L.DomEvent.addListener(this._popupMarker._wrapper, L.Draggable.MOVE, KG.core_leaflet.stopPropagation);
        }
        L.DomEvent.addListener(this._popupMarker._wrapper, 'mousewheel', KG.core_leaflet.stopPropagation);
    },

    stopPropagation: function(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
    },

    onZoom: function(e) {
        //	console.log('on Zoom');
        SC.run.begin();
        KG.statechart.sendAction('mapZoomedAction', this);
        SC.run.end();
    },

    onMove: function(e) {
        //  console.log('on Move');
        SC.run.begin();
        KG.statechart.sendAction('mapMovedAction', this);
        SC.run.end();
    },

    onClick: function(e) {
        //	console.log('on Click');
        SC.run.begin();
        KG.statechart.sendAction('clickOnMapAction', KG.LonLat.create({
            lon: e.latlng.lng,
            lat: e.latlng.lat
        }));
        SC.run.end();
    },

    onMouseMove: function(e) {
        //	console.log('on MouseMove');
        SC.run.begin();
        KG.core_sandbox.set('mousePosition', KG.LonLat.create({
            lon: e.latlng.lng,
            lat: e.latlng.lat
        }));
        SC.run.end();
    },

    onLayerAdd: function(e) {
        SC.run.begin();
        if (e.layer === this._popupInfo) {
            $(this._popupInfo._container).addClass('info-popup');
        }
        SC.run.end();
    },

    onLayerRemove: function(e) {
        SC.run.begin();
        var self = KG.core_leaflet;
        if (self._popupMarker && self._popupMarker === e.layer) {
            console.log('popup closed');
            //popup closed
            KG.statechart.sendAction('hideMarkerPopupAction', self);
            e.layer.off('click', e.layer.openPopup, e.layer);
        } else if (self._popupInfo && self._popupInfo === e.layer) {
            //popup closed
            KG.statechart.sendAction('hideInfoPopupAction', self);
        }
        SC.run.end();
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

    getZoom: function() {
        return this.map.getZoom();
    },

    getFatBounds: function() {
        return this._getBounds(this.pixelsToWorld(this.map.getSize().divideBy(6).x));
    },

    getBounds: function() {
        return this._getBounds(0);
    },

    getBoundsA: function() {
        var lbounds = this.map.getBounds();
        var lcenter = this.map.getCenter();
        var sw = lbounds._southWest;
        var ne = lbounds._northEast;
        var b = [];
        if (!lbounds.contains(lcenter)) {
            b[0] = KG.Bounds.create({
                sw: KG.LonLat.create({
                    lon: -179.9999,
                    lat: sw.lat
                }),
                ne: KG.LonLat.create({
                    lon: sw.lng,
                    lat: ne.lat
                })
            });
            b[1] = KG.Bounds.create({
                sw: KG.LonLat.create({
                    lon: ne.lng,
                    lat: sw.lat
                }),
                ne: KG.LonLat.create({
                    lon: 179.9999,
                    lat: ne.lat
                })
            });
        } else {
            b[0] = KG.Bounds.create({
                sw: KG.LonLat.create({
                    lon: sw.lng,
                    lat: sw.lat
                }),
                ne: KG.LonLat.create({
                    lon: ne.lng,
                    lat: ne.lat
                })
            });
        }
        return b;
    },

    _getBounds: function(fat) {
        var bounds = this.getBoundsA();
        var lcenter = this.map.getCenter();
        var sw, ne;
        sw = bounds[0].sw;
        ne = bounds[0].ne;
        if (bounds[1]) {
            var center = KG.LonLat.create({
                lon: lcenter.lng,
                lat: lcenter.lat
            });
            if (bounds[1].contains(center)) {
                sw = bounds[1].sw;
                ne = bounds[1].ne;
            }
        }

        sw.lat = Math.max(sw.lat - fat, -90);
        sw.lon = Math.max(sw.lon - fat, -179.9999);
        ne.lat = Math.min(ne.lat + fat, 90);
        ne.lon = Math.min(ne.lon + fat, 179.9999);

        var bounds = KG.Bounds.create({
            sw: KG.LonLat.create({
                lon: sw.lon,
                lat: sw.lat
            }),
            ne: KG.LonLat.create({
                lon: ne.lon,
                lat: ne.lat
            })
        });
        return bounds;
    },

    setCenter: function(center, zoom) {
		if(!center){
			return NO;
		}
        if (!zoom) {
            zoom = this.map.getZoom();
        }
        SC.Logger.debug('setting the map center to: Lat:' + center.get('lat') + ' Lon:' + center.get('lon'));
        this.map.setView(new L.LatLng(center.get('lat'), center.get('lon')), zoom);
		return YES;
    },

    addMarker: function(marker, click_target, click_cb) {
        var lmarkerLocation = new L.LatLng(marker.get('lat'), marker.get('lon'));
        var icon = this.noteIcon;
        if (marker.get('featureCount') > 1) {
            icon = this.groupIcon;
        }
        var lmarker = new L.Marker(lmarkerLocation, {
            draggable: false,
            title: marker.get('tooltip'),
            icon: icon
        });
        this.map.addLayer(lmarker);
        lmarker.on('click',
        function() {
            SC.run.begin();
            click_cb.call(click_target, marker);
            SC.run.end();
        });
        marker._native_marker = lmarker;
    },

    reAddMarker: function(marker) {
        if (marker._native_marker) {
            this.map.removeLayer(marker._native_marker);
            this.map.addLayer(marker._native_marker);
        }
    },

    removeMarker: function(marker) {
        if (marker._native_marker) {
            this.map.removeLayer(marker._native_marker);
            marker._native_marker = null;
        }
    },

    addNewNoteMarker: function(popupContent, pos) {
        var lpos;
        if (pos) {
            lpos = new L.LatLng(pos.get('lat'), pos.get('lon'));
        } else {
            lpos = this.map.getCenter();
        }
        var lmarker = new L.Marker(lpos, {
            draggable: true,
            title: "_newNote".loc(),
            icon: this.newNoteIcon
        });
        lmarker.on('dragend',
        function() {
            SC.run.begin();
            KG.statechart.sendAction('notePositionSetAction');
            SC.run.end();
        })
        lmarker.bindPopup(popupContent);
        this.map.addLayer(lmarker);
        lmarker.openPopup();
        var marker = SC.Object.create({
            _native_marker: lmarker,
            isNewNote: YES,
            lon: function() {
				if(SC.none(this._native_marker)){
					return NO;
				}
                return this._native_marker._latlng.lng;
            }.property(),
            lat: function() {
				if(SC.none(this._native_marker)){
					return NO;
				}
                return this._native_marker._latlng.lat;
            }.property()
        });
        return marker;
    },

	disableDraggableMarker: function(marker){
		if(marker && marker._native_marker){
			var nativ = marker._native_marker;
			nativ.options.draggable = false;
			if(nativ.dragging){
				nativ.dragging.disable();
			}
		}
	},

    addHighlightMarker: function(pos) {
        var lpos = new L.LatLng(pos.get('lat'), pos.get('lon'));
        var lmarker = new L.Marker(lpos, {
            draggable: false,
            icon: this.hlNoteIcon
        });
        var marker = SC.Object.create({
            _native_marker: lmarker,
            lon: function() {
                return this._native_marker._latlng.lng;
            }.property(),
            lat: function() {
                return this._native_marker._latlng.lat;
            }.property()
        });
        this.map.addLayer(lmarker);
        return marker;
    },

    addWMSLayer: function(layer) {
        var wms = new L.TileLayer.WMS(layer.get('url'), {
            layers: layer.get('name'),
            transparent: YES,
            format: 'image/png',
            kg_layer: layer.get('id'),
            kg_sandbox: KG.get('activeSandboxKey')
        });
        layer._native_layer = wms;
        this.map.addLayer(wms);
        //	this.layerControl.addOverlay(wms, layer.get('label'));
    },

    mapSizeDidChange: function(center) {
        this.map.invalidateSize();
        if (center) {
            this.map.setView(new L.LatLng(center.get('lat'), center.get('lon')), this.map.getZoom());
        }
    },

    showPopupMarker: function(marker, content) {
        var popup = this._popupMarker;
        popup.setLatLng(new L.LatLng(marker.get('lat'), marker.get('lon')));
        popup.setContent(content);
        if (!popup._opened) {
            this.map.openPopup(popup);
        }
        setTimeout(function() {
            popup._update();
            //to secure the update, re-do it even later
            setTimeout(function() {
                popup._update()
            },
            100);
        },
        1);
    },

    closePopup: function() {
        this.map.closePopup();
    },

    showPopupInfo: function(latLon, content) {
        var popup = this._popupInfo;
        popup.setLatLng(new L.LatLng(latLon.get('lat'), latLon.get('lon')));
        popup.setContent(content);
        this.map.openPopup(popup);
        setTimeout(function() {
            popup._update();
            //to secure the update, re-do it even later
            setTimeout(function() {
                popup._update()
            },
            100);
        },
        1);
    },

    updatePopupInfo: function() {
        if (this._popupInfo) {
            this._popupInfo._updateLayout();
            this._popupInfo._updatePosition();
            this._popupInfo._adjustPan();
        }
    },

    addHighlight: function(coords, geo_type) {
        if (!coords) {
            return NO;
        }
        var options = {
            color: '#0033ff',
            weight: 5,
            opacity: 0.5,
            fillColor: null,
            //same as color by default
            fillOpacity: 0.2,
            clickable: false
        };
        var layer = this.createLayerFromCoordinates(coords, geo_type, options);
        this.map.addLayer(layer);
        return SC.Object.create({
            coords: coords,
            geo_type: geo_type,
            _native_hl: layer
        });
    },

    removeHighlight: function(hl) {
        if (hl && hl._native_hl) {
            this.map.removeLayer(hl._native_hl);
            return YES;
        }
        return NO;
    },

    createLayerFromCoordinates: function(coordinates, geo_type, options) {
        var layer;
        if (geo_type) {
            geo_type = geo_type.toLowerCase();
        } else {
            geo_type = 'point';
        }
		//TODO Better support for multigeo
        if (geo_type === 'point' || geo_type === 'multipoint') {
            var circleLocation = new L.LatLng(coordinates[0].y, coordinates[0].x);
            //8 pixels radius circle
            options.radius = 7;
            options.weight = 2;
            options.fill = YES;
            layer = new L.CircleMarker(circleLocation, options);
        } else if (geo_type === 'linestring' || geo_type === 'multilinestring') {
            var latlngs = [];
            coordinates.forEach(function(c) {
                var coord = new L.LatLng(c.y, c.x);
                latlngs.push(coord);
            });
            layer = new L.Polyline(latlngs, options);
        } else if (geo_type === 'polygon' || geo_type === 'multipolygon') {
            var latlngs = [];
            coordinates.forEach(function(c) {
                var coord = new L.LatLng(c.y, c.x);
                latlngs.push(coord);
            });
            layer = new L.Polygon(latlngs, options);
        }
        return layer;
    },

    _temp: null,
    _temp2: null,
    printBoundsA: function() {
        if (!SC.none(this._temp)) {
            this.map.removeLayer(this._temp);
        }
        if (!SC.none(this._temp2)) {
            this.map.removeLayer(this._temp2);
        }
        console.log(this.map.getBounds());
        var bounds = this.getBoundsA()[0];
        var sw = bounds.sw;
        var ne = bounds.ne;
        var p1 = new L.LatLng(sw.lat, sw.lon);
        var p2 = new L.LatLng(ne.lat, sw.lon);
        var p3 = new L.LatLng(ne.lat, ne.lon);
        var p4 = new L.LatLng(sw.lat, ne.lon);
        var pts = [p1, p2, p3, p4];
        this._temp = new L.Polygon(pts);
        this.map.addLayer(this._temp);
        bounds = this.getBoundsA()[1];
        if (bounds) {
            sw = bounds.sw;
            ne = bounds.ne;
            p1 = new L.LatLng(sw.lat, sw.lon);
            p2 = new L.LatLng(ne.lat, sw.lon);
            p3 = new L.LatLng(ne.lat, ne.lon);
            p4 = new L.LatLng(sw.lat, ne.lon);
            pts = [p1, p2, p3, p4];
            this._temp2 = new L.Polygon(pts, {
                color: 'red'
            });
            this.map.addLayer(this._temp2);
        }
        return this.getBoundsA();
    },

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
    }

});

/*var osmURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var at = 'OSM';
var layer = new L.TileLayer(osmURL, {
    maxZoom: 20,
    attribution: at
});
*/

//USA States test WMS
/*var nexrad = new L.TileLayer.WMS("http://suite.opengeo.org/geoserver/usa/wms", {
        layers: 'usa:states',
        format: 'image/png',
        transparent: true
    });


map.addLayer(nexrad);
*/

