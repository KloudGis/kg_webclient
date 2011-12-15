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
    addToDocument: function(lon, lat, zoom) {

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

        var baseLayer;
        var key = 'Anvn3DMhTFsggcirvNz1TNQrxCzksEg-b47gtD7AO1iOzZicEiF2mFZoleYMkX8z';
        baseLayer = new L.BingLayer(key);

        /*        var osmURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		var at = 'OSM';
		baseLayer = new L.TileLayer(osmURL, {
		    maxZoom: 20,
		    attribution: at
		});
		*/

        /*	var key = '8ccaf9c293f247d6b18a30fce375e298';
        var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/' + key + '/997/256/{z}/{x}/{y}.png',
        cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
        baseLayer = new L.TileLayer(cloudmadeUrl, {
            maxZoom: 18,
            attribution: cloudmadeAttribution
        });
   *?
        /*var mapquestUrl = 'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
        mapquestAttribution = "Data CC-By-SA by <a href='http://openstreetmap.org/' target='_blank'>OpenStreetMap</a>, Tiles Courtesy of <a href='http://open.mapquest.com' target='_blank'>MapQuest</a>",
        baseLayer = new L.TileLayer(mapquestUrl, {
            maxZoom: 18,
            attribution: mapquestAttribution,
            subdomains: ['1', '2', '3', '4']
        });*/

        // initialize the map on the "map" div
        var map = new L.Map('map', {});
        //default QUEBEC
        lon = lon || -72;
        lat = lat || 46;
        zoom = zoom || 5;
        map.setView(new L.LatLng(lat, lon), zoom).addLayer(baseLayer);
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
        L.DomEvent.addListener(this.map._container, 'mousedown', this._onMouseDown, this);
        L.DomEvent.addListener(this.map._container, 'mouseup', this._onMouseUp, this);
        L.DomEvent.addListener(this.map._container, 'click', this._onMouseClick, this);
    },

    /** store the shift down status to bypass the next click event and therefore do not make a selection on shift drag  zoom **/
    _shiftDown: NO,

    _onMouseDown: function(e) {
        if (!e.shiftKey || ((e.which != 1) && (e.button != 1))) {
            return false;
        }
        this._shiftDown = YES;
    },

    _onMouseUp: function(e) {
        setTimeout(function() {
            KG.core_leaflet._shiftDown = NO;
        },
        300);
    },

    _onMouseClick: function(e) {
        this._shiftDown = NO;
    },

    stopPropagation: function(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
    },

    onZoom: function(e) {
        SC.run.begin();
        KG.statechart.sendAction('mapZoomedAction', this);
        KG.core_sandbox.setCenter(this.getCenter(), this.getZoom());
        SC.run.end();
    },

    onMove: function(e) {
        //  console.log('on Move');
        SC.run.begin();
        KG.statechart.sendAction('mapMovedAction', this);
        KG.core_sandbox.setCenter(this.getCenter(), this.getZoom());
        SC.run.end();
    },

    onClick: function(e) {
        if (this._shiftDown) {
            return NO;
        }
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
        if (!center) {
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
        lmarker.on('dragend',
        function() {
            SC.run.begin();
            KG.statechart.sendAction('markerDragEnded', lmarker._latlng.lng, lmarker._latlng.lat);
            SC.run.end();
        })
        if (!SC.none(marker._native_marker)) {
            var map = this.map;
            var old_native = marker._native_marker;
            //differred to avoid flickering
            setTimeout(function() {
                map.removeLayer(old_native);
            },
            250);
        }
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
            KG.statechart.sendAction('notePositionSetAction', lmarker._latlng.lng, lmarker._latlng.lat);
            SC.run.end();
        })
        lmarker.bindPopup(popupContent);
        this.map.addLayer(lmarker);
        lmarker.openPopup();
        var marker = SC.Object.create({
            _native_marker: lmarker,
            isNewNote: YES,
            lon: function() {
                if (SC.none(this._native_marker)) {
                    return NO;
                }
                return this._native_marker._latlng.lng;
            }.property(),
            lat: function() {
                if (SC.none(this._native_marker)) {
                    return NO;
                }
                return this._native_marker._latlng.lat;
            }.property()
        });
        return marker;
    },

    enableDraggableMarker: function(marker) {
        if (marker && marker._native_marker) {
            var nativ = marker._native_marker;
            nativ.options.draggable = true;
            if (nativ.dragging) {
                nativ.dragging.enable();
            }
        }
    },

    disableDraggableMarker: function(marker) {
        if (marker && marker._native_marker) {
            var nativ = marker._native_marker;
            nativ.options.draggable = false;
            if (nativ.dragging) {
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
		lmarker.on('dragend',
        function() {
            SC.run.begin();
            KG.statechart.sendAction('markerDragEnded', lmarker._latlng.lng, lmarker._latlng.lat);
            SC.run.end();
        })
        this.map.addLayer(lmarker);
        return marker;
    },

    addWMSLayer: function(layer) {
        var wms = new L.TileLayer.WMS(layer.get('url'), {
            layers: layer.get('name'),
            transparent: YES,
            format: 'image/png',
            tiled: YES,
            tilesorigin: '0,0',
            //set to YES to by pass geowebcache
            no_gwc: NO,
            kg_layer: layer.get('id'),
            kg_sandbox: KG.get('activeSandboxKey'),
            auth_token: KG.core_auth.get('authenticationToken')
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
        this.updatePopupMarkerPosition(marker.get('lon'), marker.get('lat'));
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

    updatePopupMarkerPosition: function(lon, lat) {
        var popup = this._popupMarker;
        popup.setLatLng(new L.LatLng(lat, lon));
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

    addHighlight: function(geo) {
        if (!geo) {
            return NO;
        }
        var coords = geo.coords;
        var geo_type = geo.geo_type;
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
    },

    removeShadow: function(marker) {
        if (marker._native_marker && marker._native_marker._shadow) {
            marker._native_marker._map._panes.shadowPane.removeChild(marker._native_marker._shadow);
			marker._native_marker._shadow = undefined;
        }
    }
});

//***********************************
// From a pull request not yet integrated
// https://github.com/CloudMade/Leaflet/pull/291
// to remove when included in Leaflet
L.BingLayer = L.TileLayer.extend({
    options: {
        subdomains: [0, 1, 2, 3],
        attribution: 'Bing',
    },

    initialize: function(key, options) {
        L.Util.setOptions(this, options);

        this._key = key;
        this._url = null;
        this.meta = {};
        this._update_tile = this._update;
        this._update = function() {
            if (this._url == null) return;
            this._update_attribution();
            this._update_tile();
        };
        this.loadMetadata();
    },

    tile2quad: function(x, y, z) {
        var quad = '';
        for (var i = z; i > 0; i--) {
            var digit = 0;
            var mask = 1 << (i - 1);
            if ((x & mask) != 0) digit += 1;
            if ((y & mask) != 0) digit += 2;
            quad = quad + digit;
        }
        return quad;
    },

    getTileUrl: function(p, z) {
        var subdomains = this.options.subdomains,
        s = this.options.subdomains[(p.x + p.y) % subdomains.length];
        return this._url.replace('{subdomain}', s).replace('{quadkey}', this.tile2quad(p.x, p.y, z)).replace('{culture}', '');
    },

    loadMetadata: function() {
        var _this = this;
        var cbid = '_bing_metadata';
        window[cbid] = function(meta) {
            _this.meta = meta;
            window[cbid] = undefined;
            var e = document.getElementById(cbid);
            e.parentNode.removeChild(e);
            if (meta.errorDetails) {
                alert("Got metadata" + meta.errorDetails);
                return;
            }
            _this.initMetadata();
        };
        //AerialWithLabels,Aerial or Road
        var url = "http://dev.virtualearth.net/REST/v1/Imagery/Metadata/Road?include=ImageryProviders&jsonp=" + cbid + "&key=" + this._key;
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.id = cbid;
        document.getElementsByTagName("head")[0].appendChild(script);
    },

    initMetadata: function() {
        var r = this.meta.resourceSets[0].resources[0];
        this.options.subdomains = r.imageUrlSubdomains;
        this._url = r.imageUrl;
        this._providers = [];
        for (var i = 0; i < r.imageryProviders.length; i++) {
            var p = r.imageryProviders[i];
            for (var j = 0; j < p.coverageAreas.length; j++) {
                var c = p.coverageAreas[j];
                var coverage = {
                    zoomMin: c.zoomMin,
                    zoomMax: c.zoomMax,
                    active: false
                };
                var bounds = new L.LatLngBounds(
                new L.LatLng(c.bbox[0] + 0.01, c.bbox[1] + 0.01), new L.LatLng(c.bbox[2] - 0.01, c.bbox[3] - 0.01));
                coverage.bounds = bounds;
                coverage.attrib = p.attribution;
                this._providers.push(coverage);
            }
        }
        this._update();
    },

    _update_attribution: function() {
        var bounds = this._map.getBounds();
        var zoom = this._map.getZoom();
        for (var i = 0; i < this._providers.length; i++) {
            var p = this._providers[i];
            if ((zoom <= p.zoomMax && zoom >= p.zoomMin) && this._intersects(bounds, p.bounds)) {
                if (!p.active) this._map.attributionControl.addAttribution(p.attrib);
                p.active = true;
            } else {
                if (p.active) this._map.attributionControl.removeAttribution(p.attrib);
                p.active = false;
            }
        }
    },

    _intersects: function(obj1, obj2)
    /*-> Boolean*/
    {
        var sw = obj1.getSouthWest(),
        ne = obj1.getNorthEast(),
        sw2 = obj2.getSouthWest(),
        ne2 = obj2.getNorthEast();

        return (sw2.lat <= ne.lat) && (sw2.lng <= ne.lng) && (sw.lat <= ne2.lat) && (sw.lng <= ne2.lng);
    }
});
