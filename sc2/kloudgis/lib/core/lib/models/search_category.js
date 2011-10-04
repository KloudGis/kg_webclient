KG.SearchCategory = KG.Record.extend({

    category: SC.Record.attr(String),
    categoryLabel: SC.Record.attr(String),
    count: SC.Record.attr(Number),
	search: SC.Record.attr(String),
	loaded_records: SC.Record.attr(Array),

    title: function() {
        return '%@ (%@)'.fmt(this.get('categoryLabel'), this.get('count'));
    }.property('category', 'count'),

    records: function() {
		if(!SC.none(this.get('loaded_records'))){
			return this.get('loaded_records');
		}
        var query = SC.Query.remote(KG.Feature, {
            query_url: '/api_data/protected/%@/search?search_string=%@&sandbox=%@'.fmt(this.get('category'), this.get('search'), KG.get('activeSandboxKey')),
            conditions: 'count > 0'
        });
        return KG.store.find(query);
    }.property(),

});
