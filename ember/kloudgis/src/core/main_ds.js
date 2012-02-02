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
KG.SEARCH_RESULT_FEATURE_QUERY = SC.Query.remote(KG.Feature, {conditions: 'count > 0', 	version: 1});

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
