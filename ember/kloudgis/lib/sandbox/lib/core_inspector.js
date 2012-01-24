/**
* Core functions to manage the inspector.
**/
KG.core_inspector = SC.Object.create({

    _highlight: null,
    //inspector view
    _view: null,

    /* chained store to perform modifications*/
    _store: null,

    _commentsView: null,

    createFeature: function(featuretype, lon, lat) {
        this.commitModifications();
        this._store = KG.store.chain();
        var feature = this._store.createRecord(KG.Feature, {
            ft_id: featuretype.get('id'),
            geo: featuretype.getDefaultGeoFromPoint(lon, lat)
        });
        this.continueSelectFeature(feature);
    },

    selectFeature: function(feature) {
        this.commitModifications();
        this._store = KG.store.chain();
        this.continueSelectFeature(feature);
    },

    continueSelectFeature: function(feature) {
        //ember 0.9.3
        //do not re-use the comment view because it failed to clean up properly when adding a comment
        //destroy the old view and create a new one each time the feature change
        if (this._commentsView) {
            this._commentsView.destroy();
        }
        this._commentsView = Ember.View.create({
            templateName: "feature-comments",
            classNames: ["super-feature-comments"]
        });
        this._commentsView.appendTo('#comment-super-panel');

        KG.core_highlight.clearHighlight(this._highlight);
        this._highlight = KG.core_highlight.highlightFeature(feature);
        if (feature.get('status') !== SC.Record.READY_NEW) {
            feature = this._store.find(feature);
        }
        KG.inspectorController.set('feature', feature);
        KG.inspectorController.set('content', feature.getAttributes());
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
        //ember 0.9.3
        //bug with manyArray, have to delete the view before the update
        if (this._commentsView) {
            this._commentsView.destroy();
            this._commentsView = null;
        }
        if (!SC.none(this._store)) {
            this._store.commitChanges().destroy();
            this._store = null;
            var feature = KG.inspectorController.get('feature');
            KG.store.commitRecords(null, null, null, null,
            function() {
				//wait 1 sec giving some time to gwc
                setTimeout(function() {
                    KG.core_layer.getMainWMSFor(feature.get('featuretype')).forEach(function(layer) {
                        KG.core_leaflet.refreshWMSLayer(layer);
                    });
                },
                1000);
            });
        }
    },

    /**
	* Discard the changes made in the nested store.
	**/
    rollbackModifications: function() {
        //ember 0.9.3
        //bug with manyArray, have to delete the view before the update
        if (this._commentsView) {
            this._commentsView.destroy();
            this._commentsView = null;
        }
        if (!SC.none(this._store)) {
            this._store.discardChanges();
            this._store.destroy();
            this._store = null;
        }
    },

    /**
	* Fetch the comments for the active feature.
	**/
    fetchComments: function(refresh) {
        var nested_feature = KG.inspectorController.get('feature');
        if (!SC.none(nested_feature)) {
            var feature = KG.store.find(nested_feature);
            var onReady = function() {
                if (!refresh) {
                    KG.featureCommentsController.set('isLoading', YES);
                }
                var comments = feature.get('comments');
                var params = {
                    count: 0,
                    length: comments.get('length'),
                    records: []
                };
                if (params.length > 0) {
                    comments.forEach(function(comment) {
                        comment.onReady(KG.core_inspector, KG.core_inspector.commentReady, params);

                    });
                } else {
                    KG.featureCommentsController.set('isLoading', NO);
                    KG.statechart.sendAction('featureCommentsReadyEvent');
                }
            };
            if (refresh) {
                feature.refresh(YES, onReady);
            } else {
                feature.onReady(null, onReady);
            }
        }
    },

    /**
	* A comment from the active feature is READY.  If no more comment, try to continue.
	**/
    commentReady: function(comment, params) {
        params.count++;
        params.records.pushObject(comment);
        if (params.count === params.length) {
            KG.statechart.sendAction('featureCommentsReadyEvent');
            KG.featureCommentsController.set('isLoading', NO);
        }
    },

    /**
	* Create a new Comment record.
	**/
    addComment: function(comment) {
        var nested_feature = KG.inspectorController.get('feature');
        if (nested_feature) {
            var rec_comment = KG.store.createRecord(KG.FeatureComment, {
                comment: comment,
                feature: nested_feature.get('id')
            });
            //commit only this record
            KG.store.commitRecords(null, null, [rec_comment.get('storeKey')]);
            rec_comment.onReady(null,
            function() {
                nested_feature.get('comments').get('editableStoreIds').pushObject(rec_comment.get('id'));
                KG.statechart.sendAction('featureCommentsReadyEvent');
            });
        }
    },

    /**
	* Delete a commment record and commit it to the server.
	**/
    deleteComment: function(comment) {
        var nested_feature = KG.inspectorController.get('feature');
        nested_feature.get('comments').get('editableStoreIds').removeObject(comment.get('id'));
        //find the real (not nested) comment
        comment = KG.store.find(comment);
        comment.destroy();
        //commit only this record
        KG.store.commitRecords(null, null, [comment.get('storeKey')]);
    },

	deleteFeature: function(){
		var nested_feature = KG.inspectorController.get('feature');
		nested_feature.destroy();
		//commit is done after by the statechart
	}
});

//lazzy creation too speed up app launch
$(document).ready(function() {
    setTimeout(function() {
        KG.core_inspector._view = Ember.View.create({
            templateName: 'inspector'
        });
        KG.core_inspector._view.appendTo('#main-sandbox-view');
    },
    1000);
});
