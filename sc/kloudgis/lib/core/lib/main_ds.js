require("sproutcore-datastore");
require("./data_sources/store");
require("./models/record");
require("./models/note");

KG.store = SC.Store.create({
    commitRecordsAutomatically: NO
}).from('KG.Store');


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

