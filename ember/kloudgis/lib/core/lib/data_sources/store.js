//datasource
KG.Store = SC.DataSource.extend({

    // ..........................................................
    // QUERY SUPPORT
    // 
    /**

    Invoked by the store whenever it needs to retrieve data matching a
    specific query, triggered by find().  This method is called anytime
    you invoke SC.Store#find() with a query or SC.RecordArray#refresh().  You
    should override this method to actually retrieve data from the server
    needed to fulfill the query.  If the query is a remote query, then you
    will also need to provide the contents of the query as well.

    ### Handling Local Queries

    Most queries you create in your application will be local queries.  Local
    queries are populated automatically from whatever data you have in memory.
    When your fetch() method is called on a local queries, all you need to do
    is load any records that might be matched by the query into memory.

    The way you choose which queries to fetch is up to you, though usually it
    can be something fairly straightforward such as loading all records of a
    specified type.

    When you finish loading any data that might be required for your query,
    you should always call SC.Store#dataSourceDidFetchQuery() to put the query
    back into the READY state.  You should call this method even if you choose
    not to load any new data into the store in order to notify that the store
    that you think it is ready to return results for the query.

    ### Handling Remote Queries

    Remote queries are special queries whose results will be populated by the
    server instead of from memory.  Usually you will only need to use this
    type of query when loading large amounts of data from the server.

    Like Local queries, to fetch a remote query you will need to load any data
    you need to fetch from the server and add the records to the store.  Once
    you are finished loading this data, however, you must also call
    SC.Store#loadQueryResults() to actually set an array of storeKeys that
    represent the latest results from the server.  This will implicitly also
    call dataSourceDidFetchQuery() so you don't need to call this method
    yourself.

    If you want to support incremental loading from the server for remote
    queries, you can do so by passing a SC.SparseArray instance instead of
    a regular array of storeKeys and then populate the sparse array on demand.

    ### Handling Errors and Cancelations

    If you encounter an error while trying to fetch the results for a query
    you can call SC.Store#dataSourceDidErrorQuery() instead.  This will put
    the query results into an error state.

    If you had to cancel fetching a query before the results were returned,
    you can instead call SC.Store#dataSourceDidCancelQuery().  This will set
    the query back into the state it was in previously before it started
    loading the query.

    ### Return Values

    When you return from this method, be sure to return a Boolean.  YES means
    you handled the query, NO means you can't handle the query.  When using
    a cascading data source, returning NO will mean the next data source will
    be asked to fetch the same results as well.

    @param {SC.Store} store the requesting store
    @param {SC.Query} query query describing the request
    @returns {Boolean} YES if you can handle fetching the query, NO otherwise
  */
    fetch: function(store, query) {
        var query_url;
        if (query === KG.LAYER_QUERY) {
            query_url = KG.get('serverHost') + 'api_data/protected/layers?sandbox=%@'.fmt(KG.get('activeSandboxKey'));
        } else if (query === KG.BOOKMARK_QUERY) {
            query_url = KG.get('serverHost') + 'api_data/protected/bookmarks?sandbox=%@'.fmt(KG.get('activeSandboxKey'));
        } else if (query === KG.FEATURETYPE_QUERY) {
            query_url = KG.get('serverHost') + 'api_data/protected/featuretypes?sandbox=%@'.fmt(KG.get('activeSandboxKey'));
        } else if (query === KG.ATTRTYPE_QUERY) {
            query_url = KG.get('serverHost') + 'api_data/protected/attrtypes?sandbox=%@'.fmt(KG.get('activeSandboxKey'));
        } else if (query === KG.SEARCH_QUERY) {
            query_url = KG.get('serverHost') + 'api_data/protected/features/count_search?search_string=%@&sandbox=%@'.fmt(query.search, KG.get('activeSandboxKey'));
        } else if (query === KG.INFO_QUERY) {
            query_url = KG.get('serverHost') + 'api_data/protected/features/features_at?sandbox=%@&lat=%@&lon=%@&one_pixel=%@&limit=%@&layers=%@'.fmt(KG.get('activeSandboxKey'), query.lat, query.lon, query.one_pixel, query.limit_query, query.layers);
        } else if (query === KG.NOTE_MARKER_QUERY) {
            var fatBounds = query.fat_bounds;
            query_url = KG.get('serverHost') + 'api_data/protected/notes/clusters?sw_lon=%@&ne_lat=%@&ne_lon=%@&sw_lat=%@&distance=%@&sandbox=%@'.fmt(fatBounds.getPath('sw.lon'), fatBounds.getPath('sw.lat'), fatBounds.getPath('ne.lon'), fatBounds.getPath('ne.lat'), query.distance, KG.get('activeSandboxKey'));
        } else if (query === KG.SEARCH_RESULT_NOTE_QUERY || query === KG.SEARCH_RESULT_FEATURE_QUERY) {
            query_url = KG.get('serverHost') + 'api_data/protected/features/search?category=%@&search_string=%@&sandbox=%@'.fmt(query.category, query.search, KG.get('activeSandboxKey'));
        } else if (query === KG.SANDBOX_QUERY) {
            query_url = KG.get('serverHost') + 'api_sandbox/protected/sandboxes';
        }
        if (!SC.none(query_url)) {
            $.ajax({
                type: 'GET',
                url: query_url,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                context: this,
                headers: KG.core_auth.createAjaxRequestHeaders(),
                async: YES,
                error: function(jqXHR, textStatus, errorThrown) {
                    SC.Logger.error('Load error: HTTP error status code: ' + jqXHR.status);
                    store.dataSourceDidErrorQuery(query, errorThrown);
                    if (KG.statechart) {
                        KG.statechart.sendAction('httpError', jqXHR.status);
                    }
                },
                success: function(data, textStatus, jqXHR) {
                    console.log('fetch success');
                    var raw = data ? data.records: null;
                    var storeKeys;
                    if (!SC.none(raw)) {
                        storeKeys = store.loadRecords(query.get('recordType'), raw);
                    }
                    if (query.get('isLocal')) {
                        store.dataSourceDidFetchQuery(query);
                    } else {
                        store.loadQueryResults(query, storeKeys);
                    }
                }
            });
            return YES;
        }
        return NO;
    },

    // ..........................................................
    // RECORD SUPPORT
    // 
    retrieveRecord: function(store, storeKey) {
        var rtype = store.recordTypeFor(storeKey);
        var id = store.idFor(storeKey);
        var url;
        if (!SC.none(id)) {
            if (rtype === KG.Feature) {
                url = KG.get('serverHost') + 'api_data/protected/features/%@?sandbox=%@'.fmt(id, KG.get('activeSandboxKey'));
            } else if (rtype === KG.Note) {
                url = KG.get('serverHost') + 'api_data/protected/notes/%@?sandbox=%@'.fmt(id, KG.get('activeSandboxKey'));
            } else if (rtype === KG.NoteComment) {
                url = KG.get('serverHost') + 'api_data/protected/note_comments/%@?sandbox=%@'.fmt(id, KG.get('activeSandboxKey'));
            } else if (rtype === KG.FeatureComment) {
                url = KG.get('serverHost') + 'api_data/protected/feature_comments/%@?sandbox=%@'.fmt(id, KG.get('activeSandboxKey'));
            } else if (rtype === KG.Featuretype) {
                url = KG.get('serverHost') + 'api_data/protected/featuretypes/%@?sandbox=%@'.fmt(id, KG.get('activeSandboxKey'));
            } else if (rtype === KG.Attrtype) {
                url = KG.get('serverHost') + 'api_data/protected/attrtypes/%@?sandbox=%@'.fmt(id, KG.get('activeSandboxKey'));
            } else if (rtype === KG.Bookmark) {
                url = KG.get('serverHost') + 'api_data/protected/bookmarks/%@?sandbox=%@'.fmt(id, KG.get('activeSandboxKey'));
            }
            if (url) {
                this.ajaxSupport(store, storeKey, 'GET', url);
                return YES;
            }
        }
        return NO; // return YES if you handled the storeKey
    },

    createRecord: function(store, storeKey) {
        var rtype = store.recordTypeFor(storeKey);
        var url;
        if (rtype === KG.Feature) {
            url = KG.get('serverHost') + 'api_data/protected/features?sandbox=%@'.fmt(KG.get('activeSandboxKey'));
        } else if (rtype === KG.Note) {
            url = KG.get('serverHost') + 'api_data/protected/notes?sandbox=%@'.fmt(KG.get('activeSandboxKey'));
        } else if (rtype === KG.NoteComment) {
            url = KG.get('serverHost') + 'api_data/protected/note_comments?sandbox=%@'.fmt(KG.get('activeSandboxKey'));
        } else if (rtype === KG.FeatureComment) {
            url = KG.get('serverHost') + 'api_data/protected/feature_comments?sandbox=%@'.fmt(KG.get('activeSandboxKey'));
        } else if (rtype === KG.Bookmark) {
            url = KG.get('serverHost') + 'api_data/protected/bookmarks?sandbox=%@'.fmt(KG.get('activeSandboxKey'));
        }
        if (url) {
            this.ajaxSupport(store, storeKey, 'POST', url, JSON.stringify(store.readDataHash(storeKey)));
            return YES;
        }
        return NO;
    },

    updateRecord: function(store, storeKey, params) {
        var rtype = store.recordTypeFor(storeKey);
        var id = store.idFor(storeKey);
        var url;
        if (!SC.none(id)) {
            if (rtype === KG.Feature) {
                url = KG.get('serverHost') + 'api_data/protected/features/%@?sandbox=%@'.fmt(id, KG.get('activeSandboxKey'));
            } else if (rtype === KG.Note) {
                url = KG.get('serverHost') + 'api_data/protected/notes/%@?sandbox=%@'.fmt(id, KG.get('activeSandboxKey'));
            } else if (rtype === KG.NoteComment) {
                url = KG.get('serverHost') + 'api_data/protected/note_comments/%@?sandbox=%@'.fmt(id, KG.get('activeSandboxKey'));
            } else if (rtype === KG.FeatureComment) {
                url = KG.get('serverHost') + 'api_data/protected/feature_comments/%@?sandbox=%@'.fmt(id, KG.get('activeSandboxKey'));
            } else if (rtype === KG.Bookmark) {
                url = KG.get('serverHost') + 'api_data/protected/bookmarks/%@?sandbox=%@'.fmt(id, KG.get('activeSandboxKey'));
            }
        }
        if (url) {
            this.ajaxSupport(store, storeKey, 'PUT', url, JSON.stringify(store.readDataHash(storeKey)));
            return YES;
        }
        return NO;
    },

    destroyRecord: function(store, storeKey, params) {
        var rtype = store.recordTypeFor(storeKey);
        var id = store.idFor(storeKey);
        var url;
        if (!SC.none(id)) {
            if (rtype === KG.Feature) {
                url = KG.get('serverHost') + 'api_data/protected/features/%@?sandbox=%@'.fmt(id, KG.get('activeSandboxKey'));
            } else if (rtype === KG.Note) {
                url = KG.get('serverHost') + 'api_data/protected/notes/%@?sandbox=%@'.fmt(id, KG.get('activeSandboxKey'));
            } else if (rtype === KG.NoteComment) {
                url = KG.get('serverHost') + 'api_data/protected/note_comments/%@?sandbox=%@'.fmt(id, KG.get('activeSandboxKey'));
            } else if (rtype === KG.FeatureComment) {
                url = KG.get('serverHost') + 'api_data/protected/feature_comments/%@?sandbox=%@'.fmt(id, KG.get('activeSandboxKey'));
            } else if (rtype === KG.Bookmark) {
                url = KG.get('serverHost') + 'api_data/protected/bookmarks/%@?sandbox=%@'.fmt(id, KG.get('activeSandboxKey'));
            }
        }
        if (url) {
            this.ajaxSupport(store, storeKey, 'DELETE', url);
            return YES;
        }
        return NO;
    },

    ajaxSupport: function(store, storeKey, type, url, data) {
        $.ajax({
            type: type,
            url: url,
            data: data,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            context: this,
            headers: KG.core_auth.createAjaxRequestHeaders(),
            async: YES,
            error: function(jqXHR, textStatus, errorThrown) {
                SC.Logger.error('Ajax error: HTTP error status code: ' + jqXHR.status);
                store.dataSourceDidError(storeKey, errorThrown);
                if (KG.statechart) {
                    KG.statechart.sendAction('httpError', jqXHR.status);
                }
            },
            success: function(data, textStatus, jqXHR) {
                console.log(type + ' success');
                var raw = data;
                var storeKeys;
                if (type === 'DELETE') {
                    store.dataSourceDidDestroy(storeKey);
                } else {
                    if (!SC.none(raw) && raw.guid) {
                        store.dataSourceDidComplete(storeKey, raw, raw.guid);
                    } else {
                        store.dataSourceDidComplete(storeKey);
                    }
                }
            }
        });
    }
});
