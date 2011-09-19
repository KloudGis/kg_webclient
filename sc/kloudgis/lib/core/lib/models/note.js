KG.Note = KG.Record.extend({
	
	featuretype: 'note',
	title: SC.Record.attr(String),
	description: SC.Record.attr(String),
	author: SC.Record.attr(String),
	date: SC.Record.attr(Date)
});