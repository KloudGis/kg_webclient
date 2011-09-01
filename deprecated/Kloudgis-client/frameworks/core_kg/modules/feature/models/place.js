// ==========================================================================
// Project:   Dbclient.Place
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Dbclient */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
sc_require('models/record')
CoreKG.Place = CoreKG.Record.extend(
/** @scope CoreKG.Place.prototype */
{

    init: function() {
        sc_super();
        this._kvo_cache = null;
    },

    //basic urls
    post_url: function() {
        return '%@/protected/feature/%@'.fmt(CoreKG.context_server, this.get('featuretype'));
    }.property('featuretype').cacheable(),

    get_url: function() {
        return this.get('post_url') + "/%@";
    }.property('post_url').cacheable(),

    put_url: function() {
        return this.get('get_url');
    }.property('get_url').cacheable(),

    delete_url: function() {
        return this.get('get_url');
    }.property('get_url').cacheable(),

    sparsearrayBlock: 50,

    /*****************************/
    /**  QUERY HANDLING **/
    handleQuery: function(store, query) {
        console.log('enter place: handlequery');
        var handler = query.get('handleMethod');
        if (handler && this.get(handler)) {
            if (query.get('isStreaming')) {
                store.loadQueryResults(query, SC.SparseArray.create({
                    delegate: this,
                    store: store,
                    query: query,
                    rangeWindowSize: this.get('sparsearrayBlock')
                }));
                return YES;
            } else {
                return this.get(handler).call(this, store, query);
            }
        }
        return NO;
    },

    //SPARSE ARRAY DELEGATE METHODS
    //streaming support
    sparseArrayDidRequestLength: function(sparseArray) {
        return this.sparseArrayDidRequestRange(sparseArray, {
            start: 0,
            length: this.get('sparsearrayBlock')
        },
        YES);
    },
    sparseArrayDidRequestRange: function(sparseArray, range, requestLength) {
        var query = sparseArray.get('query');
        var handler = query.get('handleMethod');
        if (!SC.none(query) && !SC.none(handler) && this.get(handler)) {

            return this.get(handler).call(this, sparseArray, range, requestLength);
        }
        return NO;
    },

    //stream ALL features
    fetchAllQuery: function(sparseArray, range, requestLength) {
        var query = sparseArray.get('query');
        var count = requestLength === YES;
        var url = '%@/protected/feature/%@?start=%@&length=%@&count=%@'.fmt(CoreKG.context_server, this.get('featuretype'), range.start, range.length, count);
        SC.Request.getUrl(url).json().notify(this, this.didFetchFeatures, sparseArray.get('store'), {
            array: sparseArray,
            start: range.start,
            length: range.length
        }).send();
        return YES;

    },

    /*****************************/
    /* STANDARD QUERIES CALLBACK */
    //FETCH FEATURE STREAMING
    didFetchFeatures: function(response, store, params) {
        var sparseArray = params.array,
        start = params.start,
        length = params.length;
        var query = sparseArray.get('query');
        var recordType = query.get('resultRecordType');
        if (SC.none(recordType)) {
            recordType = query.get('recordType');
        }
        var storeKeys;
        if (SC.ok(response)) {

            var body = response.get('body');
            if (body) {
                //***important*** Flush cache in the prototype if any because it corrupt the records created
                recordType.prototype._kvo_cache = null;

                storeKeys = store.loadRecords(recordType, body.features);
                sparseArray._kvo_cache = null;
            }
            if (!SC.none(body.count)) {
                sparseArray.provideLength(body.count);
            }
            sparseArray.provideObjectsInRange({
                start: start,
                length: length
            },
            storeKeys);
            sparseArray.rangeRequestCompleted(start);

        } else {
            store.dataSourceDidErrorQuery(query, response);
        }

    },

    ///////// END of Query section
    featuretype: null,
    name: SC.Record.attr(String),
    featureClass: SC.Record.attr(String),
    type: SC.Record.attr(String),

    //geo
    center: SC.Record.attr(Object),
    geo_type: SC.Record.attr(String),
    coordinates: SC.Record.attr(Array),

});
