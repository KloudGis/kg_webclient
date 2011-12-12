/**
* Extend SC.Record.  For the future.
**/
KG.Record = SC.Record.extend({
	
	date_create: SC.Record.attr(Number),
	
	formattedDate: function() {
        var date = this.get('date_create');
        if (date) {
	        return KG.core_date.formatDate(date);
        }
        return '';
    }.property('date_create')
});