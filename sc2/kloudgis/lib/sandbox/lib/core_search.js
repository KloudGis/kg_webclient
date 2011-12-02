/**
* Core functions to perform searches
**/
KG.core_search = SC.Object.create({

    plugins: [],
	searchAsked: NO,

    addPlugin: function(plugin) {
        this.plugins.pushObject(plugin);
    },

    searchFeatures: function() {
        var search = KG.searchController.get('searchValue');
        var content = KG.searchController.get('content');
        var store = KG.store;
        if (content && content.destroy) {
            content.forEach(function(cat) {
                store.unloadRecord(KG.SearchCategory, cat.get('id'), cat.get('storeKey'))
            });
            content.destroy();
        }
        console.log('search for:' + search);
        var query = SC.Query.local(KG.SearchCategory, {
            query_url: KG.get('serverHost') + 'api_data/protected/features/count_search?search_string=%@&sandbox=%@'.fmt(search, KG.get('activeSandboxKey')),
            conditions: 'count > 0 OR count = -1',
            orderBy: 'categoryLabel'
        });
        var records = store.find(query);
        KG.searchController.set('content', records);
        this.plugins.forEach(function(plugin) {
            plugin.set('searchValue', search);
        });
		this.set('searchAsked', YES);
    },

    clearSearchFeatures: function() {
        KG.searchController.set('searchValue', '');
        var content = KG.searchController.get('content');
        var store = KG.store;
        if (content && content.destroy) {
            content.forEach(function(cat) {
                store.unloadRecord(KG.SearchCategory, cat.get('id'), cat.get('storeKey'))
            });
            content.destroy();
        }
        KG.searchController.set('content', []);
		this.set('searchAsked', NO);
    },

    showResults: function() {
        KG.searchResultsController.set('listVisible', YES);
        var cat = KG.searchResultsController.get('category');
        if (SC.none(cat)) {
            var plugin = KG.searchResultsController.get('plugin');
            if (!SC.none(plugin)) {
                plugin.loadRecords(null, function(records) {
                    KG.searchResultsController.set('content', records);
                });
            }
        } else {
            var records = cat.get('records');
            KG.searchResultsController.set('content', records);
        }
    },

    hideResults: function() {
        KG.searchResultsController.set('listVisible', NO);
        setTimeout(function() {
            var content = KG.searchResultsController.get('content');
            if (content && content.destroy) {
                content.destroy();
            }
            KG.searchResultsController.set('category', null);
            KG.searchResultsController.set('content', []);
            //hide bottom list too.
            KG.core_search.clearSearchFeatures();
        },
        600);
    }
});
