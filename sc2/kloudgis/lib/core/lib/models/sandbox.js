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
            return KG.core_date.formatDate(date);
        }
        return '';
    }.property('date')
});