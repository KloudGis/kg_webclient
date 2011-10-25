/**
* Comment for a Note.
**/
KG.Comment = KG.Record.extend({
	
	value: SC.Record.attr(String),
	author: SC.Record.attr(Number),
	author_descriptor: SC.Record.attr(String),
	date: SC.Record.attr(Number),
	note: SC.Record.toOne('KG.Note', {inverse: 'comments', isMaster: YES}),
	
	formattedDate: function(){
		var date = this.getPath('date');
        if (date) {
            var d = new Date(date);
            var curr_day = d.getDate();
            var curr_month = d.getMonth() + 1; //months are zero based
            var curr_year = d.getFullYear();
			var curr_hour = d.getHours();
			if(curr_hour < 10){
				curr_hour = '0' + curr_hour;
			}
			var curr_min = d.getMinutes();
			if(curr_min < 10){
				curr_min = '0' + curr_min;
			}
            return "_commentDateFormat".loc(curr_year, curr_month, curr_day, curr_hour, curr_min);
        }
	}.property('date')
});