KG.Feature = KG.Record.extend({

    fid: SC.Record.attr(Number),
    featuretype: SC.Record.attr(String),
    date: SC.Record.attr(Number),
    geo_type: SC.Record.attr(String),
    coords: SC.Record.attr(Array),
    attrs: SC.Record.attr(Object),
	title_attr: SC.Record.attr(String),

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

	title: function() {
		var attrs = this.get('attrs');
        return attrs[this.get('title_attr')];
    }.property('title_column'),


	/*
	//get all properties from an object
	for(var key in attrs){
	      console.log(key);
	}
	*/
});
