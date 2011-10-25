/**
* Core functions to perform searches
**/
KG.core_search = SC.Object.create({

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
            query_url: '/api_data/protected/features/count_search?search_string=%@&sandbox=%@'.fmt(search, KG.get('activeSandboxKey')),
            conditions: 'count > 0'
        });
        var records = store.find(query);
        KG.searchController.set('content', records);
        this.loadGoogleResults(search);
    },

    loadGoogleResults: function(search) {
        $.ajax({
            type: 'GET',
            url: '/maps/api/geocode/json?address=%@&sensor=true'.fmt(search),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            context: this,
            error: function(jqXHR, textStatus, errorThrown) {
                SC.Logger.error('Google error: HTTP error status code: ' + jqXHR.status);
            },
            success: function(data, textStatus, jqXHR) {
                console.log('Google success.');
                if (data && data.results && data.results.length > 0) {
                    var results = data.results,
                    i, records = [];
                    for (i = 0; i < results.length; i++) {
                        var geo = {
                            x: results[i].geometry.location.lng,
                            y: results[i].geometry.location.lat
                        };
                        var lonLat = KG.LonLat.create({
                            lon: geo.x,
                            lat: geo.y
                        });
                        records.pushObject(SC.Object.create({
                            title: results[i].formatted_address,
                            coords: [geo],
                            center: lonLat,
							hasCreateNote: YES
                        }));
                    }
                    KG.store.loadRecord(KG.SearchCategory, {
                        category: '*Google*',
                        categoryLabel: 'Google',
                        count: data.results.length,
                        loaded_records: records,
                        search: search
                    },
                    900913);
                }
            },
            async: YES
        });
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
    },

    showResults: function() {
        KG.searchResultsController.set('listVisible', YES);
		var cat = KG.searchResultsController.get('category');
        var records = cat.get('records');
        KG.searchResultsController.set('content', records);
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
