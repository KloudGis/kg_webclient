/**
* Core functions to manage the inspector.
**/
KG.core_inspector = SC.Object.create({

    _highlight: null,

    /* chained store to perform modifications*/
    _store: null,

    selectFeature: function(feature) {
        this.commitModifications();
        this._store = KG.store.chain();
        KG.core_highlight.clearHighlight(this._highlight);
        this._highlight = KG.core_highlight.highlightFeature(feature);
        var nested_feature = this._store.find(feature);
        KG.inspectorController.set('feature', nested_feature);
        KG.inspectorController.set('content', nested_feature.getAttributes());
    },

    removeHighlight: function() {
        if (!SC.none(this._highlight)) {
            KG.core_highlight.clearHighlight(this._highlight);
            this._highlight = null;
        }
    },

    /**
	* Commit the nested store into the main store and commits all the changes to the server
	**/
    commitModifications: function() {
        if (!SC.none(this._store)) {
            this._store.commitChanges().destroy();
            this._store = null;
            KG.store.commitRecords();
        }
    },

    /**
	* Discard the changes made in the nested store.
	**/
    rollbackModifications: function() {
        if (!SC.none(this._store)) {
            this._store.discardChanges();
            this._store.destroy();
            this._store = null;
        }
    },
});
