CoreKG.Record = SC.Record.extend(
/** @scope CoreKG.Record.prototype */
{

    _readyQueue: null,

    onReady: function(target, method, params) {
        console.log('onReady asked for %@ %@'.fmt(this.get('id')))
        if (this.get('status') & SC.Record.READY) {
            method.call(target, this, params);
        } else {
            var queue = this._readyQueue;
            if (!this._readyQueue) {
                queue = [];
                this._readyQueue = queue;
                this.addObserver('status', this, this._onReady);
            }
			var record = this;
            queue.push(function() {
                method.call(target, record, params);
            });
        }
    },

    _onReady: function() {
        if (this.get('status') & SC.Record.READY) {
            console.log('on ready callback for %@'.fmt(this.get('id')));
            var queue = this._readyQueue;
            var idx, len;
            for (idx = 0, len = queue.length; idx < len; idx++) {
                queue[idx].call();
            }
            this.removeObserver('status', this, this._onReady);
            this._readyQueue = null;
        }
    }

});
