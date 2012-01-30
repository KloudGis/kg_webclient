/**
* Search count result. Category with result count.
**/
KG.SearchCategory = KG.Record.extend({

    categoryLabel: SC.Record.attr(String),
    count: SC.Record.attr(Number),
    search: SC.Record.attr(String),

    title: function() {
        var cat = this.get('categoryLabel');
        if (!SC.none(cat)) {
            if (cat.charAt(0) === '_') {
                return cat.loc();
            } else {
                return cat;
            }
        }
    }.property('categoryLabel'),

    records: function() {
        return this.findRecords(0);
    }.property(),

    findRecords: function(start) {
        var query = KG.SEARCH_RESULT_FEATURE_QUERY;
        if (this.get('categoryLabel') === '_notes_') {
            query = KG.SEARCH_RESULT_NOTE_QUERY;
        }
        query.start = start || 0;
        query.category = this.get('id');
        query.search = this.get('search');
        query.blockRequestCb = this.blockReceivedCallback;
        query.blockRequestTarget = this;
        query.incrementProperty('version');
        return KG.store.find(query);
    },

    queryBlock: null,

    blockReceivedCallback: function(block, version) {
        if (version === KG.SEARCH_RESULT_FEATURE_QUERY.get('version')) {
            this.set('queryBlock', Ember.Object.create({
                start: block.start,
                max: block.max,
                resultSize: block.resultSize
            }));
        }
    }
});
