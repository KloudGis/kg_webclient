require('./record');
require('./lon_lat');
require('./featuretype');
require('./attribute');
/**
* The Feature class with the feature id (fid), featuretype (ft), attributes (attrs), ...
**/
KG.Feature = KG.Record.extend({

    fid: SC.Record.attr(Number),
    ft_id: SC.Record.attr(Number),
    date_create: SC.Record.attr(Number),
    user_create: SC.Record.attr(Number),
    date_update: SC.Record.attr(Number),
    user_update: SC.Record.attr(Number),

    joins: SC.Record.toMany('KG.Feature', {
        inverse: 'reverse_joins',
        isMaster: YES
    }),
    reverse_joins: SC.Record.toMany('KG.Feature', {
        inverse: 'joins',
        isMaster: NO
    }),
    //object (contains coords, centroid, geo_type, ...)
    geo: SC.Record.attr(Object),
    //25 text
    text1: SC.Record.attr(String),
    text2: SC.Record.attr(String),
    text3: SC.Record.attr(String),
    text4: SC.Record.attr(String),
    text5: SC.Record.attr(String),
    text6: SC.Record.attr(String),
    text7: SC.Record.attr(String),
    text8: SC.Record.attr(String),
    text9: SC.Record.attr(String),
    text10: SC.Record.attr(String),
    text11: SC.Record.attr(String),
    text12: SC.Record.attr(String),
    text13: SC.Record.attr(String),
    text14: SC.Record.attr(String),
    text15: SC.Record.attr(String),
    text16: SC.Record.attr(String),
    text17: SC.Record.attr(String),
    text18: SC.Record.attr(String),
    text19: SC.Record.attr(String),
    text20: SC.Record.attr(String),
    text21: SC.Record.attr(String),
    text22: SC.Record.attr(String),
    text23: SC.Record.attr(String),
    text24: SC.Record.attr(String),
    text25: SC.Record.attr(String),
    //5 bool
    bool1: SC.Record.attr(Boolean),
    bool2: SC.Record.attr(Boolean),
    bool3: SC.Record.attr(Boolean),
    bool4: SC.Record.attr(Boolean),
    bool5: SC.Record.attr(Boolean),
    //3 date (stored as long - Time in millis)
    date1: SC.Record.attr(Number),
    date2: SC.Record.attr(Number),
    date3: SC.Record.attr(Number),
    //10 num
    num1: SC.Record.attr(Number),
    num2: SC.Record.attr(Number),
    num3: SC.Record.attr(Number),
    num4: SC.Record.attr(Number),
    num5: SC.Record.attr(Number),
    num6: SC.Record.attr(Number),
    num7: SC.Record.attr(Number),
    num8: SC.Record.attr(Number),
    num9: SC.Record.attr(Number),
    num10: SC.Record.attr(Number),
    //10 decimal
    decim1: SC.Record.attr(Number),
    decim2: SC.Record.attr(Number),
    decim3: SC.Record.attr(Number),
    decim4: SC.Record.attr(Number),
    decim5: SC.Record.attr(Number),
    decim6: SC.Record.attr(Number),
    decim7: SC.Record.attr(Number),
    decim8: SC.Record.attr(Number),
    decim9: SC.Record.attr(Number),
    decim10: SC.Record.attr(Number),
    //2 image (stored as base64 string)
    img1: SC.Record.attr(String),
    img2: SC.Record.attr(String),

    featuretype: function() {
        var ft_id = this.get('ft_id');
        if (ft_id) {
            return KG.store.find(KG.Featuretype, ft_id);
        }
    }.property('ft_id').cacheable(),

    title: function() {
        var featuretype = this.get('featuretype');
        if (featuretype) {
            var attr = featuretype.get('title_attribute');
            if (attr) {
                return this.get(attr);
            }
        }
        return "?";
    }.property('featuretype'),

	//TODO: Use the featuretype for these
    isSelectable: YES,
    isInspectorSelectable: YES,

    center: function() {
        var center;
        var geo = this.get('geo');
        if (!SC.none(geo)) {
            center = geo.centroid;
        }
        if (!SC.none(center)) {
            return KG.LonLat.create({
                lon: center.x,
                lat: center.y
            });
        }
        return NO;
    }.property('geo'),

    getClosestCoord: function(inCoord) {
        var geo = this.get('geo');
        if (!SC.none(geo)) {
            var coords = geo.coords;
            if (!SC.none(coords) && coords.length > 0) {
                if (!inCoord) {
                    return coords[0];
                }
                var inLonLat = KG.LonLat.create({
                    lon: inCoord.x,
                    lat: inCoord.y
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
        }
    },

    getAttributes: function() {
        var ret = [];
        var ft = this.get('featuretype');
        if (!SC.none(ft)) {
            var attrs = ft.get('attrtypes');
            if (!SC.none(attrs)) {
				var self = this;
                attrs.forEach(function(attrtype) {
                    var wrapper = KG.Attribute.create({
                        feature: self,
                        attrtype: attrtype
                    });
                    ret.push(wrapper);
                });
            }
        }
        return ret;
    }

});
