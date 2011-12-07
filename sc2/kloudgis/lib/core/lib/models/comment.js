/**
* Comment for a Note.
**/
KG.Comment = KG.Record.extend({
	
	comment: SC.Record.attr(String),
	author: SC.Record.attr(Number),
	author_descriptor: SC.Record.attr(String),
	date_create: SC.Record.attr(Number),
	note: SC.Record.toOne('KG.Note', {inverse: 'comments', isMaster: YES}),
	
	formattedDate: function(){
		var date = this.getPath('date_create');
        if (date) {
            return KG.core_date.formatDate(date);
        }
	}.property('date_create')
});