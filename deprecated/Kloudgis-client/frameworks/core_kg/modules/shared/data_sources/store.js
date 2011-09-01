// ==========================================================================
// Project:   KLoudgis -- SproutCore 
// Copyright: ©2009-2011 Kloudgis, Inc.
// License:   Images are copyrighted and/or trademarked. All rights reserved.
//            Code (only) is licensed under an MIT license.
// ==========================================================================
/*global CoreKG */

CoreKG.Store = SC.DataSource.extend({

    // ..........................................................
    // QUERY SUPPORT
    // 
    fetch: function(store, query) {

        if (query === CoreKG.PROJECT_QUERY) {
            SC.Request.getUrl('%@/protected/admin/sandboxes'.fmt(CoreKG.context_server)).json().notify(this, this.didFetchRecords, store, query).send();
            return YES;
        } else if (query === CoreKG.FEED_QUERY) {
            store.loadQueryResults(query, SC.SparseArray.create({
                delegate: this,
                store: store,
                query: query,
                rangeWindowSize: query.get('rangeWindowSize') || 50
            }));
            return YES;
        }else if(query.get('isNoteCluster')){
			var bounds = query.get('bounds'),
	        distance = query.get('distance');
	        var url = '%@/protected/feature/note/clusters?sw_lon=%@&ne_lat=%@&ne_lon=%@&sw_lat=%@&distance=%@&sandbox=%@'.fmt(CoreKG.context_server, bounds.getPath('sw.lon'), bounds.getPath('sw.lat'), bounds.getPath('ne.lon'), bounds.getPath('ne.lat'), distance, CoreKG.get('active_sandbox'));
	        var response = SC.Request.getUrl(url).json().notify(this, this.didFetchRecordsRemoteQuery, store, query).send();
			query._response = response;
	        return YES;
		}else if (query === CoreKG.FEATURETYPE_QUERY) {
            SC.Request.getUrl('%@/protected/featuretypes?sandbox=%@'.fmt(CoreKG.context_server, CoreKG.get('active_sandbox'))).json().notify(this, this.didFetchRecords, store, query).send();
            return YES;
        } else if (query === CoreKG.LAYER_QUERY) {
            SC.Request.getUrl('%@/protected/layers?sandbox=%@'.fmt(CoreKG.context_server, CoreKG.get('active_sandbox'))).json().notify(this, this.didFetchRecords, store, query).send();
            return YES;
        } else if (query.get('isQuickGeo')) {
            SC.Request.getUrl('%@/protected/qfeatures/lon_lat?sandbox=%@&layers=%@&lon=%@&lat=%@&limit=%@&one_pixel=%@'.fmt(CoreKG.context_server, CoreKG.get('active_sandbox'), query.get('layers'), query.get('lonlat').get('lon'), query.get('lonlat').get('lat'), query.get('limit'), query.get('one_pixel'))).json().notify(this, this.didFetchRecordsRemoteQuery, store, query).send();
            return YES;
        } else if (!SC.none(query.get('recordType')) && !SC.none(query.get('handleMethod'))) {
            console.log('Enter : Feature streaming fetch');
            var rtype = query.get('recordType');
            if (rtype.prototype.get('handleQuery')) {
                return rtype.prototype.handleQuery(store, query);
            }
        }

        return NO; // return YES if you handled the query
    },

    didFetchRecords: function(response, store, query) {
        if (SC.ok(response)) {
            var body = response.get('body');
            var storeKeys;
            if (body) {
                storeKeys = store.loadRecords(query.get('recordType'), body);
            }
            store.dataSourceDidFetchQuery(query);
        } else {
            store.dataSourceDidErrorQuery(query, response);
        }
    },

    didFetchRecordsRemoteQuery: function(response, store, query) {
        if (SC.ok(response)) {
            var body = response.get('body');
            var storeKeys;
            if (body) {
                storeKeys = store.loadRecords(query.get('recordType'), body);
            }			
            store.loadQueryResults(query, storeKeys);
        } else {
            store.dataSourceDidErrorQuery(query, response);
        }
    },

    //feed streaming support
    //SPARSE ARRAY DELEGATE
    //streaming support
    sparseArrayDidRequestLength: function(sparseArray) {
        return this.sparseArrayDidRequestRange(sparseArray, {
            start: 0,
            length: sparseArray.get('query').get('rangeWindowSize') || 50
        },
        YES);
    },
    sparseArrayDidRequestRange: function(sparseArray, range, requestLength) {
        var query = sparseArray.get('query');
        if (query === CoreKG.FEED_QUERY) {
            return this.fetchFeedQuery(sparseArray, range, requestLength);
        } else if (query === CoreKG.NOTE_MARKER_QUERY) {
            return this.fetchNoteMarkerQuery(sparseArray, range, requestLength);
        }
    },

    fetchNoteMarkerQuery: function(sparseArray, range, requestLength) {
        var query = sparseArray.get('query');
        var count = requestLength === YES;
        var bounds = query.get('bounds'),
        distance = query.get('distance');
        var url = '%@/protected/feature/note/clusters?start=%@&length=%@&count=%@&sw_lon=%@&ne_lat=%@&ne_lon=%@&sw_lat=%@&distance=%@&sandbox=%@'.fmt(CoreKG.context_server, range.start, range.length, count, bounds.getPath('sw.lon'), bounds.getPath('sw.lat'), bounds.getPath('ne.lon'), bounds.getPath('ne.lat'), distance, CoreKG.get('active_sandbox'));
        SC.Request.getUrl(url).json().notify(this, this.didStreamRecords, sparseArray.get('store'), {
            array: sparseArray,
            start: range.start,
            length: range.length
        }).send();
        return YES;
    },

    fetchFeedQuery: function(sparseArray, range, requestLength) {
        var query = sparseArray.get('query');
        var count = requestLength === YES;
        var url = '%@/protected/admin/sandboxes/feeds?start=%@&length=%@&count=%@'.fmt(CoreKG.context_server, range.start, range.length, count);
        SC.Request.getUrl(url).json().notify(this, this.didStreamRecords, sparseArray.get('store'), {
            array: sparseArray,
            start: range.start,
            length: range.length
        }).send();
        return YES;
    },

    didStreamRecords: function(response, store, params) {
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
                storeKeys = store.loadRecords(recordType, body.features);
                //sparseArray._kvo_cache = null;
            }
            if (!SC.none(body.count)) {
                sparseArray.provideLength(body.count);
            }
            //	console.log('stream records for %@ start=%@ len=%@ actualLen=%@'.fmt(recordType, start, length, storeKeys.length));
            sparseArray.provideObjectsInRange({
                start: start,
                length: storeKeys.length
            },
            storeKeys);
            //	console.log('request completed for %@'.fmt(start));
            sparseArray.rangeRequestCompleted(start);

        } else {
            store.dataSourceDidErrorQuery(query, response);
        }
    },

    // ..........................................................
    // RECORD SUPPORT
    // 
    retrieveRecord: function(store, storeKey) {
        var rtype = store.recordTypeFor(storeKey);
        var id = store.idFor(storeKey);

        if (SC.kindOf(rtype, CoreKG.Place)) {
            var url = rtype.prototype.get('get_url');
            if (!SC.none(url)) {
                url = url.fmt(id) + "?sandbox=%@".fmt(CoreKG.get('active_sandbox'));
                SC.Request.getUrl(url).json().notify(this, 'didRetrieve', store, storeKey).send();
                return YES;
            }
        } else if (!SC.none(id) && SC.kindOf(rtype, CoreKG.Note)) {
            SC.Request.getUrl('%@/protected/feature/note/%@?sandbox=%@'.fmt(CoreKG.context_server, id, CoreKG.get('active_sandbox'))).json().notify(this, this.didRetrieve, store, storeKey).send();
            return YES;
        } else if (!SC.none(id) && SC.kindOf(rtype, CoreKG.Layer)) {
            SC.Request.getUrl('%@/protected/layers/%@?sandbox=%@'.fmt(CoreKG.context_server, id, CoreKG.get('active_sandbox'))).json().notify(this, this.didRetrieve, store, storeKey).send();
            return YES;
        } else if (!SC.none(id) && SC.kindOf(rtype, CoreKG.Featuretype)) {
            SC.Request.getUrl('%@/protected/featuretypes/%@?sandbox=%@'.fmt(CoreKG.context_server, id, CoreKG.get('active_sandbox'))).json().notify(this, this.didRetrieve, store, storeKey).send();
            return YES;
        }
        return NO; // return YES if you handled the storeKey
    },

    didRetrieve: function(response, store, storeKey) {
        if (SC.ok(response)) {
            SC.Logger.debug('retreiveRecord completed - OK');
            var data = response.get('body');
            if (data) {
                var id = data.guid;
                store.dataSourceDidComplete(storeKey, data, id);
            } else {
                store.dataSourceDidComplete(storeKey);
            }
        } else {
            SC.Logger.error('retreiveRecord completed - ERROR');
            store.dataSourceDidError(storeKey, response);
        }
    },

    createRecord: function(store, storeKey) {
        SC.Logger.debug('createRecord');
        var rtype = store.recordTypeFor(storeKey);
        if (SC.kindOf(rtype, KG.Place)) {
            var url = rtype.prototype.get('post_url');
            if (!SC.none(url)) {
                SC.Request.postUrl(url).json().notify(this, this.didCreate, store, storeKey).send(store.readDataHash(storeKey));
            }
            return YES;
        }
        return NO;
    },

    didCreate: function(response, store, storeKey) {
        if (SC.ok(response)) {
            SC.Logger.debug('createRecord completed - OK');
            var data = response.get('body');
            if (data) {
                var id = data.guid;
                store.dataSourceDidComplete(storeKey, data, id);
            } else {
                store.dataSourceDidComplete(storeKey);
            }
        } else {
            SC.Logger.error('createRecord completed - ERROR');
            store.dataSourceDidError(storeKey, response);
        }
    },

    updateRecord: function(store, storeKey) {
        SC.Logger.debug('update record');
        var rtype = store.recordTypeFor(storeKey);
        var id = store.idFor(storeKey);
        if (!SC.none(id) && SC.kindOf(rtype, KG.Place)) {
            var url = rtype.prototype.get('put_url');
            if (url) {
                url = url.fmt(id);
                SC.Request.putUrl(url).json().notify(this, this.didUpdateFeature, store, storeKey).send(store.readDataHash(storeKey));
                return YES;
            }
        }
        return NO;
    },

    didUpdateFeature: function(response, store, storeKey) {
        if (SC.ok(response)) {
            SC.Logger.debug('update record completed - OK');
            var data = response.get('body');
            if (data) {
                store.dataSourceDidComplete(storeKey, data);
            } else {
                store.dataSourceDidComplete(storeKey);
            }
        } else {
            SC.Logger.error('update record completed - ERROR');
            store.dataSourceDidError(storeKey, response);
        }
    },

    destroyRecord: function(store, storeKey) {
        return NO;
    }

});
