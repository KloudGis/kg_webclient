require('./attribute');
require('./lon_lat');
require('./record');
/**
* The Feature class with the feature id (fid), featuretype (ft), attributes (attrs), ...
**/
KG.Feature = KG.Record.extend({

    fid: SC.Record.attr(Number),
    ft: SC.Record.attr(String),
    date: SC.Record.attr(Number),
    geo_type: SC.Record.attr(String),
    coords: SC.Record.attr(Array),
    attrs: SC.Record.attr(Object),
    title_attr: SC.Record.attr(String),
    centroid: SC.Record.attr(Object),

    isSelectable: YES,
    isInspectorSelectable: YES,

    center: function() {
        var center;
        var centroid = this.get('centroid');
        if (!SC.none(centroid)) {
            center = centroid;
        } else {
            var coords = this.get('coords');
            if (!SC.none(coords) && coords.length > 0) {
                center = coords[0];
            }
        }
        if (!SC.none(center)) {
            return KG.LonLat.create({
                lon: center.x,
                lat: center.y
            });
        }
        return NO;
    }.property('coords', 'centroid'),

    title: function() {
        var attrs = this.get('attrs');
        return attrs[this.get('title_attr')];
    }.property('title_column'),

    getClosestCoord: function(coord) {
        var coords = this.get('coords');
        if (!SC.none(coords) && coords.length > 0) {
            if (!coord) {
                return coords[0];
            }
            var inLonLat = KG.LonLat.create({
                lon: coord.x,
                lat: coord.y
            });
            var len = coords.length,
            i, dist, closest;
            for (i = 0; i < len; i++) {
                var lonLat = KG.LonLat.create({
                    lon: coords[i].x,
                    lat: coords[i].y
                });
                var d = lonLat.distance(inLonLat);
                if (!dist || d < dist) {
                    dist = d;
                    closest = lonLat;
                }
            }
            return closest;
        }
        return NO;
    },

    getAttributes: function() {
        var ret = [];
        var attrs = this.get('attrs');
        if (!SC.none(attrs)) {
            for (var key in attrs) {
                var at = KG.Attribute.create({
                    name: key,
                    value: attrs[key]
                });
                ret.pushObject(at);
            }
        }
        return ret;
    }
});
