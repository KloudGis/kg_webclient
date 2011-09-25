KG.Feature = KG.Record.extend({
	
	fid: SC.Record.attr(Number),
	featuretype: SC.Record.attr(String),
	date: SC.Record.attr(Number),
	geo_type: SC.Record.attr(String),
	coords: SC.Record.attr(Array),
	attrs: SC.Record.attr(Array)
});