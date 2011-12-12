require('./record');
/**
*  Similar to space AttrType
**/
KG.Bookmark = KG.Record.extend({
	
	label: SC.Record.attr(String),
	user_create: SC.Record.attr(Number),
	user_descriptor: SC.Record.attr(String),
	center: SC.Record.attr(Object),
	zoom:  SC.Record.attr(Number)
});