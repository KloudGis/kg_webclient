KG.Comment = KG.Record.extend({
	
	value: SC.Record.attr(String),
	author: SC.Record.attr(Number),
	author_descriptor: SC.Record.attr(String),
	date: SC.Record.attr(Number),
	note: SC.Record.toOne('KG.Note', {inverse: 'comments', isMaster: YES}),
	
	formatted_date: function(){
		var date = this.getPath('date');
        if (date) {
            var d = new Date(date);
            var curr_day = d.getDate();
            var curr_month = d.getMonth() + 1; //months are zero based
            var curr_year = d.getFullYear();
            return curr_day + "/" + curr_month + "/" + curr_year;
        }
	}.property('date')
});