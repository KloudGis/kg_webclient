/* ===========================================================================
   BPM Combined Asset File
   MANIFEST: kloudgis ()
   This file is generated automatically by the bpm (http://www.bpmjs.org)
   =========================================================================*/

spade.register("kloudgis/core/lib/core_date", function(require, exports, __module, ARGV, ENV, __filename){
KG.core_date = SC.Object.create({
	
	formatDate: function(timeMillis){
		return this._formatDate(timeMillis, NO);
	},
	
	formatDateSimple: function(timeMillis){
		return this._formatDate(timeMillis, YES);
	},
	
	
	_formatDate: function(timeMillis, simple){
        if (timeMillis) {
			//date from millis
            var d = new Date(timeMillis);
            var day = d.getDate();
            var month = d.getMonth() + 1; //months are zero based
            var year = d.getFullYear();		
			//now	
            var today = new Date();
			var curr_day = today.getDate();
	        var curr_month = today.getMonth() + 1; //months are zero based
	        var curr_year = today.getFullYear();
			//add zeros			
			var hour = d.getHours();
			if(hour < 10){
				hour = '0' + hour;
			}
			var min = d.getMinutes();
			if(min < 10){
				min = '0' + min;
			}
			if(curr_day === day && curr_month === month && curr_year == year){			
				return "%@:%@".fmt(hour, min);
			}else{
				if(month < 10){
					month = '0' + month;
				}
				if(day < 10){
					day = '0' + day;
				}
				if(simple){
					return "%@-%@-%@".fmt(year, month, day);
				}else{
					return "%@-%@-%@ %@:%@".fmt(year, month, day, hour, min);
				}
			}
        }
	}
});

});spade.register("kloudgis/core/lib/data_sources/store", function(require, exports, __module, ARGV, ENV, __filename){
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
            if (rtype === KG.Note) {
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
            if (rtype === KG.Note) {
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

});spade.register("kloudgis/core/lib/main_ds", function(require, exports, __module, ARGV, ENV, __filename){
require("ember-datastore");
require("./data_sources/store");
require("./models/record");
require("./models/comment");
require("./models/lon_lat");
require("./models/note");
require("./models/note_marker");
require("./models/note_comment");
require("./models/feature");
require("./models/feature_comment");
require("./models/featuretype");
require("./models/attrtype");
require("./models/layer");
require("./models/search_category");
require("./models/sandbox");
require("./models/bookmark");
require("./models/attribute");

KG.store = SC.Store.create({
    commitRecordsAutomatically: NO
}).from('KG.Store');

//LOCAL QUERY
KG.SANDBOX_QUERY = SC.Query.local(KG.Sandbox, {orderBy: 'date_create DESC'});
KG.LAYER_QUERY = SC.Query.local(KG.Layer);
KG.BOOKMARK_QUERY = SC.Query.local(KG.Bookmark, {orderBy: 'label'});
KG.FEATURETYPE_QUERY = SC.Query.local(KG.Featuretype, {orderBy: 'label'});
KG.ATTRTYPE_QUERY = SC.Query.local(KG.Attrtype);
KG.SEARCH_QUERY = SC.Query.local(KG.SearchCategory, {
    conditions: 'count > 0 OR count = -1',
    orderBy: 'categoryLabel'
});
//REMOTE QUERY
KG.INFO_QUERY = SC.Query.remote(KG.Feature);
KG.NOTE_MARKER_QUERY = SC.Query.remote(KG.NoteMarker);
KG.SEARCH_RESULT_NOTE_QUERY = SC.Query.remote(KG.Note, {conditions: 'count > 0'});
KG.SEARCH_RESULT_FEATURE_QUERY = SC.Query.remote(KG.Feature, {conditions: 'count > 0'});

//SC.RECORDARRAY
//add onReady, onError support to RecordArrays
SC.RecordArray.reopen({
    _readyQueue: null,
    _errorQuery: null,

    onReady: function(target, method, params) {
        if (this.get('status') & SC.Record.READY) {
            method.call(target, this, params);
        } else {
            var queue = this._readyQueue;
            if (!this._readyQueue) {
                queue = [];
                this._readyQueue = queue;
                this.addObserver('status', this, this._onReady);
            }
            var rec = this;
            queue.push(function() {
                method.call(target, rec, params);
            });
        }
    },

    _onReady: function() {
        if (this.get('status') & SC.Record.READY) {
            var queue = this._readyQueue;
            var idx, len;
            for (idx = 0, len = queue.length; idx < len; idx++) {
                queue[idx].call();
            }
            this.removeObserver('status', this, this._onReady);
            this._readyQueue = null;
        }
    },

    offReady: function() {
        this.removeObserver('status', this, this._onReady);
    },

    onError: function(target, method, params) {
        if (this.get('status') & SC.Record.ERROR) {
            method.call(target, this, params);
        } else {
            var queue = this._errorQueue;
            if (!this._errorQueue) {
                queue = [];
                this._errorQueue = queue;
                this.addObserver('status', this, this._onError);
            }
            var rec = this;
            queue.push(function() {
                method.call(target, rec, params);
            });
        }
    },

    _onError: function() {
        if (this.get('status') & SC.Record.ERROR) {
            var queue = this._errorQueue;
            var idx, len;
            for (idx = 0, len = queue.length; idx < len; idx++) {
                queue[idx].call();
            }
            this.removeObserver('status', this, this._onError);
            this._errorQueue = null;
        }
    },

    offError: function() {
        this.removeObserver('status', this, this._onError);
    }
});

//SC.RECORD
//add onReady, onError support to Record
SC.Record.reopen({
    _readyQueue: null,
    _errorQueue: null,
    _destroyQueue: null,

    onReady: function(target, method, params) {
        if (this.get('status') & SC.Record.READY) {
            method.call(target, this, params);
        } else {
            var queue = this._readyQueue;
            if (!queue) {
                queue = [];
                this._readyQueue = queue;
                this.addObserver('status', this, this._onReady);
            }
            var rec = this;
            queue.push(function() {
                method.call(target, rec, params);
            });
        }
    },

    _onReady: function() {
        //	console.log('onReady status is '  + this.get('status'));
        if (this.get('status') & SC.Record.READY) {
            var queue = this._readyQueue;
            var idx, len;
            for (idx = 0, len = queue.length; idx < len; idx++) {
                queue[idx].call();
            }
            this.removeObserver('status', this, this._onReady);
            this._readyQueue = null;
        }
    },

    offReady: function() {
        this.removeObserver('status', this, this._onReady);
    },

    onError: function(target, method, params) {
        if (this.get('status') & SC.Record.ERROR) {
            method.call(target, this, params);
        } else {
            var queue = this._errorQueue;
            if (!queue) {
                queue = [];
                this._errorQueue = queue;
                this.addObserver('status', this, this._onError);
            }
            var rec = this;
            queue.push(function() {
                method.call(target, rec, params);
            });
        }
    },

    _onError: function() {
        if (this.get('status') & SC.Record.ERROR) {
            var queue = this._errorQueue;
            var idx, len;
            for (idx = 0, len = queue.length; idx < len; idx++) {
                queue[idx].call();
            }
            this.removeObserver('status', this, this._onError);
            this._errorQueue = null;
        }
    },

    offError: function() {
        this.removeObserver('status', this, this._onError);
    },

    onDestroyedClean: function(target, method, params) {
        if (this.get('status') === SC.Record.DESTROYED_CLEAN) {
            method.call(target, this, params);
        } else {
            var queue = this._destroyQueue;
            if (!queue) {
                queue = [];
                this._destroyQueue = queue;
                this.addObserver('status', this, this._onDestroyedClean);
            }
            var rec = this;
            queue.push(function() {
                method.call(target, rec, params);
            });
        }
    },

    _onDestroyedClean: function() {
        if (this.get('status') === SC.Record.DESTROYED_CLEAN) {
            var queue = this._destroyQueue;
            var idx, len;
            for (idx = 0, len = queue.length; idx < len; idx++) {
                queue[idx].call();
            }
            this.removeObserver('status', this, this._onDestroyedClean);
            this._destroyQueue = null;
        }
    },

    offDestroyedClean: function() {
        this.removeObserver('status', this, this._onDestroyedClean);
    }
});

});spade.register("kloudgis/core/lib/models/attribute", function(require, exports, __module, ARGV, ENV, __filename){
/*
	Wrapper on a feature with a specific attrtype.
*/

KG.Attribute = SC.Object.extend({

    feature: null,
    attrtype: null,

    label: function() {
        return this.getPath('attrtype.label');
    }.property().cacheable(),

    templateName: function() {
        var type = this.getPath('attrtype.type');
        return type + '-renderer';
    }.property(),

    value: function(key, value) {
        var ref = this.getPath('attrtype.attr_ref');
        var feature = this.get('feature');
        if (value !== undefined) {
            feature.set(ref, value);
        }
        return feature.get(ref);
    }.property(),

    imgBase64Value: function() {

        var val = this.get('value');
        if (SC.none(val)) {
            return '';
        } else {
            var startURL = "data:image/png;base64,";
            return startURL + val;
        }
    }.property('value'),

    css_class: function() {
        return this.getPath('attrtype.css_class') || 'one-column';
    }.property(),

    min: function() {
        return this.getPath('attrtype.min') || 0;
    }.property(),

    max: function() {
        return this.getPath('attrtype.max') || 2000000000;
    }.property(),

    step: function() {
        return this.getPath('attrtype.step') || 1;
    }.property(),

    enumValues: function() {
        var possibleVals = this.getPath('attrtype.enum_values');
        var enumVals = [];
        var value = this.get('value');
        var i, len = possibleVals.length;
        var found = NO;
        for (i = 0; i < len; i++) {
            if (possibleVals[i].key === value) {
                found = YES;
            }
            enumVals.push(possibleVals[i]);
        }
        if (!found) {
            enumVals.insertAt(0, {
                key: value,
                label: ''
            });
        }
        return enumVals;
    }.property('attr_type').cacheable(),

    enumValuesCustom: function() {
        var possibleVals = this.getPath('attrtype.enum_values');
        var enumVals = [];
        var i, len = possibleVals.length;
        enumVals.push({
            key: KG.otherKey,
            label: "_otherValue".loc()
        });
        for (i = 0; i < len; i++) {
            enumVals.push(possibleVals[i]);
        }
        return enumVals;
    }.property('attr_type').cacheable()

});

});spade.register("kloudgis/core/lib/models/attrtype", function(require, exports, __module, ARGV, ENV, __filename){
/**
*  Similar to space AttrType
**/

KG.Attrtype = KG.Record.extend({
	
	label: SC.Record.attr(String),
	type: SC.Record.attr(String),
	attr_ref: SC.Record.attr(String),
	css_class: SC.Record.attr(String),
	render_order: SC.Record.attr(Number),
	featuretype: SC.Record.toOne('KG.Featuretype', {inverse: 'attrtypes', isMaster: YES}),
	
	//for range Number
	min: SC.Record.attr(Number),
	max: SC.Record.attr(Number),
	step: SC.Record.attr(Number),
	
	//fixed catalog
	enum_values: SC.Record.attr(Array)
});

});spade.register("kloudgis/core/lib/models/bookmark", function(require, exports, __module, ARGV, ENV, __filename){
/**
*  Similar to space AttrType
**/

KG.Bookmark = KG.Record.extend({
	
	label: SC.Record.attr(String),
	user_create: SC.Record.attr(Number),
	user_descriptor: SC.Record.attr(String),
	center: SC.Record.attr(Object),
	zoom:  SC.Record.attr(Number),
	
	formattedDate: function() {
        var date = this.get('date_create');
        if (date) {
	        return KG.core_date.formatDateSimple(date);
        }
        return '';
    }.property('date_create')
});

});spade.register("kloudgis/core/lib/models/bounds", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Geometry bounds.  South-West and North-East envelope.
**/

KG.Bounds = SC.Object.extend({
	
	sw: null,
	ne: null,
	
	contains: function(obj){
		var sw = this.get('sw');
		var ne = this.get('ne');
		
		var sw2 = obj.get('sw');
		var ne2 = obj.get('ne');
		if(!sw2){
			sw2 = ne2 = obj;
		}
		return (sw2.get('lat') >= sw.get('lat')) && (ne2.get('lat') <= ne.get('lat')) &&
						(sw2.get('lon') >= sw.get('lon')) && (ne2.get('lon') <= ne.get('lon'));
	},
		
	toString: function() {
		return "sw:%@ ne:%@".fmt(this.get('sw'), this.get('ne'));
	}
});

});spade.register("kloudgis/core/lib/models/comment", function(require, exports, __module, ARGV, ENV, __filename){
/**
*  Generic Comment
**/

KG.Comment = KG.Record.extend({
	
	comment: SC.Record.attr(String),
	author: SC.Record.attr(Number),
	author_descriptor: SC.Record.attr(String)
});

});spade.register("kloudgis/core/lib/models/feature", function(require, exports, __module, ARGV, ENV, __filename){
/**
* The Feature class with the feature id (fid), featuretype (ft), attributes (attrs), ...
**/

KG.Feature = KG.Record.extend({

    fid: SC.Record.attr(Number),
    ft_id: SC.Record.attr(Number),
    user_create: SC.Record.attr(Number),
    date_update: SC.Record.attr(Number),
    user_update: SC.Record.attr(Number),

    joins: SC.Record.toMany('KG.Feature', {
        inverse: 'reverse_joins',
        isMaster: YES
    }),
    reverse_joins: SC.Record.toMany('KG.Feature', {
        inverse: 'joins',
        isMaster: NO
    }),

	comments: SC.Record.toMany('KG.FeatureComment', {
        inverse: 'feature',
        isMaster: NO
    }),
    //object (contains coords, centroid, geo_type, ...)
    geo: SC.Record.attr(Object),
    //25 text
    text1: SC.Record.attr(String),
    text2: SC.Record.attr(String),
    text3: SC.Record.attr(String),
    text4: SC.Record.attr(String),
    text5: SC.Record.attr(String),
    text6: SC.Record.attr(String),
    text7: SC.Record.attr(String),
    text8: SC.Record.attr(String),
    text9: SC.Record.attr(String),
    text10: SC.Record.attr(String),
    text11: SC.Record.attr(String),
    text12: SC.Record.attr(String),
    text13: SC.Record.attr(String),
    text14: SC.Record.attr(String),
    text15: SC.Record.attr(String),
    text16: SC.Record.attr(String),
    text17: SC.Record.attr(String),
    text18: SC.Record.attr(String),
    text19: SC.Record.attr(String),
    text20: SC.Record.attr(String),
    text21: SC.Record.attr(String),
    text22: SC.Record.attr(String),
    text23: SC.Record.attr(String),
    text24: SC.Record.attr(String),
    text25: SC.Record.attr(String),
    //5 bool
    bool1: SC.Record.attr(Boolean),
    bool2: SC.Record.attr(Boolean),
    bool3: SC.Record.attr(Boolean),
    bool4: SC.Record.attr(Boolean),
    bool5: SC.Record.attr(Boolean),
    //3 date (stored as long - Time in millis)
    date1: SC.Record.attr(Number),
    date2: SC.Record.attr(Number),
    date3: SC.Record.attr(Number),
    //10 num
    num1: SC.Record.attr(Number),
    num2: SC.Record.attr(Number),
    num3: SC.Record.attr(Number),
    num4: SC.Record.attr(Number),
    num5: SC.Record.attr(Number),
    num6: SC.Record.attr(Number),
    num7: SC.Record.attr(Number),
    num8: SC.Record.attr(Number),
    num9: SC.Record.attr(Number),
    num10: SC.Record.attr(Number),
    //10 decimal
    decim1: SC.Record.attr(Number),
    decim2: SC.Record.attr(Number),
    decim3: SC.Record.attr(Number),
    decim4: SC.Record.attr(Number),
    decim5: SC.Record.attr(Number),
    decim6: SC.Record.attr(Number),
    decim7: SC.Record.attr(Number),
    decim8: SC.Record.attr(Number),
    decim9: SC.Record.attr(Number),
    decim10: SC.Record.attr(Number),
    //2 image (stored as base64 string)
    img1: SC.Record.attr(String),
    img2: SC.Record.attr(String),

    featuretype: function() {
        var ft_id = this.get('ft_id');
        if (ft_id) {
            return KG.store.find(KG.Featuretype, ft_id);
        }
    }.property('ft_id').cacheable(),

    _observerSet: NO,

    title: function() {
        var featuretype = this.get('featuretype');
        if (featuretype) {
            var attr = featuretype.get('title_attribute');
            if (attr) {
                if (!this._observerSet) {
                    this._observerSet = true;
                    var self = this;
                    //add an observer to the property use for title.  When this property change, notify that title changed too.
                    this.addObserver(attr,
                    function() {
                        self.notifyPropertyChange('title');
                    });
                }
                return this.get(attr);
            }
        }
        return "?";
    }.property('featuretype'),

    //TODO: Use the featuretype for these
    isSelectable: YES,
    isInspectorSelectable: YES,

    center: function() {
        var center;
        var geo = this.get('geo');
        if (!SC.none(geo)) {
            center = geo.centroid;
        }
        if (!SC.none(center)) {
            return KG.LonLat.create({
                lon: center.x,
                lat: center.y
            });
        }
        return NO;
    }.property('geo'),

    getClosestCoord: function(inCoord) {
        var geo = this.get('geo');
        if (!SC.none(geo)) {
            var coords = geo.coords;
            if (!SC.none(coords) && coords.length > 0) {
                if (!inCoord) {
                    return coords[0];
                }
                var inLonLat = KG.LonLat.create({
                    lon: inCoord.x,
                    lat: inCoord.y
                });
                var len = coords.length,
                i, dist, closest;
                for (i = 0; i < len; i++) {
                    var lonLat = KG.LonLat.create({
                        lon: coords[i].x,
                        lat: coords[i].y
                    });
                    var d = lonLat.distance(inLonLat);
                    if (!dist || d < dist) {
                        dist = d;
                        closest = lonLat;
                    }
                }
                return closest;
            }
        }
    },

    getAttributes: function() {
        var ret = [];
        var ft = this.get('featuretype');
        if (!SC.none(ft)) {
            var attrs = ft.get('attrtypes');
            if (!SC.none(attrs)) {
                var self = this;
                attrs.forEach(function(attrtype) {
                    if (attrtype.get('type') !== 'geo') {
                        var wrapper = KG.Attribute.create({
                            feature: self,
                            attrtype: attrtype
                        });
                        ret.push(wrapper);
                    }
                });
            }
        }
        return ret;
    }

});

});spade.register("kloudgis/core/lib/models/feature_comment", function(require, exports, __module, ARGV, ENV, __filename){
KG.FeatureComment = KG.Comment.extend({
	
	feature: SC.Record.toOne('KG.Feature', {inverse: 'comments', isMaster: YES})
});

});spade.register("kloudgis/core/lib/models/featuretype", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Similar to Space FeatureType
**/

KG.Featuretype = KG.Record.extend({

    label: SC.Record.attr(String),
    title_attribute: SC.Record.attr(String),

    attrtypes: SC.Record.toMany('KG.Attrtype', {
        inverse: 'featuretype',
        isMaster: NO
    }),

    geometry_type: SC.Record.attr(String),

    getDefaultGeoFromPoint: function(lon, lat) {
        var gtype = this.get('geometry_type');
        if (gtype) {
            var gt = gtype.toLowerCase();
            if (gt === 'point') {
                return {
                    coords: [{
                        x: lon,
                        y: lat
                    }],
                    centroid: {
                        x: lon,
                        y: lat
                    },
                    geo_type: 'Point'
                };
            } else {
				var offset = 0.5;
				if(KG.core_leaflet){
					//50 pixels offset
					offset = KG.core_leaflet.pixelsToWorld(100);
				}
                if (gt === 'linestring') {
                    var c1 = {
                        x: lon,
                        y: lat
                    };
                    var c2 = {
                        x: lon + offset,
                        y: lat
                    };
                    return {
                        coords: [c1, c2],
                        centroid: {
                            x: lon,
                            y: lat
                        },
                        geo_type: 'LineString'
                    };
                }
            }
        }
    }
});

});spade.register("kloudgis/core/lib/models/layer", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Layer class definition.
**/

KG.Layer = KG.Record.extend(
/** @scope CoreKG.Layer.prototype */
{
	//options
	label: SC.Record.attr(String),
    renderOrder: SC.Record.attr(Number),
    isSelectable: SC.Record.attr(Boolean),
    canRender: SC.Record.attr(Boolean),
	ft_id: SC.Record.attr(Number),
	
	//wms param
    name: SC.Record.attr(String),
    url: SC.Record.attr(String),
    visibility: SC.Record.attr(Boolean),
    buffer: SC.Record.attr(Number)
});

});spade.register("kloudgis/core/lib/models/lon_lat", function(require, exports, __module, ARGV, ENV, __filename){
/**
* A position in Longitude/Latitude. 
**/

KG.LonLat = SC.Object.extend({
	lon:null,
	lat:null,
	
	distance: function(lonLat){
		var lon1 = this.get('lon'), lat1 = this.get('lat'), lon2 = lonLat.get('lon'), lat2 = lonLat.get('lat');
		var x = (lon2-lon1);
		var y = (lat2-lat1);
		var d = Math.sqrt(x*x + y*y);
		return d;
	},
	
	distanceKm: function(lonLat){
		var lon1 = this.get('lon'), lat1 = this.get('lat'), lon2 = lonLat.get('lon'), lat2 = lonLat.get('lat');
		var R = 6371; // km
		var dLat = this.toRad(lat2-lat1);
		var dLon = this.toRad(lon2-lon1);
		var lat1 = this.toRad(lat1);
		var lat2 = this.toRad(lat2);

		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c;
		return d;
	},
	
	toRad: function(Value) {
	    /** Converts numeric degrees to radians */
	    return Value * Math.PI / 180;
	}
});

});spade.register("kloudgis/core/lib/models/note", function(require, exports, __module, ARGV, ENV, __filename){
/**
* The class for Note. A note have a position (coordinate), a title, a description, a list comments, ...
**/

KG.Note = KG.Record.extend({
	
	title: SC.Record.attr(String),
	description: SC.Record.attr(String),
	author: SC.Record.attr(Number),
	author_descriptor: SC.Record.attr(String),
	date_update: SC.Record.attr(Number),
	coordinate: SC.Record.attr(Object),
	comments: SC.Record.toMany('KG.NoteComment', {inverse: 'note', isMaster: NO}),
	
	isSelectable: YES,
	isInspectorSelectable: NO,
	
	center: function(){
		var coordinate = this.get('coordinate');
		if(!SC.none(coordinate)){
			return KG.LonLat.create({
                lon: coordinate.x,
                lat: coordinate.y
            });
		}
	}.property('coordinate'),

	authorFormatted: function() {
        var a = this.getPath('author_descriptor');
        if (a) {
            return "_author".loc(a);
        }
        return '';
    }.property('content.author_descriptor')
});

});spade.register("kloudgis/core/lib/models/note_comment", function(require, exports, __module, ARGV, ENV, __filename){

KG.NoteComment = KG.Comment.extend({
		note: SC.Record.toOne('KG.Note', {inverse: 'comments', isMaster: YES})
});


});spade.register("kloudgis/core/lib/models/note_marker", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Note marker definition.  A marker is rendered on the map.
**/

KG.NoteMarker = KG.Record.extend({

	lon: SC.Record.attr(Number),
    lat: SC.Record.attr(Number),

	tip: SC.Record.attr(String),
	
	features: SC.Record.toMany('KG.Note',{
			isMaster: YES
	}),
	
	featureCount: function(){
		return this.getPath('features.length');
	}.property('features.length'),
	
	title: function(){
		var count = this.get('featureCount');
		var title;
		if(count > 1){
			title = '_Notes'.loc(count);
		}else{
			title = '_Note'.loc();
		}
		return title;
	}.property('featureCount'),
	
	tooltip: function(){
		var tip = this.get('tip');
		if(tip){
			if(tip.charAt(0) === '_'){
				var count = this.get('featureCount');
				return tip.loc(count);
			}else{
				return tip;
			}
		}
	}.property('tip', 'featureCount')
});

});spade.register("kloudgis/core/lib/models/record", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Extend SC.Record.  For the future.
**/

KG.Record = SC.Record.extend({
	
	date_create: SC.Record.attr(Number),
	
	formattedDate: function() {
        var date = this.get('date_create');
        if (date) {
	        return KG.core_date.formatDate(date);
        }
        return '';
    }.property('date_create')
});

});spade.register("kloudgis/core/lib/models/sandbox", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Sandbox record class.
**/

KG.Sandbox = KG.Record.extend({

	name: SC.Record.attr(String),
	key: SC.Record.attr(String)	
});

});spade.register("kloudgis/core/lib/models/search_category", function(require, exports, __module, ARGV, ENV, __filename){
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

});