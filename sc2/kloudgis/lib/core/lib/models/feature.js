KG.Feature = KG.Record.extend({

    fid: SC.Record.attr(Number),
    featuretype: SC.Record.attr(String),
    date: SC.Record.attr(Number),
    geo_type: SC.Record.attr(String),
    coords: SC.Record.attr(Array),
    attrs: SC.Record.attr(Array),

    center: function() {
        if (this.get('geo_type') === "Point") {
            var coords = this.get('coords');
           	return KG.LonLat.create({
                lon: coords[0].x,
                lat: coords[0].y
            });
        }
		return NO;
    }.property('coords'),

	summary: function() {
        return "_featureSummary".loc(this.get('fid'));
    }.property('fid'),
});
