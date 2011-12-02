/**
* Search count result. Category with result count.
**/
KG.SearchCategory = KG.Record.extend({

    category: SC.Record.attr(String),
    categoryLabel: SC.Record.attr(String),
    count: SC.Record.attr(Number),
	search: SC.Record.attr(String),

    title: function() {
    	var cat = this.get('categoryLabel');
		if(!SC.none(cat)){
			if(cat.charAt(0) === '_'){
				return cat.loc();
			}else{
				return cat;
			}
		}
    }.property('categoryLabel'),

    records: function() {
		var recordType = KG.Feature;
		if(this.get('category') === '_notes_'){
			recordType = KG.Note;
		}
        var query = SC.Query.remote(recordType, {
            query_url: KG.get('serverHost') + 'api_data/protected/features/search?category=%@&search_string=%@&sandbox=%@'.fmt(this.get('category'), this.get('search'), KG.get('activeSandboxKey')),
            conditions: 'count > 0'
        });
        return KG.store.find(query);
    }.property(),

});
