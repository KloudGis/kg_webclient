/**
* Similar to Space FeatureType
**/
KG.Featuretype = KG.Record.extend({

    label: SC.Record.attr(String),
    title_attribute: SC.Record.attr(String),

    attrtypes: SC.Record.toMany('KG.Attrtype', {
        inverse: 'featuretype',
        isMaster: NO
    }),

    geometry_type: SC.Record.attr(String),

    getDefaultGeoFromPoint: function(lon, lat) {
        var gtype = this.get('geometry_type');
        if (gtype) {
            var gt = gtype.toLowerCase();
            if (gt === 'point') {
                return {
                    coords: [{
                        x: lon,
                        y: lat
                    }],
                    centroid: {
                        x: lon,
                        y: lat
                    },
                    geo_type: 'Point'
                };
            } else {
				var offset = 0.5;
				if(KG.core_leaflet){
					//50 pixels offset
					offset = KG.core_leaflet.pixelsToWorld(50);
				}
                if (gt === 'linestring') {
                    var c1 = {
                        x: lon,
                        y: lat
                    };
                    var c2 = {
                        x: lon + offset,
                        y: lat + offset
                    };
                    return {
                        coords: [c1, c2],
                        centroid: {
                            x: lon,
                            y: lat
                        },
                        geo_type: 'LineString'
                    };
                }
            }
        }
    }
});
