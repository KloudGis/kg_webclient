/**
* Sandbox record class.
**/
KG.Sandbox = KG.Record.extend({

	name: SC.Record.attr(String),
	key: SC.Record.attr(String),
	date: SC.Record.attr(Number),
	
	formattedDate: function() {
        var date = this.get('date');
        if (date) {
            var d = new Date(date);
            var curr_day = d.getDate();
            var curr_month = d.getMonth() + 1; //months are zero based
            var curr_year = d.getFullYear();
            return "_sbDateFormat".loc(curr_year, curr_month, curr_day);
        }
        return '';
    }.property('date'),
});