// ==========================================================================
// Project:   Auth.Store
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Auth */

/** @class

  (Document Your Data Source Here)

  @extends SC.DataSource
*/
sc_require('models/user')

Auth.QUERY = SC.Query.remote('Auth.User');

Auth.Store = SC.DataSource.extend(
/** @scope Auth.Store.prototype */
{

    // ..........................................................
    // QUERY SUPPORT
    // 
    fetch: function(store, query) {
        if (query === Auth.QUERY) {
            // setup sparse array with self as delegate
            store.loadQueryResults(query, SC.SparseArray.create({
                delegate: this,
                store: store,
                query: query,
				rangeWindowSize: 50,
            }));
        }
    },

    // since the length is always set whenever we load records, just load the
    // first 20 records anyway.  
    sparseArrayDidRequestLength: function(sparseArray) {
        return this.sparseArrayDidRequestRange(sparseArray, {
            start: 0,
            length: 50
        }, YES);
    },


    sparseArrayDidRequestRange: function(sparseArray, range, len) {
        var url = "/kloudgis/public/test?start=" + range.start + "&length=" + range.length;
        SC.Request.getUrl(url).set('isJSON', YES).notify(this, this._didFetchCustomers, {
            array: sparseArray,
            start: range.start,
            length: range.length,
			forLen: len
        }).send();
    },

    _didFetchCustomers: function(response, params) {
        var sparseArray = params.array,
        start = params.start,
        length = params.length;

        if (SC.$ok(response)) {
            var count = response.count;
			var rec = response.get('body').records;
			count = response.get('body').count;
            var storeKeys = sparseArray.get('store').loadRecords(Auth.User, rec);
			//sparseArray._kvo_cache = null;		
            sparseArray.provideObjectsInRange({
                start: start,
                length: length
            },
            storeKeys);
			if(params.forLen){
            	sparseArray.provideLength(count);
			}
            sparseArray.rangeRequestCompleted(start);	
        }
    },

    // ..........................................................
    // RECORD SUPPORT
    // 
    retrieveRecord: function(store, storeKey) {

        // TODO: Add handlers to retrieve an individual record's contents
        // call store.dataSourceDidComplete(storeKey) when done.
        return NO; // return YES if you handled the storeKey
    },

    createRecord: function(store, storeKey) {

        // TODO: Add handlers to submit new records to the data source.
        // call store.dataSourceDidComplete(storeKey) when done.
        return NO; // return YES if you handled the storeKey
    },

    updateRecord: function(store, storeKey) {

        // TODO: Add handlers to submit modified record to the data source
        // call store.dataSourceDidComplete(storeKey) when done.
        return NO; // return YES if you handled the storeKey
    },

    destroyRecord: function(store, storeKey) {

        // TODO: Add handlers to destroy records on the data source.
        // call store.dataSourceDidDestroy(storeKey) when done
        return NO; // return YES if you handled the storeKey
    }

});
