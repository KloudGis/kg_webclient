/**
* Search count result. Category with result count.
**/
KG.SearchCategory = KG.Record.extend({

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
		var query = KG.SEARCH_RESULT_FEATURE_QUERY;
		if(this.get('categoryLabel') === '_notes_'){
			query = KG.SEARCH_RESULT_NOTE_QUERY;
		}
		query.category = this.get('id');
		query.search = this.get('search');
        return KG.store.find(query);
    }.property()
});
