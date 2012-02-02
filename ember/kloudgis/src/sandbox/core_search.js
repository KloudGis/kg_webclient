// javascript:/***%20Core%20functions%20to%20perform%20searches**/KG.core_search%20=%20SC.Object.create({plugins:%20[],searchAsked:%20NO,_view:%20null,addPlugin:%20function(plugin)%20{this.plugins.pushObject(plugin);},searchFeatures:%20function()%20{var%20search%20=%20KG.searchController.get(%27searchValue%27);var%20content%20=%20KG.searchController.get(%27content%27);var%20store%20=%20KG.store;if%20(content%20&&%20content.destroy)%20{content.forEach(function(cat)%20{store.unloadRecord(KG.SearchCategory,%20cat.get(%27id%27),%20cat.get(%27storeKey%27))});content.destroy();}console.log(%27search%20for:%27%20+%20search);KG.SEARCH_QUERY.search%20=%20search;var%20records%20=%20store.find(KG.SEARCH_QUERY);KG.searchController.set(%27content%27,%20records);this.plugins.forEach(function(plugin)%20{plugin.set(%27searchValue%27,%20search);});this.set(%27searchAsked%27,%20YES);},clearSearchFeatures:%20function()%20{KG.searchController.set(%27searchValue%27,%20%27%27);var%20content%20=%20KG.searchController.get(%27content%27);var%20store%20=%20KG.store;if%20(content%20&&%20content.destroy)%20{content.forEach(function(cat)%20{store.unloadRecord(KG.SearchCategory,%20cat.get(%27id%27),%20cat.get(%27storeKey%27))});content.destroy();}KG.searchController.set(%27content%27,%20[]);this.set(%27searchAsked%27,%20NO);},showResults:%20function()%20{var%20actualContent%20=%20KG.searchResultsController.get(%27content%27);if(actualContent%20&&%20actualContent.destroy){actualContent.destroy();}KG.searchResultsController.set(%27listVisible%27,%20YES);var%20cat%20=%20KG.searchResultsController.get(%27category%27);if%20(SC.none(cat))%20{var%20plugin%20=%20KG.searchResultsController.get(%27plugin%27);KG.searchResultsController.set(%27content%27,%20null);if%20(!SC.none(plugin))%20{plugin.loadRecords(null,%20function(records)%20{KG.searchResultsController.set(%27content%27,%20records);});}}%20else%20{var%20records%20=%20cat.findRecords(KG.searchResultsController.get(%27nextBlockStart%27));if(records.onReady){records.onReady(null,%20function(){KG.searchResultsController.set(%27content%27,%20array);});}KG.searchResultsController.set(%27content%27,%20records);}},showMoreResults:%20function(){var%20cat%20=%20KG.searchResultsController.get(%27category%27);if(cat){var%20records%20=%20cat.findRecords(KG.searchResultsController.get(%27nextBlockStart%27));}},hideResults:%20function()%20{KG.searchResultsController.set(%27listVisible%27,%20NO);setTimeout(function()%20{var%20content%20=%20KG.searchResultsController.get(%27content%27);if%20(content%20&&%20content.destroy)%20{content.destroy();}KG.searchResultsController.set(%27category%27,%20null);KG.searchResultsController.set(%27content%27,%20[]);KG.core_search.clearSearchFeatures();},800);}});$(document).ready(function()%20{setTimeout(function()%20{KG.core_search._view%20=%20Ember.View.create({templateName:%20%27search-panel%27});KG.core_search._view.appendTo(%27#main-sandbox-view%27);},1000);});
/**
* Core functions to perform searches
**/
KG.core_search = SC.Object.create({

    plugins: [],
    searchAsked: NO,

    //the search panel view
    _view: null,

    createView: function() {
        if (!this._view) {
			var self = this;
            setTimeout(function() {
                self._view = Ember.View.create({
                    templateName: 'search-panel'
                });
                self._view.appendTo('#main-sandbox-view');
            },
            1000);
        }
    },

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
        KG.SEARCH_QUERY.search = search;
        var records = store.find(KG.SEARCH_QUERY);
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
        //reset cursor
        if (KG.searchResultsController.get('category')) {
            KG.searchResultsController.setPath('category.queryBlock', null);
        }
        //clear the record array -  If not cleared, the query will return the cached result
        var actualContent = KG.searchResultsController.get('content');
        if (actualContent && actualContent.destroy) {
            actualContent.destroy();
        }
        KG.searchResultsController.set('content', []);
        KG.searchResultsController.set('listVisible', YES);
        var cat = KG.searchResultsController.get('category');
        if (SC.none(cat)) {
            var plugin = KG.searchResultsController.get('plugin');
            KG.searchResultsController.set('content', null);
            if (!SC.none(plugin)) {
                plugin.loadRecords(null,
                function(records) {
                    KG.searchResultsController.set('content', records);
                });
            }
        } else {
            var records = cat.findRecords(KG.searchResultsController.get('nextBlockStart'));
            if (records.onReady) {
                records.onReady(this, this._addResults);
            }
        }
    },

    showMoreResults: function() {
        var cat = KG.searchResultsController.get('category');
        if (cat) {
            var records = cat.findRecords(KG.searchResultsController.get('nextBlockStart'));
            if (records.onReady) {
                records.onReady(this, this._addResults);
            }
        }
    },

    _addResults: function(records) {
        var array = KG.searchResultsController.get('content');
        records.forEach(function(rec) {
            array.pushObject(rec);
        });
        KG.searchResultsController.set('content', array);
        records.destroy();
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
        800);
    }
});
