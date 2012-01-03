/**
*  Generic Comment
**/
KG.Comment = KG.Record.extend({
	
	comment: SC.Record.attr(String),
	author: SC.Record.attr(Number),
	author_descriptor: SC.Record.attr(String)
});