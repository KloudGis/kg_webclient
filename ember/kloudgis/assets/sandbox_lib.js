/* ===========================================================================
   BPM Combined Asset File
   MANIFEST: kloudgis ()
   This file is generated automatically by the bpm (http://www.bpmjs.org)
   =========================================================================*/

spade.register("kloudgis/sandbox/lib/controllers/active_note", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Wrap the active note.
**/

KG.activeNoteController = SC.Object.create({
    //note
	content: null,

    marker: null,

	comments: function(){
		return this.getPath('content.comments');
	}.property('content.comments'),

 /* label and image for the create note control*/
    createLabel: "_createNote".loc(),

    titleLabel: function() {
        return "_noteTitle".loc();
    }.property(),

    descriptionLabel: function() {
        return "_noteDescription".loc();
    }.property(),

    isOldRecord: function() {
        if (this.getPath('content.status') === SC.Record.READY_NEW) {
            return NO;
        }
        return YES;
    }.property('content.status'),

    confirmLabel: function() {
        if (this.get('isOldRecord')) {
            return "_noteUpdate".loc();
        } else {
            return "_noteConfirm".loc();
        }
    }.property('isOldRecord'),

    deleteLabel: function() {
        return "_Delete".loc();
    }.property('content.status'),

    titleValue: function(key, value) {
        if (value != undefined) {
            this.get('content').set('title', value);
        }
        var val = this.getPath('content.title');
        if (!val) {
            val = '';
        }
        return val;
    }.property('content.title'),

    isDisabled: function() {
        if (this.getPath('content.status') & SC.Record.BUSY) {
            return YES;
        }
        return ! this.canEdit();
    }.property('content.status', 'content.author'),

    canEdit: function() {
        var auth = this.getPath('content.author');
        if (!auth || auth === KG.core_auth.get('activeUser').id) {
            return YES;
        }
        return NO;
    },

    isUpdateVisible: function() {
        return ! this.get('isDisabled');
    }.property('isDisabled'),

    isDeleteVisible: function() {
        var auth = this.getPath('content.author');
        if (this.getPath('content.status') !== SC.Record.READY_NEW && (!auth || auth === KG.core_auth.get('activeUser').id || KG.core_sandbox.get('isSandboxOwner'))) {
            return YES;
        }
        return NO;
    }.property('content.status', 'content.author', 'KG.core_sandbox.isSandboxOwner')

});

});spade.register("kloudgis/sandbox/lib/controllers/active_user", function(require, exports, __module, ARGV, ENV, __filename){
KG.activeUserController = Ember.Object.create({
	//user name
	name: null,
	
	activePopup: NO,

	activeUserDidChange: function(){
		if(KG.core_auth.get('activeUser')){
			this.set('name', KG.core_auth.get('activeUser').name);
		}else{
			this.set('name','');
		}
	}.observes('KG.core_auth.activeUser')
});

});spade.register("kloudgis/sandbox/lib/controllers/add_bookmark", function(require, exports, __module, ARGV, ENV, __filename){
KG.addBookmarkController = SC.Object.create({
	
	showing: NO,
	content: '',
	
	addBookmarkLabel: function(){
		return '_bookmarkDialogTitle'.loc();
	}.property(),	
	
	closeTitle: function(){
		return '_bookmarkCloseDialogTitle'.loc();
	}.property(),
	
	addLabel: function(){
		return '_bookmarkAdd'.loc();
	}.property()
	
});

});spade.register("kloudgis/sandbox/lib/controllers/bookmarks", function(require, exports, __module, ARGV, ENV, __filename){
/**
* List of KG.Bookmark
**/

KG.bookmarksController = Ember.ArrayController.create({
	content: [],
	activePopup: NO,
	editMode: NO	
	
});

});spade.register("kloudgis/sandbox/lib/controllers/comments", function(require, exports, __module, ARGV, ENV, __filename){
//super class for comments controllers (note + feature)
KG.CommentsController = Ember.ArrayController.extend({

    commentsPanelVisible: NO,
    showing: NO,
    isLoading: NO,

    //to bind 
    comments: null,

    content: function() {
        if (this.get('showing') && !this.get('isLoading')) {
            return this.get('comments');
        }
        return null;
    }.property('showing', 'comments', 'isLoading'),

    contentSize: function() {
        return this.getPath('comments.length');
    }.property('comments', 'comments.length'),

    showButtonVisible: function() {
		return this.get('commentsPanelVisible');
    }.property('commentsPanelVisible'),

    commentsLabel: function() {
        var len = this.get('contentSize');
        if (!this.get('showing')) {
            if (len === 0 || !len) {
                return "_0comment".loc();
            } else if (len === 1) {
                return "_1comment".loc();
            } else {
                return "_comments".loc(len);
            }
        } else {
            if (len === 0 || !len) {
                return "_0hideComment".loc();
            } else if (len === 1) {
                return "_1hideComment".loc();
            } else {
                return "_hideComments".loc(len);
            }
        }
    }.property('contentSize', 'showing')

});

});spade.register("kloudgis/sandbox/lib/controllers/feature_comments", function(require, exports, __module, ARGV, ENV, __filename){
/**
* List of Comments for the active feature.
**/

KG.featureCommentsController = KG.CommentsController.create({

	commentsBinding: Ember.Binding.oneWay('KG.inspectorController.feature.comments')
});

});spade.register("kloudgis/sandbox/lib/controllers/feature_delete_comment", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Wrap the comment that is marked to Delete. The user may click a button to confirm the delete.
**/

KG.featureDeleteCommentController = SC.Object.create({
	content: null,	
	
	showingDidChange: function(){
		//cleanup delete state if the comment section is closed
		if(!KG.featureCommentsController.get('showing')){
			this.set('content', null);
		}
	}.observes('KG.featureCommentsController.showing')
});

});spade.register("kloudgis/sandbox/lib/controllers/feature_new_comment", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Wrap the comment being created.
**/

KG.featureNewCommentController = SC.Object.create({
    content: null,

	showingDidChange: function(){
		//cleanup new comment if the comment section is closed
		if(!KG.featureCommentsController.get('showing')){
			this.set('content', null);
		}
	}.observes('KG.featureCommentsController.showing')
});

});spade.register("kloudgis/sandbox/lib/controllers/info", function(require, exports, __module, ARGV, ENV, __filename){
/**
* List of features found while doing a FeatureInfo.
**/

KG.infoController = Ember.ArrayController.create({
	content: [],
	
	//show/hide the other possible features 
	listVisible: NO,
	
	featureCount: function(){
		return this.getPath('content.length');
	}.property('content.length'),
	
	multipleFeatures:function(){
		return this.get('featureCount') > 1;
	}.property('featureCount'),
	
	firstFeature: function(){
		return this.getPath('content.firstObject');
	}.property('content', 'content.length'),
	
	allButFirst: function(){
		var content = this.get('content');
		if(content && content.get('length') > 0){
			var array = content.toArray();
			array.splice(0,1);
			return array;
		}else{
			return [];
		}
	}.property('content', 'content.length').cacheable()
});

});spade.register("kloudgis/sandbox/lib/controllers/inspector", function(require, exports, __module, ARGV, ENV, __filename){
/**
* List of feature attributes to render in the inspector.
**/

KG.inspectorController = Ember.ArrayController.create({
	//attributes
	content: [],
	feature: null,
	active: NO,
	
	//inspector title (top)
	title: function() {
        var f = this.get('feature');
		if(f){
			return f.get('title');
		}
    }.property('feature.title'),
	
	isDirty: function(){
		var dirty = this.getPath('feature.status') & SC.Record.DIRTY;
		return dirty > 0;
	}.property('feature.status'),
	
	cancelTitle: "_cancelInspector".loc(),
	
	saveTitle: function(){
		if(this.get('isDirty')){
			return "_saveInspectorTitle".loc();
		}else{
			"_closeInspectorTitle".loc();
		}
	}.property('isDirty'),
	
	saveLabel: function(){
		if(this.get('isDirty')){
			return "_saveInspectorLabel".loc();
		}else{
			return "_close".loc();
		}
	}.property('isDirty'),
	
	isReadOnly: function(){
		return !KG.core_sandbox.get('hasWriteAccess');
	}.property('KG.core_sandbox.hasWriteAccess'),
	
	isWriteable: function(){
		return !this.get('isReadOnly');
	}.property('isReadOnly')
});

});spade.register("kloudgis/sandbox/lib/controllers/layers", function(require, exports, __module, ARGV, ENV, __filename){
/**
* List of WMS layers
**/

KG.layersController = Ember.ArrayController.create({
	content: null
});

});spade.register("kloudgis/sandbox/lib/controllers/note_comments", function(require, exports, __module, ARGV, ENV, __filename){
/**
* List of note Comments for the active note.
**/

KG.noteCommentsController = KG.CommentsController.create({
	
	commentsBinding: 'KG.activeNoteController.comments'
});

});spade.register("kloudgis/sandbox/lib/controllers/note_delete_comment", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Wrap the comment that is marked to Delete. The user may click a button to confirm the delete.
**/

KG.noteDeleteCommentController = SC.Object.create({
	content: null,	
	
	showingDidChange: function(){
		//cleanup delete state if the comment section is closed
		if(!KG.noteCommentsController.get('showing')){
			this.set('content', null);
		}
	}.observes('KG.noteCommentsController.showing')
});

});spade.register("kloudgis/sandbox/lib/controllers/note_markers", function(require, exports, __module, ARGV, ENV, __filename){
/**
* List of note markers.
**/

KG.noteMarkersController = Ember.ArrayController.create({
	content: null
});

});spade.register("kloudgis/sandbox/lib/controllers/note_new_comment", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Wrap the comment being created.
**/

KG.noteNewCommentController = SC.Object.create({
    content: null,

	showingDidChange: function(){
		//cleanup new comment if the comment section is closed
		if(!KG.noteCommentsController.get('showing')){
			this.set('content', null);
		}
	}.observes('KG.noteCommentsController.showing')
});

});spade.register("kloudgis/sandbox/lib/controllers/notes_popup", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Multiples notes list for the popup.
**/

KG.notesPopupController = Ember.ArrayController.create({
	content: [],
	marker: null,
	popupTitle: function(){
		var m = this.get('marker');
		if(m){
			return m.get('title');
		}
		return '';
	}.property('marker')
});

});spade.register("kloudgis/sandbox/lib/controllers/notifications", function(require, exports, __module, ARGV, ENV, __filename){
/**
* List of KG.Message
**/

KG.notificationsController = Ember.ArrayController.create({
	content: [],
	
	activePopup: NO,
	
	hasNotification: function(){
		return this.get('length') > 0;
	}.property('length')
});

});spade.register("kloudgis/sandbox/lib/controllers/palette", function(require, exports, __module, ARGV, ENV, __filename){
/**
* List of featuretype available in the palette
**/

KG.paletteController = Ember.ArrayController.create({
    //featuretypes
    content: null,
    active: NO,

    isDirty: NO,

    /* label and image for the create note control*/
    createLabel: "_showPalette".loc(),

    isAvailable: function() {
        return KG.core_sandbox.get('hasWriteAccess');
    }.property('KG.core_sandbox.hasWriteAccess')
});

});spade.register("kloudgis/sandbox/lib/controllers/search", function(require, exports, __module, ARGV, ENV, __filename){
/**
* List of Search categories upon search request.
**/

KG.searchController = Ember.ArrayController.create({
	content: [],
	searchHistorySize: 5,
	searchValue: null,
	activePopup: NO,
	
	hasResults: function(){
		return this.getPath('content.length') > 0;
	}.property('content.length')
	
});

});spade.register("kloudgis/sandbox/lib/controllers/search_results", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Features found on search category selection.
**/

KG.searchResultsController = Ember.ArrayController.create({
    content: [],
    closeLabel: "_closeSearch".loc(),
    listVisible: NO,
    category: null,
    plugin: null,

    listTitle: function() {
        if (SC.none(this.get('content'))) {
            return '';
        } else {
            var cat = this.get('category');
            if (SC.none(cat)) {
                var plugin = this.get('plugin');
                if (!SC.none(plugin)) {
                    return "_searchResult".loc(this.getPath('content.length'), plugin.get('searchValue'), plugin.get('pluginName'));
                }
            } else {
                return "_searchResult".loc(this.getPath('content.length'), cat.get('search'), cat.get('title'));
            }
        }
    }.property('content.length'),

    hasResults: function() {
        return this.getPath('content.length') > 0;
    }.property('content.length'),

    hasMoreResults: function() {
        var cat = this.get('category');
        if (cat) {
            var block = this.getPath('category.queryBlock');
            if (block) {
                var total = block.get('start') + block.get('resultSize');
                if (total < cat.get('count') && block.get('resultSize') > 0) {
					return YES;
				}
            }
        }
		return NO;
    }.property('category.queryBlock'),

	nextBlockStart: function(){
		var block = this.getPath('category.queryBlock');
		if(block){
			return block.get('start') + block.get('resultSize');
		}
		return 0;
	}.property('category.queryBlock')

})

});spade.register("kloudgis/sandbox/lib/controllers/send_notification", function(require, exports, __module, ARGV, ENV, __filename){
KG.sendNotificationController = SC.Object.create({
	
	showing: NO,
	content: '',
	sendOnEnterValue: YES,
	feedbackMessage: '',
	
	pendingNotification: null,
	
	notificationLabel: function(){
		return '_notificationSendText'.loc();
	}.property(),
	
	sendLabel: function(){
		return '_notificationSendButton'.loc();
	}.property(),
	
	sendOnEnterTooltip: function(){
		return '_sendOnEnterTooltip'.loc();
	}.property(),
	
	hasNotificationPending: function(){
		return !SC.none(this.get('pendingNotification'));
	}.property('pendingNotification')
	
});

});spade.register("kloudgis/sandbox/lib/core_bookmark", function(require, exports, __module, ARGV, ENV, __filename){
KG.core_bookmark = SC.Object.create({

    loadBookmarks: function() {
        var bm = KG.store.find(KG.BOOKMARK_QUERY);
        KG.bookmarksController.set('content', bm);
        bm.onReady(this, this._bmReady);
    },

	refreshBookmarks: function(){
		 KG.bookmarksController.get('content').refresh();
	},

    _bmReady: function(bookmarks) {
        //?
    },

    gotoBookmark: function(bm) {
        if (bm) {
            var c = bm.get('center');
            var zoom = bm.get('zoom');
            if (c) {
                var lonLat = KG.LonLat.create({
                    lon: c.x,
                    lat: c.y
                });
                KG.core_leaflet.setCenter(lonLat, zoom);
            }
        }
    },

    deleteBookmark: function(bookmark) {
        if (bookmark) {
            var storeKey = bookmark.get('storeKey');
            bookmark.destroy();
            KG.store.commitRecords(null, null, [storeKey]);
        }
    },

	addBookmark: function(label, centerLonLat, zoom){
		var c = {x: centerLonLat.get('lon'), y: centerLonLat.get('lat')};
		var newBm = KG.store.createRecord(KG.Bookmark, {label: label, center: c, zoom: zoom});
		//commit only this record
        KG.store.commitRecords(null, null, [newBm.get('storeKey')]);
	}
});

});spade.register("kloudgis/sandbox/lib/core_info", function(require, exports, __module, ARGV, ENV, __filename){
//predefined queries

/**
* Core functions to perform feature info.
**/

KG.core_info = SC.Object.create({

    limit_query: 10,

    highlight: null,

    _finding: NO,
    _timeout: null,

    findFeaturesAt: function(lonLat) {
        if (this._finding) {
            if (this._timeout) {
                clearTimeout(this._timeout);
            }
            var self = this;
            this._timeout = setTimeout(function() {
				var status = KG.infoController.getPath('content.status');
                if (!status || SC.Record.ERROR) {
                    self._finding = NO;
                }
                self.findFeaturesAt(lonLat);
            },
            1000);
            return NO;
        }
        this._finding = YES;
        var onePixel = KG.core_leaflet.pixelsToWorld(1);
        var sLayers = KG.core_layer.getLayersSelection();
        var layers = sLayers.map(function(item, index, self) {
            return item.get('id');
        }).join(',');
        if (KG.infoController.get('content') && KG.infoController.get('content').destroy) {
            var content = KG.infoController.get('content');
            content.destroy();
            console.log('info controller did destroy content');
        }
        if (layers.length > 0) {
			KG.INFO_QUERY.lat = lonLat.get('lat');
			KG.INFO_QUERY.lon = lonLat.get('lon');
		    KG.INFO_QUERY.one_pixel = onePixel;
		 	KG.INFO_QUERY.limit_query = this.get('limit_query');
		 	KG.INFO_QUERY.layers = layers;           
            var records = KG.store.find(KG.INFO_QUERY);
            KG.infoController.set('content', records);
            records.onReady(this, this.infoReady);
        } else {
            console.log('No valid layer to do a F_INFO');
            KG.infoController.set('content', []);
        }
		this.clearViewInfo();
    },

    infoReady: function(records) {
        records.offReady();
        if (records.get('length') > 0) {
            KG.statechart.sendAction('featureInfoReady');
        }
        if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }
        this._finding = NO;
    },

    showInfoPopup: function() {
        var records = KG.infoController.get('content');
        if (records.get('length') > 0) {
			var center = records.getPath('firstObject.center');
            if (center) {
				this.clearViewInfo();
				if (SC.none(this._div_info)) {
		            this._div_info = document.createElement('div');         
		        }
                var div = this._div_info;
				this._view_info = SC.View.create({
		            templateName: 'info-popup',
					classNames:['super-info-popup']
		        });
		        this._view_info.appendTo(div);
				setTimeout(function(){KG.core_leaflet.showPopupInfo(center, div);},1);               
            }
        }

    },

    hideInfoPopup: function() {
        KG.core_leaflet.closePopup();
		this.clearViewInfo();
    },

    expandPopupDidChange: function() {
        setTimeout(function() {
            KG.core_leaflet.updatePopupInfo();
        },
        1);
    }.observes('KG.infoController.listVisible'),

	clearViewInfo: function(){
		if(!SC.none(this._view_info)){
			this._view_info.destroy();
		}
	}
});

});spade.register("kloudgis/sandbox/lib/core_inspector", function(require, exports, __module, ARGV, ENV, __filename){
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

});spade.register("kloudgis/sandbox/lib/core_layer", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Core functions to manage the layers
**/

KG.core_layer = SC.Object.create({

    loadLayers: function() {
        var layers = KG.store.find(KG.LAYER_QUERY);
        KG.layersController.set('content', layers);
        layers.onReady(this, this._layersReady);
    },

    _layersReady: function(layers) {
        //FIXME: sortProperty is not yet implemented in beta3
        var ordered = layers; //layers.sortProperty('renderOrder'); 
        ordered.filterProperty('visibility', YES).filterProperty('canRender', YES).forEach(function(layer) {
            KG.core_leaflet.addWMSLayer(layer);
        });
    },

    cleanUp: function() {
        var layers = KG.layersController.get('content');
        if (layers) {
            layers.forEach(function(lay) {
                KG.core_leaflet.removeLayer(lay)
            });
        }
    },

    getLayersSelection: function() {
        var layers = KG.layersController.get('content');
        if (!SC.none(layers) && layers.get('length') > 0) {
            var sel = layers.filterProperty('visibility', YES).filterProperty('isSelectable', YES);
            return sel;
        }
        return [];
    },

    /* Return the main layer if there is at least one visible layer matched the featureytpe*/
    getMainWMSFor: function(featuretype) {
        var layers = KG.layersController.get('content');
        if (!SC.none(layers) && layers.get('length') > 0) {
            if (layers.filterProperty('visibility', YES).filterProperty('ft_id', featuretype.get('id')).get('length') > 0) {
                return layers.filterProperty('name', KG.get('activeSandboxKey'));
            }
        }
        return [];
    }

});

});spade.register("kloudgis/sandbox/lib/core_note", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Core functions to manage the Notes
**/

KG.core_note = SC.Object.create({

    /* cache for refreshMarkers*/
    _bounds: null,
    _zoom: null,

    /* elements for the active note view*/
    _view_active_note: null,
    _new_note_marker: null,

    /* SC view to generate html bind on the  KG.notesPopupController*/
    _view_multiple_notes: null,

    /* chained store to perform modifications*/
    _store: null,

    //feature to use to create a new note
    featureTemplate: null,

    _removeOnCloseMarker: null,

    /**
	* Create a nested store with chain() to start doing modifications
	**/
    beginModifications: function() {
        this.rollbackModifications();
        this._store = KG.store.chain();
        var note = KG.activeNoteController.get('content');
        if (!SC.none(note) && note.get('status') !== SC.Record.READY_NEW) {
            KG.activeNoteController.set('content', this._store.find(note));
        }
    },

    /**
	* Commit the nested store into the main store and commits all the changes to the server
	**/
    commitModifications: function(callback) {
        var note = KG.activeNoteController.get('content');
        if (note) {
            if (note.get('status') !== SC.Record.READY_NEW) {
                note = KG.store.find(note);
            }
            this._store.commitChanges().destroy();
            this._store = null;
            KG.store.commitRecords();
            if (callback) {
                //set a timeout because the status is already READY otherwise (BUSY_COMMINTING not yet set)
                setTimeout(function() {
                    note.onReady(null, callback);
                },
                1);
            }
        }
    },

    /**
	* Discard the changes made in the nested store.
	**/
    rollbackModifications: function() {
        if (this._store) {
            this._store.discardChanges();
            this._store.destroy();
            this._store = null;
        }
    },

    /**
	* The user quit the not edtion view.  Rollback the unsaved changes and clean up.
	**/
    postEdition: function() {
        this.rollbackModifications();
        if (this._highlightMarker) {
            KG.core_leaflet.removeMarker(this._highlightMarker);
        }
        this.cleanUpActiveNoteElements();
    },

    /**
	* Zoom and center the map on the active note
	**/
    zoomActiveNote: function() {
        var note = KG.activeNoteController.get('content');
        if (note) {
            var coord = note.get('coordinate');
            if (coord) {
                KG.core_leaflet.closePopup();
                KG.core_leaflet.setCenter(KG.LonLat.create({
                    lon: coord.x,
                    lat: coord.y
                }), 14);
            }
        }
    },

    /**
	* Create a temp marker to let the user drag it to the wanted position
	**/
    locateNote: function() {
        this.cancelLocateNote();
        var center = KG.core_leaflet.getCenter();
        var options = {
            title: "_newNote".loc(),
            animated: YES,
            iconPath: 'resources/images/new_marker.png',
            draggable: YES,
            popupContent: "_moveNote".loc(),
            openPopup: YES,
            dragendTarget: this,
            dragendCb: this.markerDragged,
            injectGetNativePositionFunction: YES
        };
        var marker = this.createTempMarker();
        this._new_note_marker = KG.core_leaflet.addMarker(marker, center.get('lon'), center.get('lat'), options);
        return YES;
    },

	createTempMarker:function(){
		var marker = Ember.Object.create({
            lon: function() {
                return this.getNativePosition().get('lon');
            }.property(),
            lat: function() {
                return this.getNativePosition().get('lat');
            }.property()
        });
		return marker;
	},

    /**
	* Cancel locate note : Remove the temp marker
	**/
    cancelLocateNote: function() {
        if (!SC.none(this._new_note_marker)) {
            KG.core_leaflet.removeMarker(this._new_note_marker);
            this._new_note_marker = null;
        }
    },

    /**
	* Create a new note record and activate it.
	**/
    createNote: function() {
        this.beginModifications();
        var note;
        if (!SC.none(this.get('featureTemplate'))) {
            var feature = this.get('featureTemplate');
            var center = feature.get('center');
            if (!SC.none(center) && center.get('lon') && center.get('lat')) {
                note = this._store.createRecord(KG.Note, {
                    coordinate: {
                        x: feature.get('center').get('lon'),
                        y: feature.get('center').get('lat'),
                    },
                    description: feature.get('title')
                });
                var lon = feature.get('center').get('lon');
                var lat = feature.get('center').get('lat');
                var options = {
                    title: "_newNote".loc(),
                    animated: YES,
                    iconPath: 'resources/images/new_marker.png',
                    draggable: YES,
                    dragendTarget: this,
                    dragendCb: this.markerDragged,
                	injectGetNativePositionFunction: YES
		        };
		        var marker = this.createTempMarker();
                this._new_note_marker = KG.core_leaflet.addMarker(marker, lon, lat, options);
            }
        } else {
            if (this._new_note_marker) {
                note = this._store.createRecord(KG.Note, {
                    coordinate: {
                        x: this._new_note_marker.get('lon'),
                        y: this._new_note_marker.get('lat')
                    }
                });
            }
        }
        if (note) {
            var marker = this._new_note_marker;
            this.activateNote(note, {
                marker: marker
            });
        } else {
            KG.statechart.sendAction('cancelCreateNoteAction');
        }
    },

    /**
	* Cleanup the temp marker used to locate the new note and other resources.
	**/
    clearCreateNote: function() {
        if (!SC.none(this._new_note_marker)) {
            KG.core_leaflet.removeMarker(this._new_note_marker);
            this._new_note_marker = null;
            this.set('featureTemplate', null);
        }
        this.cleanUpActiveNoteElements();
    },

    /**
	* attempt to activate a note.  If not fresh, the note is refreshed before.
	**/
    activateNote: function(inNote, params) {
        if (!inNote) {
            return NO;
        }
        if (inNote.get('status') === SC.Record.READY_NEW || params.isFresh) {
            this.continueActivateNote(inNote, params.marker);
        } else {
            inNote.refresh(YES,
            function() {
                KG.core_note.continueActivateNote(inNote, params.marker)
            });
        }
        return YES;
    },

    /**
	* activate note is accepted, set the active note controller and show the popup marker
	**/
    continueActivateNote: function(note, marker) {
        this.cleanUpActiveNoteElements();
        var noteDiv = document.createElement('div');
        this._view_active_note = SC.View.create({
            templateName: 'active-note-popup',
        });
        this._view_active_note.appendTo(noteDiv);
        KG.activeNoteController.set('marker', marker);
        KG.activeNoteController.set('content', note);
        if (KG.activeNoteController.canEdit()) {
            console.log('note is draggable');
            KG.core_leaflet.enableDraggableMarker(marker);
        }
        setTimeout(function() {
            if (!SC.none(marker)) {
                KG.core_leaflet.showPopupMarker(marker, noteDiv);
            }
        },
        1);
    },

    /**
	* cleanup the view used to render the active note.
	**/
    cleanUpActiveNoteElements: function() {
        if (!SC.none(this._view_active_note)) {
            this._view_active_note.destroy();
            this._view_active_note = null;
        }
    },

    /**
	* cleanup the view used to render the active note.
	**/
    cleanUpMultipleNotesElements: function() {
        if (!SC.none(this._view_multiple_notes)) {
            this._view_multiple_notes.destroy();
            this._view_multiple_notes = null;
        }
    },

    setHighlightMarker: function(marker) {
        this._highlightMarker = marker;
    },

    /**
	* More then one note to activate. Show a list of notes.
	**/
    activateMultipleNotes: function(notes, marker) {
        this.cleanUpMultipleNotesElements();
        KG.notesPopupController.set('marker', marker);
        KG.notesPopupController.set('content', notes);
        var div = document.createElement('div');
        this._view_multiple_notes = SC.View.create({
            templateName: 'multiple-notes-popup',
        });
        this._view_multiple_notes.appendTo(div);
        setTimeout(function() {
            KG.core_leaflet.showPopupMarker(marker, div);
        },
        1);
    },

    /**
	* The user hit the Create or Update button. 
	**/
    confirmCreateNote: function() {
        var note = KG.activeNoteController.get('content');
        note = KG.store.find(note);
        note.onReady(null,
        function() {
            KG.core_note.refreshMarkers(YES);
        });
    },

    /**
	* The user hit the Delete button.
	**/
    deleteActiveNote: function() {
        var note = KG.activeNoteController.get('content');
        if (note) {
            var origin_note = KG.store.find(note);
            origin_note.onDestroyedClean(null,
            function() {
                console.log('destroyed completed');
                KG.core_note.refreshMarkers(YES);
            })
            note.destroy();
        }
    },

	removeAllMarkers: function(){		
		var content = KG.noteMarkersController.get('content');
		if(content){
			content.forEach(function(marker){
				KG.core_leaflet.removeMarker(marker);
                var rtype = marker.get('store').recordTypeFor(marker.get('storeKey'));
                KG.store.unloadRecord(rtype, marker.get('id'));
			});
			content.destroy();
		}
	},

    /**
	* flush and recalculate the note clusters
	**/
    refreshMarkers: function(force) {
        var bounds = KG.core_leaflet.getBounds();
        var zoom = KG.core_leaflet.getZoom();
        if (force || SC.none(this._zoom) || this._zoom != zoom || SC.none(this._bounds) || !this._bounds.contains(bounds)) {
	        console.log('Refresh markers, Force:' + force);
            var fatBounds = KG.core_leaflet.getFatBounds();
            var dist = KG.core_leaflet.pixelsToWorld(20); //cluster within 20 pixels
            var currentMarkers = [];
            if (KG.noteMarkersController.get('content')) {
                var content = KG.noteMarkersController.get('content');
                currentMarkers = content.toArray();
                content.destroy();
            }
            KG.NOTE_MARKER_QUERY.fat_bounds = fatBounds;
            KG.NOTE_MARKER_QUERY.distance = dist;
            var newMarkers = KG.store.find(KG.NOTE_MARKER_QUERY);
            newMarkers.onReady(this, this.markersReady, {
                olds: currentMarkers
            });
            KG.noteMarkersController.set('content', newMarkers);
            this._bounds = fatBounds;
            this._zoom = zoom;
            return YES;
        }
        return NO;
    },

    /**
	* Markers from the server are now READY
	**/
    markersReady: function(markers, params) {
        markers.offReady();
        KG.notesPopupController.set('marker', null);

        params.olds.forEach(function(old) {
            if (markers.indexOf(old) !== -1) {
                //remove the shadow but keep the markers because it is still visible - will be removed on insert of the new one
                KG.core_leaflet.removeShadow(old);
            } else {
                //completly remove the marker - not good anymore
                KG.core_leaflet.removeMarker(old);
                var rtype = old.get('store').recordTypeFor(old.get('storeKey'));
                KG.store.unloadRecord(rtype, old.get('id'));
            }
        });
        var i;
        var len = markers.get('length');
        for (i = 0; i < len; i++) {
            var marker = KG.noteMarkersController.objectAt(i);
            if (marker) {
                //add the marker - If the marker was already visible, it replace it (remove the old one)
                var iconPath = undefined;
                if (marker.get('featureCount') > 1) {
                    iconPath = 'resources/images/group_marker.png';
                }
                var options = {
                    title: marker.get('tooltip'),
                    animated: NO,
                    iconPath: iconPath,
                    draggable: NO,
                    clickTarget: this,
                    clickCb: this.markerClicked,
                    dragendTarget: this,
                    dragendCb: this.markerDragged
                };
                KG.core_leaflet.addMarker(marker, marker.get('lon'), marker.get('lat'), options);
            }
        }
        //readd the hl marker if any (to put it on top)
        if (this._highlightMarker) {
            KG.core_leaflet.reAddMarker(this._highlightMarker);
        }
    },

    /**
	* The user just click a marker.
	**/
    markerClicked: function(marker) {
        KG.statechart.sendAction('clickMarkerAction', marker);
    },

    /**
	* The user just drag a marker. 
	**/
    markerDragged: function(marker, lon, lat) {
        KG.statechart.sendAction('markerDragEnded', lon, lat);
    },

    /**
	* Find the notes bind to this marker and wait until its READY.
	**/
    continueMarkerClicked: function(marker) {
        if (SC.none(marker)) {
            return NO;
        }
        var notes = marker.get('features');
        var len = notes.get('length');
        var params = {
            count: 0,
            length: len,
            marker: marker
        }
        for (i = 0; i < len; i++) {
            var note = notes.objectAt(i);
            params.isFresh = note.get('status') & SC.Record.BUSY;
            if (note.get('status') === SC.Record.ERROR) {
                note.refresh(YES,
                function() {
                    KG.core_note.noteReady(note, params);
                });
            } else {
                note.onReady(this, this.noteReady, params);
            }
        }
    },

    /**
	* A note from the marker is READY.  If no more note, try to continue.
	**/
    noteReady: function(note, params) {
        params.count++;
        if (params.count === params.length) {
            if (params.count === 1) {
                KG.statechart.sendAction('noteSelectedAction', note, params);
            } else {
                KG.statechart.sendAction('multipleNotesSelectedAction', params.marker.get('features'), params.marker);
            }
        }
    },

    /**
	* Fetch the comments for the active note.
	**/
    fetchComments: function(refresh) {
        var nested_note = KG.activeNoteController.get('content');
        if (!SC.none(nested_note)) {
            var note = KG.store.find(nested_note);
            var onReady = function() {
                if (!refresh) {
                    KG.noteCommentsController.set('isLoading', YES);
                }
                var comments = note.get('comments');
                var params = {
                    count: 0,
                    length: comments.get('length'),
                    records: []
                };
                if (params.length > 0) {
                    console.log('comments count:' + params.length);
                    comments.forEach(function(comment) {
                        comment.onReady(KG.core_note, KG.core_note.commentReady, params);

                    });
                } else {
                    console.log('NO comments');
                    KG.noteCommentsController.set('isLoading', NO);
                    KG.statechart.sendAction('noteCommentsReadyEvent');
                }
            };
            if (refresh) {
                note.refresh(YES, onReady);
            } else {
                note.onReady(null, onReady);
            }
        }
    },

    /**
	* A comment from the active note is READY.  If no more comment, try to continue.
	**/
    commentReady: function(comment, params) {
        params.count++;
        params.records.pushObject(comment);
        if (params.count === params.length) {
            KG.statechart.sendAction('noteCommentsReadyEvent');
            KG.noteCommentsController.set('isLoading', NO);
        }
    },

    /**
	* Create a new Comment record.
	**/
    addCommentToActiveNote: function(comment) {
        var nested_note = KG.activeNoteController.get('content');
        if (nested_note) {
            var rec_comment = KG.store.createRecord(KG.NoteComment, {
                comment: comment,
                note: nested_note.get('id')
            });
            //commit only this record
            KG.store.commitRecords(null, null, [rec_comment.get('storeKey')]);
            rec_comment.onReady(null,
            function() {
                nested_note.get('comments').get('editableStoreIds').pushObject(rec_comment.get('id'));
                KG.statechart.sendAction('noteCommentsReadyEvent');
            });
        }
    },

    /**
	* Delete a commment record and commit it to the server.
	**/
    deleteComment: function(comment) {
        var nested_note = KG.activeNoteController.get('content');
        nested_note.get('comments').get('editableStoreIds').removeObject(comment.get('id'));
        comment.destroy();
        //commit only on record
        KG.store.commitRecords(null, null, [comment.get('storeKey')]);
    },

    updatePosition: function(lon, lat) {
        KG.activeNoteController.get('content').set('coordinate', {
            x: lon,
            y: lat
        });
        /*var marker = KG.activeNoteController.get('marker');
        var dataHash = KG.store.readDataHash(marker.get('storeKey'));
		dataHash.lat = lat;
		dataHash.lon = lon;
		KG.store.pushRetrieve(null, null, dataHash, marker.get('storeKey'));*/
        KG.core_leaflet.updatePopupMarkerPosition(lon, lat);
    }
});

});spade.register("kloudgis/sandbox/lib/core_notification", function(require, exports, __module, ARGV, ENV, __filename){
//must include jquery.atmosphere.js ext dependency
KG.core_notification = SC.Object.create({

    connectedEndpoint: null,
    callbackAdded: NO,
    postCallbackAdded: NO,

    listen: function() {
        var sandbox = KG.get('activeSandboxKey');
        var location = KG.get('serverHost') + 'api_notification/general?sandbox=%@'.fmt(sandbox);
        //close active if any to avoid multiple open stream
        this.stopListen();
        $.atmosphere.subscribe(location, !this.callbackAdded ? this.atmosphereCallback: null, $.atmosphere.request = {
            transport: 'streaming',
            //enable websocket when tomcat (server side) supports it
            //	transport: 'websocket',
            headers: KG.core_auth.createAjaxRequestHeaders()
        });
        this.callbackAdded = YES;
        this.connectedEndpoint = $.atmosphere.response;
        //renew the listen after 8 hours
        this.timerId = setTimeout(function() {
            KG.core_notification.listen();
        },
        8 * 60 * 60 * 1000);
    },

    stopListen: function() {
        $.atmosphere.close();
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
    },

    atmosphereCallback: function(response) {
        // Websocket events.
        $.atmosphere.log('info', ["response.state: " + response.state]);
        $.atmosphere.log('info', ["response.transport: " + response.transport]);
        $.atmosphere.log('info', ["response.status: " + response.status]);

        detectedTransport = response.transport;
        if (response.transport != 'polling' && response.state != 'connected' && response.state != 'closed' && response.state != 'messagePublished') {
            $.atmosphere.log('info', ["response.responseBody: " + response.responseBody]);
            if (response.status == 200) {
                var data = response.responseBody;
                if (!data || data.charAt(0) !== '{') {
                    console.log('Message ignored - Must be JSON format');
                } else {
                    try {
                        var oData = JSON.parse(data);
                        var messageData = KG.Message.create(oData);
                        if (messageData.get('author') !== KG.core_auth.get('activeUser').user) {
							
                            if (messageData.get('type') === 'text') {				//text message (Chat)
                                KG.notificationsController.insertAt(0, messageData);
                            } else if (messageData.get('type') === 'note') {		//message related to Note
                                KG.core_note.refreshMarkers(YES);
                            } else if (messageData.get('type') === 'note_comment') {//message related to Note Comment
                                var aNote = KG.activeNoteController.get('content');
                                if (!SC.none(aNote) && aNote.get('id') === messageData.getPath('content.note_id')) {
									//reload the comments if the change is for the active note
                                    KG.core_note.fetchComments(YES);
                                }
                            } else if (messageData.get('type') === 'bookmark') {	//message related to Bookmark
								if(messageData.getPath('content.modif_type') === 'delete'){
									KG.store.unloadRecord(KG.Bookmark, messageData.getPath('content.id'));
								}
                                KG.statechart.sendAction('refreshBookmarkAction');
                            }
                        } else {//message from current user: Confirmation feedback
                            KG.statechart.sendAction('notificationSent', messageData);
                        }
                    } catch(e) {
                        console.log('NOTIFICATION: ' + e);
                    }
                }
            }
        }
    },

    postMessage: function(
    /*KG.Message*/
    message) {
        if (!this.connectedEndpoint) {
            return NO;
        }
        var sandbox = KG.get('activeSandboxKey');
        var location = KG.get('serverHost') + 'api_notification/general?sandbox=%@'.fmt(sandbox);
        this.connectedEndpoint.push(location, null, $.atmosphere.request = {
            data: JSON.stringify(message.toDataHash()),
            headers: KG.core_auth.createAjaxRequestHeaders()
        });

        return YES;
    }

});

});spade.register("kloudgis/sandbox/lib/core_palette", function(require, exports, __module, ARGV, ENV, __filename){
KG.core_palette = Ember.Object.create({
    //palette view
    _view: null,
    _paletteMarker: null,

    createFeature: function(paletteItem) {
        //wipe previous marker, if any
        this.clearCreateFeature();
        var center = KG.core_leaflet.getCenter();
        var marker = Ember.Object.create({
            paletteItem: paletteItem
        });
        this._paletteMarker = marker;
        var options = {
            title: paletteItem.get('title'),
            animated: YES,
            iconPath: 'resources/images/palette_marker.png',
            draggable: YES,
            popupContent: "_moveFeature".loc(paletteItem.get('label')),
            openPopup: YES,
            dragendTarget: this,
            dragendCb: this.markerDragged,
            injectGetNativePositionFunction: YES
        };
        KG.core_leaflet.addMarker(marker, center.get('lon'), center.get('lat'), options);
        KG.paletteController.set('isDirty', YES);
    },

    clearCreateFeature: function() {
        if (!Ember.none(this._paletteMarker)) {
            KG.core_leaflet.removeMarker(this._paletteMarker);
            this._paletteMarker = null;
        }
        KG.paletteController.set('isDirty', NO);
    },

    markerDragged: function(marker, lon, lat) {
        KG.statechart.sendAction('paletteMarkerDragEnded', {
            paletteItem: marker.paletteItem,
            lon: lon,
            lat: lat
        });
    }
});

//lazzy creation too speed up app launch
$(document).ready(function() {
    setTimeout(function() {
        KG.core_palette._view = Ember.View.create({
            templateName: 'palette'
        });
        KG.core_palette._view.appendTo('#main-sandbox-view');
    },
    1000);
});

});spade.register("kloudgis/sandbox/lib/core_sandbox", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Core functions for the Sandbox page
**/

KG.core_sandbox = SC.Object.create({

    sandboxMeta: {},
    membership: null,
    isSandboxOwner: NO,

	sandboxLabel: '',
    mousePosition: null,
	mapAdded: NO,
	
	cleanUp:function(){
		this.set('sandboxMeta', {});
		this.set('membership', null);
		this.set('isSandboxOwner', NO);
		this.set('sandboxLabel', '');
		this.set('mousePosition', null);
		
		KG.store.unloadRecords(KG.FeatureType);
		KG.store.unloadRecords(KG.AttrType);
		KG.store.unloadRecords(KG.Bookmark);
		KG.store.unloadRecords(KG.Feature);	
		KG.core_layer.cleanUp();
		KG.store.unloadRecords(KG.Layer);
		KG.core_note.removeAllMarkers();
		KG.store.unloadRecords(KG.Note);
		KG.store.unloadRecords(KG.NoteMarker);
		this.setCenter(null,null);
		//FIXME: Use of a state to manage the popup ?
		KG.activeUserController.set('activePopup', NO);
		
		this._clearRecordArray(KG.bookmarksController.get('content'));
		this._clearRecordArray(KG.layersController.get('content'));
		this._clearRecordArray(KG.paletteController.get('content'));
		this._clearRecordArray(KG.searchController.get('content'));
	},
	
	_clearRecordArray: function(rarray){
		if(!Ember.none(rarray) && rarray.destroy){
			rarray.destroy();
		}
	},

    setCenter: function(lonLat, zoom) {
		if(!lonLat){
			window.location.hash=''
		}else{
        	window.location.hash = 'sb:%@;lon:%@;lat:%@;zoom:%@'.fmt(KG.get('activeSandboxKey'), lonLat.get('lon').toFixed(4), lonLat.get('lat').toFixed(4), zoom);
		}
    },

    authenticate: function() {
        var success = KG.core_auth.load(this, this.authenticateCallback);
        return success;
    },

    authenticateCallback: function(message) {
        if (message === "_success") {
            //attempt to login to map service first to make the map rendering ready quickly
            $.ajax({
                type: 'POST',
                url: KG.get('serverHost') + 'api_map/public/login?sandbox=%@'.fmt(KG.get('activeSandboxKey')),
                dataType: 'json',
                headers: KG.core_auth.createAjaxRequestHeaders(),
                contentType: 'application/json; charset=utf-8',
                context: this,
                error: function(jqXHR, textStatus, errorThrown) {
                    SC.Logger.error('Map login error: HTTP error status code: ' + jqXHR.status);
                },
                success: function(data, textStatus, jqXHR) {
                    console.log('Map login success.');
                    KG.statechart.sendAction('mapLoginSucceeded', this);
                },
                async: YES
            });
            KG.statechart.sendAction('authenticationSucceeded', this);
        } else {
            KG.statechart.sendAction('authenficationFailed', this);
        }
    },

    membershipCheck: function() {
        $.ajax({
            type: 'GET',
            url: KG.get('serverHost') + 'api_data/protected/members/logged_member?sandbox=%@'.fmt(KG.get('activeSandboxKey')),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            headers: KG.core_auth.createAjaxRequestHeaders(),
            context: this,
            error: function(jqXHR, textStatus, errorThrown) {
                SC.Logger.error('Membership error: HTTP error status code: ' + jqXHR.status);
                KG.statechart.sendAction('membershipFailed', this);
            },
            success: function(data, textStatus, jqXHR) {
                console.log('SB Meta success.');
                this.set('membership', data);
                KG.statechart.sendAction('membershipSucceeded', this);
            },
            async: YES
        });
    },

    fetchSandboxMeta: function() {
        $.ajax({
            type: 'GET',
            url: KG.get('serverHost') + 'api_sandbox/protected/sandboxes/%@/meta'.fmt(KG.get('activeSandboxKey')),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            headers: KG.core_auth.createAjaxRequestHeaders(),
            context: this,
            error: function(jqXHR, textStatus, errorThrown) {
                SC.Logger.error('SB Meta error: HTTP error status code: ' + jqXHR.status);
                if (KG.statechart) {
                    KG.statechart.sendAction('httpError', jqXHR.status);
                }
            },
            success: function(data, textStatus, jqXHR) {
                console.log('SB Meta success.');
                this.set('sandboxMeta', data);
                var lat = data.lat;
                var lon = data.lon;
                var zoom = data.zoom;
                var hash = this.extractHashValues();
                if (!hash['lon']) {
                    if (lat && lon) {
                        KG.core_leaflet.setCenter(KG.LonLat.create({
                            lon: lon,
                            lat: lat
                        }), zoom);
                    }
                }
            },
            async: YES
        });
    },

    metaDidChange: function() {
        console.log('Meta changed.');
        KG.core_sandbox.set('sandboxLabel', this.get('sandboxMeta').name);
        this.set('isSandboxOwner', KG.core_auth.get('activeUser').id === this.get('sandboxMeta').owner)
    }.observes('sandboxMeta'),

    extractHashValues: function() {
        var hashLoc = window.location.hash;
        if (hashLoc && hashLoc.length > 0) {
            var tokens = hashLoc.split(';');
            if (tokens.length === 4) {
                return {
                    lon: parseFloat(tokens[1].substring(4)),
                    lat: parseFloat(tokens[2].substring(4)),
                    zoom: parseInt(tokens[3].substring(5))
                }
            }
        }
        return {};
    },

    addMap: function() {
        var hash = this.extractHashValues();
		if(this.get('mapAdded')){
			if(hash.lon && hash.lat){
				KG.core_leaflet.setCenter(KG.LonLat.create({lon:hash.lon, lat:hash.lat}), hash.zoom);
			}
		}else{
			this.set('mapAdded', YES);
        	KG.core_leaflet.addToDocument(hash.lon, hash.lat, hash.zoom);	
		}
    },

    createNote: function() {
        KG.statechart.sendAction('createNoteAction');
    },

    latitudeLabel: function() {
        var pos = this.get('mousePosition');
        if (pos) {
            return 'Lat: %@'.fmt(pos.get('lat').toFixed(4));
        } else {
            return 'Lat: ?';
        }
    }.property('mousePosition'),

    longitudeLabel: function() {
        var pos = this.get('mousePosition');
        if (pos) {
            return 'Lon: %@'.fmt(pos.get('lon').toFixed(4));
        } else {
            return 'Lon: ?';
        }
    }.property('mousePosition'),

    autosize: function(element, options) {
        if (!options) {
            options = {
                extraSpace: 20
            };
        }
        var el = $(element);
        if (el[0]) {
            el.autoResize(options);
        } else {
            setTimeout(function() {
                var el = $(element);
                if (el[0]) {
                    el.autoResize(options);
                }
            },
            300);
        }
    },

    destroyAutosize: function(element) {
        var autoR = $(element).data('AutoResizer');
        if (autoR) {
            autoR.destroy();
        }
    },

    hasWriteAccess: function() {
		var member = this.get('membership');
		if(!Ember.none(member)){
        	return member.access_type === 'owner' || member.access_type === 'write';
		}
		return NO;
    }.property('membership')
});

});spade.register("kloudgis/sandbox/lib/core_search", function(require, exports, __module, ARGV, ENV, __filename){
// javascript:/***%20Core%20functions%20to%20perform%20searches**/KG.core_search%20=%20SC.Object.create({plugins:%20[],searchAsked:%20NO,_view:%20null,addPlugin:%20function(plugin)%20{this.plugins.pushObject(plugin);},searchFeatures:%20function()%20{var%20search%20=%20KG.searchController.get(%27searchValue%27);var%20content%20=%20KG.searchController.get(%27content%27);var%20store%20=%20KG.store;if%20(content%20&&%20content.destroy)%20{content.forEach(function(cat)%20{store.unloadRecord(KG.SearchCategory,%20cat.get(%27id%27),%20cat.get(%27storeKey%27))});content.destroy();}console.log(%27search%20for:%27%20+%20search);KG.SEARCH_QUERY.search%20=%20search;var%20records%20=%20store.find(KG.SEARCH_QUERY);KG.searchController.set(%27content%27,%20records);this.plugins.forEach(function(plugin)%20{plugin.set(%27searchValue%27,%20search);});this.set(%27searchAsked%27,%20YES);},clearSearchFeatures:%20function()%20{KG.searchController.set(%27searchValue%27,%20%27%27);var%20content%20=%20KG.searchController.get(%27content%27);var%20store%20=%20KG.store;if%20(content%20&&%20content.destroy)%20{content.forEach(function(cat)%20{store.unloadRecord(KG.SearchCategory,%20cat.get(%27id%27),%20cat.get(%27storeKey%27))});content.destroy();}KG.searchController.set(%27content%27,%20[]);this.set(%27searchAsked%27,%20NO);},showResults:%20function()%20{var%20actualContent%20=%20KG.searchResultsController.get(%27content%27);if(actualContent%20&&%20actualContent.destroy){actualContent.destroy();}KG.searchResultsController.set(%27listVisible%27,%20YES);var%20cat%20=%20KG.searchResultsController.get(%27category%27);if%20(SC.none(cat))%20{var%20plugin%20=%20KG.searchResultsController.get(%27plugin%27);KG.searchResultsController.set(%27content%27,%20null);if%20(!SC.none(plugin))%20{plugin.loadRecords(null,%20function(records)%20{KG.searchResultsController.set(%27content%27,%20records);});}}%20else%20{var%20records%20=%20cat.findRecords(KG.searchResultsController.get(%27nextBlockStart%27));if(records.onReady){records.onReady(null,%20function(){KG.searchResultsController.set(%27content%27,%20array);});}KG.searchResultsController.set(%27content%27,%20records);}},showMoreResults:%20function(){var%20cat%20=%20KG.searchResultsController.get(%27category%27);if(cat){var%20records%20=%20cat.findRecords(KG.searchResultsController.get(%27nextBlockStart%27));}},hideResults:%20function()%20{KG.searchResultsController.set(%27listVisible%27,%20NO);setTimeout(function()%20{var%20content%20=%20KG.searchResultsController.get(%27content%27);if%20(content%20&&%20content.destroy)%20{content.destroy();}KG.searchResultsController.set(%27category%27,%20null);KG.searchResultsController.set(%27content%27,%20[]);KG.core_search.clearSearchFeatures();},800);}});$(document).ready(function()%20{setTimeout(function()%20{KG.core_search._view%20=%20Ember.View.create({templateName:%20%27search-panel%27});KG.core_search._view.appendTo(%27#main-sandbox-view%27);},1000);});
/**
* Core functions to perform searches
**/

KG.core_search = SC.Object.create({

    plugins: [],
    searchAsked: NO,

    //the search panel view
    _view: null,

    addPlugin: function(plugin) {
        this.plugins.pushObject(plugin);
    },

    searchFeatures: function() {
        var search = KG.searchController.get('searchValue');
        var content = KG.searchController.get('content');
        var store = KG.store;
        if (content && content.destroy) {
            content.forEach(function(cat) {
                store.unloadRecord(KG.SearchCategory, cat.get('id'), cat.get('storeKey'))
            });
            content.destroy();
        }
        console.log('search for:' + search);
        KG.SEARCH_QUERY.search = search;
        var records = store.find(KG.SEARCH_QUERY);
        KG.searchController.set('content', records);
        this.plugins.forEach(function(plugin) {
            plugin.set('searchValue', search);
        });
        this.set('searchAsked', YES);
    },

    clearSearchFeatures: function() {
        KG.searchController.set('searchValue', '');
        var content = KG.searchController.get('content');
        var store = KG.store;
        if (content && content.destroy) {
            content.forEach(function(cat) {
                store.unloadRecord(KG.SearchCategory, cat.get('id'), cat.get('storeKey'))
            });
            content.destroy();
        }
        KG.searchController.set('content', []);
        this.set('searchAsked', NO);
    },

    showResults: function() {
		//reset cursor
		if(KG.searchResultsController.get('category')){
        	KG.searchResultsController.setPath('category.queryBlock', null);
		}
        //clear the record array -  If not cleared, the query will return the cached result
        var actualContent = KG.searchResultsController.get('content');
        if (actualContent && actualContent.destroy) {
            actualContent.destroy();
        }
        KG.searchResultsController.set('content', []);
        KG.searchResultsController.set('listVisible', YES);
        var cat = KG.searchResultsController.get('category');
        if (SC.none(cat)) {
            var plugin = KG.searchResultsController.get('plugin');
            KG.searchResultsController.set('content', null);
            if (!SC.none(plugin)) {
                plugin.loadRecords(null,
                function(records) {
                    KG.searchResultsController.set('content', records);
                });
            }
        } else {
            var records = cat.findRecords(KG.searchResultsController.get('nextBlockStart'));
            if (records.onReady) {
                records.onReady(this, this._addResults);
            }
        }
    },

    showMoreResults: function() {
        var cat = KG.searchResultsController.get('category');
        if (cat) {
            var records = cat.findRecords(KG.searchResultsController.get('nextBlockStart'));
            if (records.onReady) {
                records.onReady(this, this._addResults);
            }
        }
    },

    _addResults: function(records) {
        var array = KG.searchResultsController.get('content');
        records.forEach(function(rec) {
            array.pushObject(rec);
        });
        KG.searchResultsController.set('content', array);
        records.destroy();
    },

    hideResults: function() {
        KG.searchResultsController.set('listVisible', NO);
        setTimeout(function() {
            var content = KG.searchResultsController.get('content');
            if (content && content.destroy) {
                content.destroy();
            }
            KG.searchResultsController.set('category', null);
            KG.searchResultsController.set('content', []);
            //hide bottom list too.
            KG.core_search.clearSearchFeatures();
        },
        800);
    }
});

//lazzy creation too speed up app launch
$(document).ready(function() {
    setTimeout(function() {
        KG.core_search._view = Ember.View.create({
            templateName: 'search-panel'
        });
        KG.core_search._view.appendTo('#main-sandbox-view');
    },
    1000);
});

});spade.register("kloudgis/sandbox/lib/main", function(require, exports, __module, ARGV, ENV, __filename){
require("kloudgis/view/lib/views/button");
require("kloudgis/view/lib/views/text_field");
require("kloudgis/view/lib/views/numeric_text_field");
require("kloudgis/view/lib/views/text_area");
require("kloudgis/view/lib/views/loading_image");
require("kloudgis/auth/lib/main");
require("kloudgis/core/lib/main_ds");
require("kloudgis/core/lib/models/feature");
require("kloudgis/core/lib/models/bounds");
require("kloudgis/core/lib/core_date");
require("./strings");
require("./core_sandbox");
require("./controllers/comments");

//active user
require('./controllers/active_user');
require('./views/user_button');
//templates
require("./templates");

//map
require("kloudgis/map/lib/core_leaflet");
require("kloudgis/map/lib/core_highlight");

//search
require("kloudgis/core/lib/models/search_category");
require("./core_search");
require("./controllers/search");
require("./controllers/search_results");
require("./views/search_field");
require("./views/records_button");
//search plugins
require("./views/plugin_records_button");
require("./search_plugins/core_google");
require("./search_plugins/core_geonames");
require("./search_plugins/core_osm");
require("./search_plugins/core_yahoo");

//inspector
require("./core_inspector");
require("./controllers/inspector");
require("./views/inspector_attribute");
require("kloudgis/view/lib/views/switch");
require("kloudgis/view/lib/views/select");
require("kloudgis/view/lib/views/select_input");
require("./views/delete_feature_comment");
require("./controllers/feature_comments");
require("./controllers/feature_new_comment");
require("./controllers/feature_delete_comment");

//palette
require("./core_palette");
require("./controllers/palette");

//info
require("./controllers/info");
require("./core_info");
require("./views/feature_info_popup_item");
require("./views/expand_button");

//notes
require("./controllers/note_markers");
require("./controllers/notes_popup");
require("./controllers/active_note");
require("./controllers/note_comments");
require("./controllers/note_new_comment");
require("./controllers/note_delete_comment");
require("./core_note");
require("./views/note_popup_item");
require("./views/comment_area");
require("./views/author");
require("./views/delete_note_comment");


//layers
require("./controllers/layers");
require("./core_layer");

//notification
require("./models/message");
require("./core_notification");
require("./controllers/notifications");
require("./controllers/send_notification");
require("./views/notification");
require("./views/text_notification_area");

//bookmark
require("./core_bookmark");
require("./controllers/bookmarks");
require("./controllers/add_bookmark");
require("./views/bookmark_button");
require("./views/edit_bookmark_button");
require("./views/bookmark_item");
require("./views/bookmark_delete_button");

});spade.register("kloudgis/sandbox/lib/models/message", function(require, exports, __module, ARGV, ENV, __filename){
KG.Message = SC.Object.extend({
	
	author: null,
	user_descriptor: null,
	type: null,
	content: null,
	dateMillis: null,
	
	formattedContent: function(){
		var content = this.getPath('content.text');
		if(content){
			//replace \n with <br> to enforce line break
			return content.replace(/\n/g, '<br>');
		}
		return content;
	}.property('content'),
	
	toDataHash:function(){
		return {
			author: this.author,
			user_descriptor: this.user_descriptor,
			type : this.type,
			content: this.content,
			dateMillis: this.dateMillis
		};
	},
	
	formattedDate: function(){
		  var date = this.get('dateMillis');
	        if (date) {
	            return KG.core_date.formatDate(date);
	        }
	        return '';
	}.property('dateMillis'),
	
	/* to be used by SC.isEqual*/
	isEqual: function(b){
		if(b.toDataHash){
			var aH = this.toDataHash();
			var bH = b.toDataHash();
			return JSON.stringify(aH) === JSON.stringify(bH);
		}
		return NO;
	}
	
});

});spade.register("kloudgis/sandbox/lib/search_plugins/core_geonames", function(require, exports, __module, ARGV, ENV, __filename){
KG.core_geonames = SC.Object.create({

    title: '_searchGeonames'.loc(),

	pluginName: 'Geonames',

    searchValue: '',

    loadRecords: function(cb_target, cb) {
        var search = this.get('searchValue');
        $.ajax({
            type: 'GET',
            url: encodeURI('http://ws.geonames.org/searchJSON?q=%@&maxRows=10'.fmt(search)),
            dataType: 'json',
            context: this,
            error: function(jqXHR, textStatus, errorThrown) {
                SC.Logger.error('Geonames error: HTTP error status code: ' + jqXHR.status);
            },
            success: function(data, textStatus, jqXHR) {
                console.log('Geonames success.');
                var records = [];
                if (data && data.geonames && data.geonames.length > 0) {
                    var results = data.geonames,
                    i;
                    for (i = 0; i < results.length; i++) {
                        var geo = {
                            x: results[i].lng,
                            y: results[i].lat
                        };
                        var lonLat = KG.LonLat.create({
                            lon: geo.x,
                            lat: geo.y
                        });
                        records.pushObject(SC.Object.create({
                            title: "%@, %@".fmt(results[i].toponymName, results[i].countryName),
                            geo: {coords: [geo], centroid:{x: geo.x, y: geo.y}, geo_type: 'Point'},
                            center: lonLat,
                            hasCreateNote: YES
                        }));
                    }
                }
                cb.call(cb_target, records);
            },
            async: YES
        });
    },
});

KG.core_search.addPlugin(KG.core_geonames);

});spade.register("kloudgis/sandbox/lib/search_plugins/core_google", function(require, exports, __module, ARGV, ENV, __filename){
KG.core_google = SC.Object.create({

    title: "_searchGoogle".loc(),

	pluginName: 'Google',
	
    searchValue: '',

    loadRecords: function(cb_target, cb) {
        var search = this.get('searchValue');
        $.ajax({
            type: 'GET',
            url: encodeURI('/maps/api/geocode/json?address=%@&sensor=true'.fmt(search)),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            context: this,
            error: function(jqXHR, textStatus, errorThrown) {
                SC.Logger.error('Google error: HTTP error status code: ' + jqXHR.status);
            },
            success: function(data, textStatus, jqXHR) {
                console.log('Google success.');
				var records = [];
                if (data && data.results && data.results.length > 0) {
                    var results = data.results,
                    i;
                    for (i = 0; i < results.length; i++) {
                        var geo = {
                            x: results[i].geometry.location.lng,
                            y: results[i].geometry.location.lat
                        };
                        var lonLat = KG.LonLat.create({
                            lon: geo.x,
                            lat: geo.y
                        });
                        records.pushObject(SC.Object.create({
                            title: results[i].formatted_address,
                            geo: {coords: [geo], centroid:{x: geo.x, y: geo.y}, geo_type: 'Point'},
                            center: lonLat,
                            hasCreateNote: YES
                        }));
                    }                
                }
				cb.call(cb_target, records);
            },
            async: YES
        });
    },
});

KG.core_search.addPlugin(KG.core_google);

});spade.register("kloudgis/sandbox/lib/search_plugins/core_osm", function(require, exports, __module, ARGV, ENV, __filename){
KG.core_osm = SC.Object.create({

    title: '_searchOSM'.loc(),

	pluginName: 'OSM',

    searchValue: '',

    loadRecords: function(cb_target, cb) {
        var search = this.get('searchValue');
        $.ajax({
            type: 'GET',
            url: encodeURI('http://nominatim.openstreetmap.org/search?q=%@&format=json&limit=10'.fmt(search)),
            dataType: 'json',
            context: this,
            error: function(jqXHR, textStatus, errorThrown) {
                SC.Logger.error('OSM error: HTTP error status code: ' + jqXHR.status);
            },
            success: function(data, textStatus, jqXHR) {
                console.log('OSM success.');
                var records = [];
                if (data && data.length > 0) {
                    var results = data,
                    i;
                    for (i = 0; i < results.length; i++) {
                        var geo = {
                            x: results[i].lon,
                            y: results[i].lat
                        };
                        var lonLat = KG.LonLat.create({
                            lon: geo.x,
                            lat: geo.y
                        });
                        records.pushObject(SC.Object.create({
                            title: "%@, %@".fmt(results[i].display_name),
                            geo: {coords: [geo], centroid:{x: geo.x, y: geo.y}, geo_type: 'Point'},
                            center: lonLat,
                            hasCreateNote: YES
                        }));
                    }
                }
                cb.call(cb_target, records);
            },
            async: YES
        });
    },
});

KG.core_search.addPlugin(KG.core_osm);

});spade.register("kloudgis/sandbox/lib/search_plugins/core_yahoo", function(require, exports, __module, ARGV, ENV, __filename){
KG.core_yahoo = SC.Object.create({

    title: '_searchYahoo'.loc(),

    pluginName: 'Yahoo',

    searchValue: '',

    //jeanfelixg@yahoo.ca with domain http://kloudgis.org
    appId: '7w0MZN32',

    loadRecords: function(cb_target, cb) {
        var search = this.get('searchValue');
        $.ajax({
            type: 'GET',
            url: encodeURI('http://where.yahooapis.com/geocode?q=%@&appid=%@&flags=J&count=10&locale=%@_CA'.fmt(search, this.appId, KG.lang)),
            dataType: 'json',
            context: this,
            error: function(jqXHR, textStatus, errorThrown) {
                SC.Logger.error('Yahoo error: HTTP error status code: ' + jqXHR.status);
            },
            success: function(data, textStatus, jqXHR) {
                console.log('Yahoo success.');
                var records = [];
                if (data && data.ResultSet && data.ResultSet.Results) {
                    var results = data.ResultSet.Results,
                    i;
                    for (i = 0; i < results.length; i++) {
                        var geo = {
                            x: results[i].longitude,
                            y: results[i].latitude
                        };
                        var lonLat = KG.LonLat.create({
                            lon: geo.x,
                            lat: geo.y
                        });
                        var props = ['line1', 'line2', 'line3', 'line4'];
                        var vals = [];
                        props.forEach(function(prop) {
							var val = results[i][prop];
							if(val && val.length > 0){
								vals.push(val);
							}
						});

                        records.pushObject(SC.Object.create({
                            title: vals.join(","),
                            geo: {coords: [geo], centroid:{x: geo.x, y: geo.y}, geo_type: 'Point'},
                            center: lonLat,
                            hasCreateNote: YES
                        }));
                    }
                }
                cb.call(cb_target, records);
            },
            async: YES
        });
    },
});

KG.core_search.addPlugin(KG.core_yahoo);

});spade.register("kloudgis/sandbox/lib/strings", function(require, exports, __module, ARGV, ENV, __filename){
var fr = { 
	"_me": "Moi",
	"_save": "Sauvegarde",
	"_cancel": "Annuler",
	"_close": "Fermer",
	"_Map": "Carte",
	"_Note": "Note",
	"_Notes": "%@ Notes",
	"_notes_": "Notes",
	"_createNote": "Créer une note",
	"_cancelCreateNote": "Annuler la création",
	"_newNote" : "Nouvelle note",
	"_Delete": "Supprimer",
	"_backHome": "Retour",
	"_noteTitle": "Titre:",
	"_noteDescription": "Description:",
	"_noteConfirm": "Créer",
	"_noteUpdate": "Mise à jour",
	"_noteTitlePlaceholder": "Votre note",
	"_moveNote": "Glisser la note où vous le voulez.",
	"_author": "Par %@",
	"_0comment": "Ajouter un commentaire",
	"_1comment": "Un Commentaire",
	"_comments": "%@ Commentaires",
	"_0hideComment": "Cacher",
	"_1hideComment": "Cacher le commentaire",
	"_hideComments": "Cacher les %@ commentaires",
	"_commentPlaceholder": "Écrire un commentaire...",
	"_closeInspectorTitle": "Fermer l'inspecteur",
	"_cancelInspectorTitle" : "Annuler les changements",
	"_saveInspectorTitle" : "Sauvegarder les changements",
	"_saveInspectorLabel" : "Sauvegarde",	
	"_closeSearch": "Fermer la fenêtre de résultat",	
	"_search": "Recherche...",
	"_searchResult": "%@ Résultats pour %@ dans %@",
	"_unknown" : "Élément",
	"_searchGoogle": "Rechercher Google",
	"_searchGeonames": "Rechercher Geonames",
	"_searchOSM": "Rechercher OSM",
	"_searchYahoo" : "Rechercher Yahoo",
	"_notificationTitle": "Notifications",
	"_notificationClear": "Effacer",
	"_notificationSendText": "Envoyer un message",
	"_notificationSendButton": "Envoyer",
	"_bookmarkTitle": "Signets",
	"_bookmarkAdd": "Ajouter",
	"_bookmarkEdit": "Modifier",
	"_bookmarkDialogTitle": "Ajouter un signet",
	"_bookmarkCloseDialogTitle": "Fermer la fenêtre d'ajout de signet",
	"_textMessageTitle": " a envoyé un message à ",
	"_sendOnEnterTooltip" : "Envoyer le message en appuyant sur Retour",
	"_failedToSendMessage": "Impossible d'envoyer le message.",
	"_timeoutSendMessage" : "Erreur lors de l'envoi du message.",
	"_sendMessageSuccessful" : "Message envoyé.",
	"_otherValue" : "Autre...",
	"_paletteTitle": "Palette",
	"_showPalette" : "Afficher la Palette",
	"_moveFeature": "Glisser le nouveau '%@' où vous le voulez.",
	"_bookmarkDescription": "Par %@ à %@",
	"_showMore" : "Plus de Résultats"
};

var en = {
	"_me": "Me",
	"_save": "Save",
	"_cancel": "Cancel",
	"_close": "Close",
	"_Map": "Map",
	"_Note": "Note",
	"_Notes": "%@ Notes",
	"_notes_": "Notes",
	"_createNote": "Create Note",
	"_cancelCreateNote": "Cancel create note",
	"_newNote" : "New note",
	"_Delete": "Delete",
	"_backHome": "Return",
	"_noteTitle": "Title:",
	"_noteDescription": "Description:",
	"_noteConfirm": "Create",
	"_noteUpdate": "Update",
	"_noteTitlePlaceholder": "Your note",
	"_moveNote": "Drag the note where you want.",
	"_author": "By %@",
	"_0comment": "Add a comment",
	"_1comment": "One comment",
	"_comments": "%@ comments",
	"_0hideComment": "Hide",
	"_1hideComment": "Hide the comment",
	"_hideComments": "Hide the %@ comments",
	"_commentPlaceholder": "Write a comment...",
	"_closeInspectorTitle": "Close the Inspector",
	"_cancelInspectorTitle" : "Cancel the Changes",
	"_saveInspectorTitle" : "Save the Changes",
	"_saveInspectorLabel" : "Save",
	"_closeSearch": "Close the result window",
	"_search": "Search...",
	"_searchResult": "%@ Results for %@ in %@",
	"_unknown" : "Feature",
	"_searchGoogle": "Search Google",
	"_searchGeonames": "Search Geonames",
	"_searchOSM": "Search OSM",
	"_searchYahoo" : "Search Yahoo",
	"_notificationTitle": "Notifications",
	"_notificationClear": "Clear",
	"_notificationSendText": "Send a Message",
	"_notificationSendButton": "Send",
	"_bookmarkTitle": "Bookmarks",
	"_bookmarkAdd": "Add",
	"_bookmarkEdit": "Edit",
	"_bookmarkDialogTitle": "Add a Bookmark",
	"_bookmarkCloseDialogTitle": "Close the add bookmark dialog",
	"_textMessageTitle": " send a text message at ",
	"_sendOnEnterTooltip" : "Send the message on Enter",
	"_failedToSendMessage": "Cannot send the message.",
	"_timeoutSendMessage" : "Failed to send message.",
	"_sendMessageSuccessful" : "Message envoyé.",
	"_otherValue" : "Other...",
	"_paletteTitle": "Palette",
	"_showPalette" : "Show the Palette",
	"_moveFeature": "Drag the new '%@' where you want.",
	"_bookmarkDescription": "By %@ at %@",
	"_showMore" : "More Results"
};

if(KG.lang === 'fr'){
	jQuery.extend(Ember.STRINGS, fr);
}else{
	jQuery.extend(Ember.STRINGS, en);
}

});spade.register("kloudgis/sandbox/lib/templates", function(require, exports, __module, ARGV, ENV, __filename){
//generic templates
Ember.TEMPLATES['switch'] = spade.require('kloudgis/templates/switch');
Ember.TEMPLATES['select'] = spade.require('kloudgis/templates/select');
Ember.TEMPLATES['select-input'] = spade.require('kloudgis/templates/select_input');

//Sandbox specific templates
//inspector renderers
Ember.TEMPLATES['page-header'] = spade.require('kloudgis/sandbox/templates/page_header');
Ember.TEMPLATES['active-user-panel'] = spade.require('kloudgis/sandbox/templates/active_user_panel');
Ember.TEMPLATES['notification-panel'] = spade.require('kloudgis/sandbox/templates/notification_panel');
Ember.TEMPLATES['bookmark-panel'] = spade.require('kloudgis/sandbox/templates/bookmark_panel');
Ember.TEMPLATES['search-panel'] = spade.require('kloudgis/sandbox/templates/search_panel');

Ember.TEMPLATES['catalog-renderer'] = spade.require('kloudgis/sandbox/templates/catalog_renderer');
Ember.TEMPLATES['catalog-any-renderer'] = spade.require('kloudgis/sandbox/templates/catalog_text_renderer');
Ember.TEMPLATES['text-renderer'] = spade.require('kloudgis/sandbox/templates/text_renderer');
Ember.TEMPLATES['num-renderer'] = spade.require('kloudgis/sandbox/templates/num_renderer');
Ember.TEMPLATES['num-range-renderer'] = spade.require('kloudgis/sandbox/templates/num_range_renderer');
Ember.TEMPLATES['bool-renderer'] = spade.require('kloudgis/sandbox/templates/bool_renderer');
Ember.TEMPLATES['img-renderer'] = spade.require('kloudgis/sandbox/templates/img_renderer');
Ember.TEMPLATES['label-renderer'] = spade.require('kloudgis/sandbox/templates/label_renderer');

Ember.TEMPLATES['info-popup'] = spade.require('kloudgis/sandbox/templates/info_popup');
Ember.TEMPLATES['info-item'] = spade.require('kloudgis/sandbox/templates/info_item');
Ember.TEMPLATES['add-bookmark'] = spade.require('kloudgis/sandbox/templates/add_bookmark');
Ember.TEMPLATES['send-text-notification'] = spade.require('kloudgis/sandbox/templates/send_text_notification');
Ember.TEMPLATES['active-note-popup'] = spade.require('kloudgis/sandbox/templates/active_note_popup');
Ember.TEMPLATES['feature-comments'] = spade.require('kloudgis/sandbox/templates/feature_comments');
Ember.TEMPLATES['note-comments'] = spade.require('kloudgis/sandbox/templates/note_comments');
Ember.TEMPLATES['multiple-notes-popup'] = spade.require('kloudgis/sandbox/templates/multiple_notes_popup');
Ember.TEMPLATES['inspector'] = spade.require('kloudgis/sandbox/templates/inspector');
Ember.TEMPLATES['palette'] = spade.require('kloudgis/sandbox/templates/palette');

});spade.register("kloudgis/sandbox/lib/views/author", function(require, exports, __module, ARGV, ENV, __filename){
/**
* View to show the author descriptor in a collectionview.
**/

KG.AuthorView = SC.View.extend({

    authorLabel: function() {
        var content = this.getPath('itemView.content');
        if (SC.none(content)) {
            return '';
        }
        if (content.get('author') === KG.core_auth.activeUser.id) {
            return '_me'.loc();
        } else {
            var auth = content.get('author_descriptor');
            if (auth) {
                return auth;
            } else {
                return '?';
            }
        }
    }.property('itemView.content')
});

});spade.register("kloudgis/sandbox/lib/views/bookmark_button", function(require, exports, __module, ARGV, ENV, __filename){
KG.BookmarkButtonView = KG.Button.extend({
	bmPath: 'resources/images/bookmark.png',
	bmActivePath:  'resources/images/bookmark.png',
	
	activatedBinding: "KG.bookmarksController.activePopup",
	
	bookmarkImg: function(){
		if(this.get('activated')){
			return this.get('bmActivePath');
		}else{
			return this.get('bmPath');
		}
	}.property('activated')
});

});spade.register("kloudgis/sandbox/lib/views/bookmark_delete_button", function(require, exports, __module, ARGV, ENV, __filename){
KG.BookmarkDeleteButtonView = KG.Button.extend({
	
	isVisible: function(){
		var content = this.getPath('itemView.content');
		if(content && KG.bookmarksController.get('editMode')){
			var auth = content.get('user_create');
	        if (!auth || auth === KG.core_auth.get('activeUser').id || KG.core_sandbox.get('isSandboxOwner')) {
	            return YES;
	        }
		}
		return NO;
	}.property('itemView.content', 'KG.bookmarksController.editMode'),
});

});spade.register("kloudgis/sandbox/lib/views/bookmark_item", function(require, exports, __module, ARGV, ENV, __filename){
KG.BookmarkItemView = KG.Button.extend({
	classNames: ['bookmark-item','common-list-button'],
	tagName:"div"
});

});spade.register("kloudgis/sandbox/lib/views/comment_area", function(require, exports, __module, ARGV, ENV, __filename){
/**
* View (TextArea) to add comment.
**/

KG.CommentAreaView = KG.TextArea.extend({

    insertNewline: function(event) {
        KG.statechart.sendAction(this.get('nl_sc_action'));
        var self = this;
        setTimeout(function() {
			var resizer = self.$().data('AutoResizer');
			if(resizer){
				resizer.check();
			}
        },
        205);
    },

    cancel: function() {
        this.set('value', '');
        this.$().blur();
    }

});

});spade.register("kloudgis/sandbox/lib/views/delete_feature_comment", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Button to delete a feature comment.  
**/

KG.DeleteFeatureCommentView = KG.Button.extend({
	
	isVisible: function(){
		var content = this.getPath('itemView.content');
		if(content === KG.featureDeleteCommentController.get('content')){
	       	var auth = content.get('author');
	        if (!auth || auth === KG.core_auth.get('activeUser').id || KG.core_sandbox.get('isSandboxOwner')) {
	            return YES;
	        }
		}
		return NO;
	}.property('itemView.content', 'KG.featureDeleteCommentController.content'),
	
	label: function(){
		return "_Delete".loc()
	}.property()
});

});spade.register("kloudgis/sandbox/lib/views/delete_note_comment", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Button to delete a note comment.  
**/

KG.DeleteNoteCommentView = KG.Button.extend({
	
	isVisible: function(){
		var content = this.getPath('itemView.content');
		if(content === KG.noteDeleteCommentController.get('content')){
			var auth = content.get('author');
	        if (!auth || auth === KG.core_auth.get('activeUser').id || KG.core_sandbox.get('isSandboxOwner')) {
	            return YES;
	        }
		}
		return NO;
	}.property('itemView.content', 'KG.noteDeleteCommentController.content'),
	
	label: function(){
		return "_Delete".loc()
	}.property()
});

});spade.register("kloudgis/sandbox/lib/views/edit_bookmark_button", function(require, exports, __module, ARGV, ENV, __filename){
KG.EditBookmarkButtonView = KG.Button.extend({
	
	postAction: function(){
		this.set('isActive', KG.bookmarksController.get('editMode'));
	},
	
	editModeDidChange: function(){
		this.postAction();
	}.observes('KG.bookmarksController.editMode')
});

});spade.register("kloudgis/sandbox/lib/views/expand_button", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Toggle Button to expend/collapse.  
**/

KG.ExpandButtonView = SC.Button.extend({
	
	tagName: 'div',
	
	expanded: NO,
	
	logo: function(){
		if(this.get("expanded")){
			return 'resources/images/down_arrow_32.png';
		}else{
			return 'resources/images/up_arrow_32.png';
		}
	}.property('expanded'),
	
	mouseUp: function(e){
		this.set('expanded', !this.get('expanded'));
		return NO;
	}
});

});spade.register("kloudgis/sandbox/lib/views/feature_info_popup_item", function(require, exports, __module, ARGV, ENV, __filename){
/**
*  One Feature in the featureinfo popup.
**/

KG.FeatureInfoPopupItemView = KG.Button.extend({
	
	classNames: 'info-popup-item'.w(),
	
	templateName:'info-item',
	
	content: null,
	
	tagName: 'div',
	
	sc_action: 'featureInfoMouseUpAction',
	
	manualMouseDown: YES,

	mouseEnter: function(e){
		var content = this.get('content');
		KG.statechart.sendAction('featureInfoMouseEnterAction', content);
		return NO;
	},
	
	mouseLeave: function(e){
		var content = this.get('content');
		KG.statechart.sendAction('featureInfoMouseLeaveAction', content);
		return NO;
	}
});

});spade.register("kloudgis/sandbox/lib/views/inspector_attribute", function(require, exports, __module, ARGV, ENV, __filename){
/**
* View to render an attribute in the inspector.  Use the renderer propertie to set the renderer template.  read-only-renderer by default.
**/

KG.InspectorAttributeView = SC.View.extend({
	
	_renderer: null,
	
	destroy: function() {
		//console.log('inspector attribute destroy!!');
		this._super();
		if(!SC.none(this._renderer)){
			this._renderer.destroy();
			this._renderer = null;
		}
	},
	
	didInsertElement: function(){
		var ren;
		if(!SC.none(this._renderer)){
			this._renderer.destroy();
		}
		var renderer = this.getPath('itemView.content.templateName');
		if(renderer && SC.TEMPLATES[renderer]){
			ren = SC.View.create({templateName: renderer, parentView: this});
		}else{
			ren = SC.View.create({templateName: 'label-renderer', parentView: this});
		}
		ren.appendTo(this.get('element'));
		this._renderer = ren;
	}
});

});spade.register("kloudgis/sandbox/lib/views/note_popup_item", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Render a note item in a list (such as the "multiple notes popup")
**/

KG.NotePopupItemView = SC.Button.extend({
	
	classNames: 'popup-note-item'.w(),
	
	tagName: 'div',
	
	mouseUp: function(e){
		this._super(e);
		KG.statechart.sendAction('noteSelectedAction', this.getPath('itemView.content'), {marker: KG.notesPopupController.get('marker')});
		return NO;
	}
});

});spade.register("kloudgis/sandbox/lib/views/notification", function(require, exports, __module, ARGV, ENV, __filename){
KG.NotificationView = SC.View.extend({
	
	authorValue:function(){
		return this.getPath('contentView.content.user_descriptor');
	}.property('content'),
	
	authorMailTo: function(){
		return 'mailto:%@'.fmt(this.getPath('contentView.content.author'));
	}.property('content'),
	
	titleValue:function(){
		return '_textMessageTitle'.loc();
	}.property('content'),
	
	dateValue:function(){
		return this.getPath('contentView.content.formattedDate');
	}.property('content'),
	
	messageValue:function(){
		return this.getPath('contentView.content.formattedContent');
	}.property('content')
})

});spade.register("kloudgis/sandbox/lib/views/plugin_records_button", function(require, exports, __module, ARGV, ENV, __filename){
KG.PluginRecordsButtonView = KG.Button.extend({
	
	recordsVisible: NO,
	
	tagName:'div',
	
	activePluginDidChange: function(){
		var cat = this.get('content');
		if(cat === KG.searchResultsController.get('plugin')){
			this.set('recordsVisible', YES);
		}else{
			this.set('recordsVisible', NO);
		}
	}.observes('KG.searchResultsController.plugin'),
	
	records:function(){
		if(this.get('recordsVisible')){
			return KG.searchResultsController.get('content');
		}
	}.property('recordsVisible', 'KG.searchResultsController.content')
	
	
});

});spade.register("kloudgis/sandbox/lib/views/records_button", function(require, exports, __module, ARGV, ENV, __filename){
KG.RecordsButtonView = KG.Button.extend({
	
	recordsVisible: NO,
	
	tagName:'div',
	
	activeCategoryDidChange: function(){
		var cat = this.get('content');
		if(cat === KG.searchResultsController.get('category')){
			this.set('recordsVisible', YES);
		}else{
			this.set('recordsVisible', NO);
		}
	}.observes('KG.searchResultsController.category'),
	
	hasMoreResult: function(){
		if(this.get('recordsVisible')){
			return KG.searchResultsController.get('hasMoreResults');
		}
		return NO;
	}.property('recordsVisible', 'KG.searchResultsController.hasMoreResults'),
	
	records:function(){
		if(this.get('recordsVisible')){
			return KG.searchResultsController.get('content');
		}else{
			return null;
		}
	}.property('recordsVisible', 'KG.searchResultsController.content')
	
	
});

});spade.register("kloudgis/sandbox/lib/views/search_field", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Search text field to perform a search of feature.
**/

KG.SearchField = KG.TextField.extend({
    type: "search",

    insertNewline: function() {
		KG.statechart.sendAction('searchAction');
	},
	
	cancel: function(){
		this.set('value', '');
		this.$().blur();
	},
	
	valueDidChange: function(){
		if(this.get('value') === ''){
			KG.statechart.sendAction('clearSearchAction');
		}
	}.observes('value')
});

});spade.register("kloudgis/sandbox/lib/views/text_notification_area", function(require, exports, __module, ARGV, ENV, __filename){
KG.TextNotificationAreaView = KG.TextArea.extend({

    insertNewline: function(event) {
        if (KG.sendNotificationController.get('sendOnEnterValue')) {
            KG.statechart.sendAction('sendNotificationAction');
        }
    },
});

});spade.register("kloudgis/sandbox/lib/views/user_button", function(require, exports, __module, ARGV, ENV, __filename){
KG.UserButtonView = KG.Button.extend({
	activePopup: NO,
	
	activePopupBinding: 'KG.activeUserController.activePopup',
	
	activePopupDidChange: function(){
		this.set('isActive', this.get('activePopup'));
	}.observes('activePopup'),
	
	isActiveDidChange:function(){
		if(this.get('activePopup')){
			this.set('isActive', YES);
		}
	}.observes('isActive'),
	
	triggerAction: function() {
		KG.statechart.sendAction('toggleUserOptionsPopupAction');
	}
});

});spade.register("kloudgis/sandbox/templates/active_note_popup", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("{{#view class=\"active-note-popup\"}}\t\n\t{{#view KG.Button manualMouseDown=\"yes\" class=\"note-zoom-button\" isVisibleBinding=\"KG.activeNoteController.isOldRecord\" tagName=\"div\" sc_action=\"zoomNoteAction\"}}\n\t\t<a href=\"javascript:void(0)\">zoom</a>\n\t{{/view}}\t\n\t{{#view class=\"note-date-label\"}}\n\t\t{{KG.activeNoteController.content.formattedDate}}\n\t{{/view}}\t\t\t\n\t<span>{{KG.activeNoteController.titleLabel}}</span>\n\t{{#view KG.TextField valueBinding=\"KG.activeNoteController.titleValue\" disabledBinding=\"KG.activeNoteController.isDisabled\" type=\"text\" placeholder_not_loc=\"_noteTitlePlaceholder\" }}\n\t{{/view}}\n\t<span>{{KG.activeNoteController.descriptionLabel}}</span>\n\t{{#view KG.TextArea id=\"note-description-area\" disabledBinding=\"KG.activeNoteController.isDisabled\" valueBinding=\"KG.activeNoteController*content.description\"}}\n\t{{/view}}\n\t{{#view class=\"active-note-popup-bottom\"}}\n\t\t{{#view KG.Button  manualMouseDown=\"yes\" isVisibleBinding=\"KG.activeNoteController.isUpdateVisible\" class=\"white-button\" sc_action=\"confirmNoteAction\"}}\n\t\t\t{{KG.activeNoteController.confirmLabel}}\n\t\t{{/view}}\t\t\n\t\t{{#view KG.Button manualMouseDown=\"yes\" isVisibleBinding=\"KG.activeNoteController.isDeleteVisible\" class=\"red-button\"  sc_action=\"deleteNoteAction\"}}\n\t\t\t{{KG.activeNoteController.deleteLabel}}\n\t\t{{/view}}\n\t\t{{#view class=\"note-author-label\"}}\n\t\t\t{{KG.activeNoteController.content.authorFormatted}}\n\t\t{{/view}}\n\t{{/view}}\n\t{{view templateName=\"note-comments\"}}\n{{/view}}\n");
});spade.register("kloudgis/sandbox/templates/active_user_panel", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("{{#view KG.UserButtonView id=\"active-user-button\" tagName=\"div\" class=\"header-button\"}}\n\t<div class=\"message-label\"><span class=\"label-ellipsis\">{{KG.activeUserController.name}}</span></div>\n\t{{#view id=\"super-active-user-popup\" isVisibleBinding=\"activePopup\"}}\n\t\t\t{{#view id=\"active-user-popup\" }}\t\t\t\t\t\n\t\t\t\t\t{{#view KG.Button sc_action=\"backHomeAction\"}}\n\t\t\t\t\t\t{{loc _backHome}}\n\t\t\t\t\t{{/view}}\n\t\t\t{{/view}}\n\t{{/view}}\n{{/view}}\n");
});spade.register("kloudgis/sandbox/templates/add_bookmark", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("<div id=\"add-bookmark-panel\">\n\t{{KG.addBookmarkController.addBookmarkLabel}}\n\t{{view KG.Button class=\"x-button bookmark-close-button\"  sc_action=\"closeAddBookmarkAction\" titleBinding=\"KG.addBookmarkController.closeTitle\"}}\n\t{{view KG.TextField valueBinding=\"KG.addBookmarkController.content\" nl_sc_action=\"addBookmarkAction\"}}\n\t{{#view KG.Button class=\"white-button add-bookmark-button\"  sc_action=\"addBookmarkAction\"}}\n\t\t{{KG.addBookmarkController.addLabel}}\n\t{{/view}}\t\t\n</div>\n");
});spade.register("kloudgis/sandbox/templates/bookmark_panel", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("{{#view KG.Button id=\"bookmark-button\" tagName=\"div\" sc_action=\"toggleBookmarkPopupAction\" class=\"header-button header-button-icon\" classBinding=\"KG.bookmarksController.activePopup\"}}\n\t\t<span class=\"button-image\"><span>\t\n\t\t{{#view id=\"super-bookmark-popup\" isVisibleBinding=\"KG.bookmarksController.activePopup\"}}\n\t\t\t\t\t{{#view id=\"bookmark-popup\" isVisibleBinding=\"KG.bookmarksController.activePopup\"}}\t\t\t\t\t\t\n\t\t\t\t\t\t<div id=\"bookmark-top-bar\">\n\t\t\t\t\t\t\t{{loc _bookmarkTitle id=\"bookmark-label\" tagName=\"div\"}}\n\t\t\t\t\t\t\t{{#view KG.Button id=\"bookmark-add-button\" tagName=\"span\" class=\"white-button unselectable\" sc_action=\"addBookmarkAction\"}}\n\t\t\t\t\t\t\t\t{{loc _bookmarkAdd}}\n\t\t\t\t\t\t\t{{/view}}\n\t\t\t\t\t\t\t{{#view KG.EditBookmarkButtonView id=\"bookmark-edit-button\" tagName=\"span\" class=\"white-button unselectable\" sc_action=\"editBookmarkAction\"}}\n\t\t\t\t\t\t\t\t{{loc _bookmarkEdit}}\n\t\t\t\t\t\t\t{{/view}}\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div id=\"bookmark-collection\">\n\t\t\t\t\t\t{{#collection id=\"bookmark-list\" contentBinding=\"KG.bookmarksController.content\" itemViewClass=\"KG.BookmarkItemView\" classBinding=\"KG.bookmarksController.editMode\"}}\t\n\t\t\t\t\t\t\t\t{{#view KG.Button class=\"bookmark-item-label\" tagName=\"div\" sc_action=\"selectBookmarkAction\"}}\n\t\t\t\t\t\t\t\t\t{{itemView.content.label}}\n\t\t\t\t\t\t\t\t{{/view}}\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t{{#view KG.Button class=\"bookmark-item-author\" tagName=\"span\" sc_action=\"selectBookmarkAction\"}}\n\t\t\t\t\t\t\t\t\t{{itemView.content.formattedDescription}}\n\t\t\t\t\t\t\t\t{{/view}}\n\t\t\t\t\t\t\t\t{{#view KG.BookmarkDeleteButtonView isVisibleBinding=\"KG.bookmarksController.editMode\" class=\"bookmark-delete red-button unselectable\" sc_action=\"deleteBookmarkAction\"}}\n\t\t\t\t\t\t\t\t\t-\n\t\t\t\t\t\t\t\t{{/view}}\n\t\t\t\t\t\t{{/collection}}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t{{/view}}\n\t\t{{/view}}\n{{/view}}\n");
});spade.register("kloudgis/sandbox/templates/bool_renderer", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("<span class=\"inspector-attr-name\">\n\t{{itemView.content.label}}\n</span>\t\n{{view templateName=\"switch\" class=\"inspector-attr-value\" contentBinding=\"itemView.content.value\" disabledBinding=\"KG.inspectorController.isReadOnly\"}}\n");
});spade.register("kloudgis/sandbox/templates/catalog_renderer", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("<span class=\"inspector-attr-name\">\n\t{{itemView.content.label}}\n</span>\t\n<div class=\"inspector-attr-value\">\n\t{{view templateName=\"select\" contentBinding=\"itemView.content.enumValues\" valueBinding=\"itemView.content.value\" disabledBinding=\"KG.inspectorController.isReadOnly\"}}\n</div>\n");
});spade.register("kloudgis/sandbox/templates/catalog_text_renderer", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("<span class=\"inspector-attr-name\">\n\t{{itemView.content.label}}\n</span>\t\n<div class=\"inspector-attr-value\">\n\t{{view templateName=\"select-input\" contentBinding=\"itemView.content.enumValuesCustom\" valueBinding=\"itemView.content.value\" disabledBinding=\"KG.inspectorController.isReadOnly\"}}\n</div>\n");
});spade.register("kloudgis/sandbox/templates/feature_comments", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("{{#view KG.Button tagName=\"span\"   isVisibleBinding=\"KG.featureCommentsController.showButtonVisible\" sc_action=\"showFeatureCommentsAction\"}}\n\t<a href=\"javascript:void(0)\">\n\t\t{{KG.featureCommentsController.commentsLabel}}\n\t</a>\n{{/view}}\n{{#view id=\"feature-comments-container\" classBinding=\"KG.featureCommentsController.showing\"}}\n\t{{#collection contentBinding=\"KG.featureCommentsController.content\" class=\"comment-list\"}}\n\t\t{{#view KG.Button tagName=\"div\" sc_action=\"toggleDeleteFeatureCommentButtonAction\"}}\n\t\t\t<table style=\"width:100%\">\n\t\t\t<tr>\n\t\t\t\t<td>\n\t\t\t\t\t{{#view KG.AuthorView class=\"comment-author\"}}\n\t\t\t\t\t\t{{authorLabel}}\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t{{/view}}\n\t\t\t\t\t{{#view class=\"comment-content\"}}\n\t\t\t\t\t\t{{itemView.content.comment}}\n\t\t\t\t\t{{/view}}\n\t\t\t\t\t{{#view class=\"comment-date\"}}\n\t\t\t\t\t\t{{itemView.content.formattedDate}}\n\t\t\t\t\t{{/view}}\n\t\t\t\t</td>\n\t\t\t\t<td style=\"text-align:right;vertical-align:middle\">\n\t\t\t\t\t{{#view KG.DeleteFeatureCommentView class=\"comment-delete red-button\" sc_action=\"deleteFeatureCommentButtonAction\"}}\n\t\t\t\t\t\t{{label}}\n\t\t\t\t\t{{/view}}\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t</table>\n\t\t{{/view}}\n\t{{/collection}}\t\t\t\n{{/view}}\n{{view KG.CommentAreaView id=\"feature-new-comment-area\" class=\"new-comment-area\" isVisibleBinding=\"KG.featureCommentsController.showing\" nl_sc_action=\"addFeatureCommentAction\" valueBinding=\"KG.featureNewCommentController.content\" placeholder_not_loc=\"_commentPlaceholder\"}}\n{{#view KG.LoadingImageView id=\"feature-comment-loading\" class=\"comment-loading\" isVisibleBinding=\"KG.featureCommentsController.isLoading\"}}\n\t<img {{bindAttr src=\"loadingImage\"}} alt=\"Loading\"/>\n{{/view}}\n");
});spade.register("kloudgis/sandbox/templates/img_renderer", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("<span class=\"inspector-attr-name\">\n\t{{itemView.content.label}}\n</span>\t\n\n<div class=\"inspector-attr-value\">\n\t<img {{bindAttr src=\"itemView.content.imgBase64Value\"}}/>\n</div>\n");
});spade.register("kloudgis/sandbox/templates/info_item", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("<div class=\"info-item-row\">\n\t{{#view class=\"label-ellipsis\"}}\n\t\t{{parentView.content.title}}\n\t{{/view}}\t\t\t\n\t{{#view KG.Button manualMouseDown=\"yes\" sc_action=\"selectFeatureInspectorAction\" contentBinding=\"content\" tagName=\"div\" }}\t\n\t\t<img src=\"resources/images/right_arrow_32.png\"/>\t\t\n\t{{/view}}\n</div>\n");
});spade.register("kloudgis/sandbox/templates/info_popup", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("{{collection contentBinding=\"KG.infoController.allButFirst\"  isVisibleBinding=\"KG.infoController.listVisible\" class=\"popup-info-list\" itemViewClass=\"KG.FeatureInfoPopupItemView\"}}\t\n{{view KG.FeatureInfoPopupItemView contentBinding=\"KG.infoController.firstFeature\" class=\"master-row\"}}\n{{#view KG.ExpandButtonView tagName=\"div\" class=\"popup-info-expand-button\" isVisibleBinding=\"KG.infoController.multipleFeatures\" expandedBinding=\"KG.infoController.listVisible\"}}\t\n\t<img {{bindAttr src=\"logo\"}}/>\t\t\n{{/view}}\n");
});spade.register("kloudgis/sandbox/templates/inspector", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("{{#view id=\"super-inspector\" classBinding=\"KG.inspectorController.active\"}}\n\t{{#view id=\"inspector-title\" tagName=\"header\"}}\n\t\t{{#view KG.Button tagName=\"div\" class=\"ios-button ios-tb-left\" isVisibleBinding=\"KG.inspectorController.isDirty\"  sc_action=\"cancelInspectorAction\" titleBinding=\"KG.inspectorController.cancelTitle\"}}\n\t\t\t{{loc _cancel}}\n\t\t{{/view}}\n\t\t<h1 class=\"label-ellipsis\" {{bindAttr title=\"KG.inspectorController.title\"}}>{{KG.inspectorController.title}}</h1>\n\t\t{{#view KG.Button tagName=\"div\" class=\"ios-button ios-tb-right\"  sc_action=\"closeInspectorAction\" titleBinding=\"KG.inspectorController.saveTitle\"}}\n\t\t\t{{KG.inspectorController.saveLabel}}\n\t\t{{/view}}\t\t\t\n\t{{/view}}\t\n\t<div id=\"inspector-panel\">\t\t\t\t\t\t\n\t\t{{#collection contentBinding=\"KG.inspectorController\" class=\"inspector-attrs-list\"}}\n\t\t\t{{view KG.InspectorAttributeView class=\"inspector-list-item\" classBinding=\"itemView.content.css_class\"}}\n\t\t{{/collection}}\t\n\t\t<div id=\"comment-super-panel\">\n\t\t</div>\t\t\t\n\t\t{{#view KG.Button tagName=\"div\" class=\"delete-feature red-button\"  sc_action=\"deleteFeatureInspectorAction\" titleBinding=\"KG.inspectorController.deleteTitle\" isVisibleBinding=\"KG.inspectorController.isWriteable\"}}\n\t\t\t{{loc _Delete}}\n\t\t{{/view}}\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t</div>\t\t\t\t\n{{/view}}\n");
});spade.register("kloudgis/sandbox/templates/label_renderer", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("<span class=\"inspector-attr-name\">\n\t{{itemView.content.label}}\n</span>\t\n\n<div class=\"inspector-attr-value\">\n\t<span>\n\t\t{{itemView.content.value}}\n\t</span>\n</div>\n");
});spade.register("kloudgis/sandbox/templates/multiple_notes_popup", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("{{#view class=\"multiple-notes-title\"}}\n\t{{KG.notesPopupController.popupTitle}}\n{{/view}}\n{{#collection contentBinding=\"KG.notesPopupController\" tagName=\"ul\" class=\"multiple-notes-list no-style-list\"}}\t\t\t\n\t{{#view KG.NotePopupItemView class=\"multiple-notes-item common-list-button\"}}\n\t\t<table class=\"multiple-notes-table\">\n\t\t<td>\n\t\t{{#view class=\"multiple-notes-item-title\"}}\n\t\t\t{{itemView.content.title}}\n\t\t{{/view}}\n\t\t</td>\n\t\t<td>\n\t\t{{#view class=\"note-author-label\"}}\n\t\t\t{{itemView.content.authorFormatted}}\n\t\t{{/view}}\n\t\t</td>\n\t\t</table>\n\t{{/view}}\n{{/collection}}\n");
});spade.register("kloudgis/sandbox/templates/note_comments", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("{{#view KG.Button  manualMouseDown=\"yes\" tagName=\"span\" isVisibleBinding=\"KG.noteCommentsController.showButtonVisible\"  sc_action=\"showNoteCommentsAction\"}}\n\t<a href=\"javascript:void(0)\">\n\t\t{{KG.noteCommentsController.commentsLabel}}\n\t\t</a>\n{{/view}}\n{{#view id=\"note-comments-container\" classBinding=\"KG.noteCommentsController.showing\"}}\n\t{{#collection contentBinding=\"KG.noteCommentsController.content\" class=\"comment-list\"}}\n\t\t{{#view KG.Button manualMouseDown=\"yes\" tagName=\"div\" sc_action=\"toggleDeleteNoteCommentButtonAction\"}}\n\t\t\t<table style=\"width:100%\">\n\t\t\t<tr>\n\t\t\t\t<td>\n\t\t\t\t\t{{#view KG.AuthorView class=\"comment-author\"}}\n\t\t\t\t\t\t{{authorLabel}}\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t{{/view}}\n\t\t\t\t\t{{#view class=\"comment-content\"}}\n\t\t\t\t\t\t{{itemView.content.comment}}\n\t\t\t\t\t{{/view}}\n\t\t\t\t\t{{#view class=\"comment-date\"}}\n\t\t\t\t\t\t{{itemView.content.formattedDate}}\n\t\t\t\t\t{{/view}}\n\t\t\t\t</td>\n\t\t\t\t<td style=\"text-align:right;vertical-align:middle\">\n\t\t\t\t\t{{#view KG.DeleteNoteCommentView manualMouseDown=\"yes\" class=\"comment-delete red-button\" sc_action=\"deleteNoteCommentButtonAction\"}}\n\t\t\t\t\t\t{{label}}\n\t\t\t\t\t{{/view}}\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t\t</table>\n\t\t{{/view}}\n\t{{/collection}}\t\t\t\n{{/view}}\n{{view KG.CommentAreaView id=\"note-new-comment-area\" class=\"new-comment-area\" isVisibleBinding=\"KG.noteCommentsController.showing\" valueBinding=\"KG.noteNewCommentController.content\" placeholder_not_loc=\"_commentPlaceholder\" nl_sc_action=\"addNoteCommentAction\"}}\n{{#view KG.LoadingImageView id=\"note-comment-loading\" class=\"comment-loading\" isVisibleBinding=\"KG.noteCommentsController.isLoading\"}}\n\t<img {{bindAttr src=\"loadingImage\"}} alt=\"Loading\"/>\n{{/view}}\n");
});spade.register("kloudgis/sandbox/templates/notification_panel", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("{{#view KG.Button id=\"notification-button\" tagName=\"div\" sc_action=\"toggleNotificationPopupAction\" class=\"header-button header-button-icon\" classBinding=\"KG.notificationsController.activePopup\" notificationCountBinding=\"KG.notificationsController.length\"}}\n\t\t{{#view class=\"capsule-label\" isVisibleBinding=\"KG.notificationsController.hasNotification\"}}\n\t\t\t{{parentView.notificationCount}}\n\t\t{{/view}}\n\t\t<span class=\"button-image\"><span>\n\t\t{{#view id=\"super-notification-popup\" isVisibleBinding=\"KG.notificationsController.activePopup\"}}\n\t\t\t\t\t\t{{#view id=\"notification-popup\" }}\n\t\t\t\t\t\t\t{{#view id=\"notification-label\"}}\n\t\t\t\t\t\t\t\t{{loc _notificationTitle}}\n\t\t\t\t\t\t\t{{/view}}\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t{{#view KG.Button id=\"notification-send-button\" tagName=\"span\" class=\"white-button unselectable\" classBinding=\"KG.notificationsController.hasNotification\" sc_action=\"sendTextNotificationAction\"}}\n\t\t\t\t\t\t\t\t{{loc _notificationSendText}}\n\t\t\t\t\t\t\t{{/view}}\n\t\t\t\t\t\t\t{{#view KG.Button id=\"notification-clear-button\" tagName=\"span\" class=\"red-button unselectable\" \n\t\t\t\t\t\t\t isVisibleBinding=\"KG.notificationsController.hasNotification\" sc_action=\"clearNotificationAction\"}}\n\t\t\t\t\t\t\t\t{{loc _notificationClear}}\n\t\t\t\t\t\t\t{{/view}}\t\t\t\t\t\t\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t{{#collection id=\"notification-collection\" contentBinding=\"KG.notificationsController.content\"}}\t\t\t\t\t\n\t\t\t\t\t\t\t\t{{#view KG.NotificationView class=\"notification-item\"}}\n\t\t\t\t\t\t\t\t\t{{#view class=\"notification-item-title\"}}\n\t\t\t\t\t\t\t\t\t\t<a {{bindAttr href=\"parentView.authorMailTo\"}}> {{parentView.authorValue}}</a>{{parentView.titleValue}}{{parentView.dateValue}}\n\t\t\t\t\t\t\t\t\t{{/view}}\n\t\t\t\t\t\t\t\t\t{{#view class=\"notification-item-message\"}}\n\t\t\t\t\t\t\t\t\t\t<!-- triple brakets to unescape HTML -->\n\t\t\t\t\t\t\t\t\t\t{{{parentView.messageValue}}}\n\t\t\t\t\t\t\t\t\t{{/view}}\n\t\t\t\t\t\t\t\t{{/view}}\n\t\t\t\t\t\t\t\t{{/collection}}\n\t\t\t\t\t\t{{/view}}\n\t\t{{/view}}\n{{/view}}\t\t\t\n");
});spade.register("kloudgis/sandbox/templates/num_range_renderer", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("<span class=\"inspector-attr-name\">\n\t{{itemView.content.label}}\n</span>\t\n<div class=\"inspector-attr-value\">\n\t{{#view KG.NumericTextField valueBinding=\"itemView.content.value\" type=\"range\" minBinding=\"itemView.content.min\" maxBinding=\"itemView.content.max\" stepBinding=\"itemView.content.step\" disabledBinding=\"KG.inspectorController.isReadOnly\"}}\n\t{{/view}}\n</div>\n");
});spade.register("kloudgis/sandbox/templates/num_renderer", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("<span class=\"inspector-attr-name\">\n\t{{itemView.content.label}}\n</span>\t\n<div class=\"inspector-attr-value\">\n\t{{#view KG.NumericTextField valueBinding=\"itemView.content.value\" type=\"number\" minBinding=\"itemView.content.min\" maxBinding=\"itemView.content.max\" stepBinding=\"itemView.content.step\" disabledBinding=\"KG.inspectorController.isReadOnly\"}}\n\t{{/view}}\n</div>\n");
});spade.register("kloudgis/sandbox/templates/page_header", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("{{#view tagName=\"header\" id=\"sandbox-header\"}}\n\t{{#view KG.Button id=\"active-sandbox-button\" tagName=\"div\" class=\"header-button\" disabled=\"yes\"}}\n\t\t<div class=\"message-label\"><span class=\"label-ellipsis\">{{KG.core_sandbox.sandboxLabel}}</span></div>\n\t{{/view}}\n\t{{view templateName=\"active-user-panel\"}}\n\t{{#view KG.Button id=\"palette-button\" tagName=\"div\" class=\"header-button header-button-icon\" sc_action=\"showPaletteAction\"}}\n\t\t<img src=\"resources/images/palette.png\">\n\t{{/view}}\n\t{{#view KG.Button id=\"create-note-button\" tagName=\"div\" class=\"header-button header-button-icon\" sc_action=\"createNoteAction\"}}\n\t\t<img src=\"resources/images/note.png\">\n\t{{/view}}\n\t{{view templateName=\"notification-panel\"}}\n\t\n\t{{#view KG.Button id=\"search-button\" tagName=\"div\" sc_action=\"toogleSearchPopopAction\" class=\"header-button header-button-icon\" classBinding=\"KG.searchController.activePopup\"}}\n\t\t\t<span class=\"button-image\"><span>\n\t{{/view}}\n\t\n\t{{view templateName=\"bookmark-panel\"}}\n{{/view}}\n");
});spade.register("kloudgis/sandbox/templates/palette", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("{{#view id=\"super-palette\" classBinding=\"KG.paletteController.active\"}}\t\n\t{{#view id=\"palette-title\" tagName=\"header\"}}\n\t\t{{#view KG.Button tagName=\"div\" class=\"ios-button ios-tb-left\" isVisibleBinding=\"KG.paletteController.isDirty\"  sc_action=\"cancelPaletteAction\" titleBinding=\"KG.paletteController.cancelTitle\"}}\n\t\t\t{{loc _cancel}}\n\t\t{{/view}}\n\t\t<h1 class=\"label-ellipsis\" {{bindAttr title=\"KG.paletteController.title\"}}>{{loc _paletteTitle}}</h1>\n\t\t{{#view KG.Button tagName=\"div\" class=\"ios-button ios-tb-right\"  sc_action=\"closePaletteAction\" titleBinding=\"KG.paletteController.closeTitle\"}}\n\t\t\t{{loc _close}}\n\t\t{{/view}}\n\t{{/view}}\t\n\t<div id=\"palette-panel\">\n\t\t\t{{#collection contentBinding=\"KG.paletteController.content\" class=\"palette-list\"}}\n\t\t\t\t{{#view KG.Button tagName=\"div\" class=\"white-button\" sc_action=\"selectPaletteItemAction\"}}\n\t\t\t\t\t{{itemView.content.label}}\n\t\t\t\t{{/view}}\n\t\t\t{{/collection}}\n\t</div>\n{{/view}}\n");
});spade.register("kloudgis/sandbox/templates/search_panel", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("{{#view id=\"super-search-popup\" classBinding=\"KG.searchController.activePopup\"}}\n\t\t\t\t{{view KG.Button class=\"x-button search-close-button\"  sc_action=\"toogleSearchPopopAction\"}}\n\t\t\t\t{{#view id=\"search-popup\" }}\n\t\t\t\t\t{{view KG.SearchField resultsBinding=\"KG.searchController.searchHistorySize\" placeholder_not_loc=\"_search\" valueBinding=\"KG.searchController.searchValue\"}}\n\t\t\t\t\t\t{{#collection contentBinding=\"KG.searchController\" isVisibleBinding=\"KG.searchController.hasResults\" class=\"search-cat-list\" itemViewClass=\"KG.RecordsButtonView\"}}\t\t\n\t\t\t\t\t\t\t{{#view KG.Button class=\"search-cat-item common-list-button\" tagName=\"div\" sc_action=\"selectSearchCategoryAction\" recordsVisibleBinding=\"recordsVisible\" classBinding=\"recordsVisible\"}}\n\t\t\t\t\t\t\t\t{{#view class=\"cat-title-label label-ellipsis\" titleBinding=\"itemView.content.title\"}}\n\t\t\t\t\t\t\t\t\t{{itemView.content.title}}\n\t\t\t\t\t\t\t\t{{/view}}\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t{{#view class=\"cat-size-label label-ellipsis capsule-label\" tagName=\"span\"}}\n\t\t\t\t\t\t\t\t\t{{itemView.content.count}}\n\t\t\t\t\t\t\t\t{{/view}}\n\t\t\t\t\t\t\t{{/view}}\n\t\t\t\t\t\t\t<div class=\"super-result-list\">\n\t\t\t\t\t\t\t\t{{#collection contentBinding=\"records\" class=\"search-result-list\" recordsVisibleBinding=\"recordsVisible\" classBinding=\"recordsVisible\"}}\n\t\t\t\t\t\t\t\t\t{{#view KG.Button class=\"search-record-item common-list-button\" tagName=\"div\" sc_action=\"featureZoomAction\"}}\n\t\t\t\t\t\t\t\t\t\t{{#view class=\"label-ellipsis\" titleBinding=\"itemView.content.title\"}}\n\t\t\t\t\t\t\t\t\t\t\t{{itemView.content.title}}\n\t\t\t\t\t\t\t\t\t\t{{/view}}\n\t\t\t\t\t\t\t\t\t\t{{#view KG.Button isVisibleBinding=\"itemView.content.isSelectable\" class=\"search-select\" tagName=\"div\"  sc_action=\"selectFeatureInspectorAction\"}}\t\n\t\t\t\t\t\t\t\t\t\t\t<img src=\"resources/images/right_arrow_24.png\"/>\t\t\n\t\t\t\t\t\t\t\t\t\t\t{{/view}}\n\t\t\t\t\t\t\t\t\t{{/view}}\n\t\t\t\t\t\t\t\t{{/collection}}\n\t\t\t\t\t\t\t\t<div class=\"more-panel\">\n\t\t\t\t\t\t\t\t\t{{#view KG.Button class=\"white-button search-more-result\" isVisibleBinding=\"hasMoreResult\" sc_action=\"showMoreResultsAction\"}}\n\t\t\t\t\t\t\t\t\t\t{{loc _showMore}}\n\t\t\t\t\t\t\t\t\t{{/view}}\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t{{/collection}}\n\t\t\t\t\t\t{{#collection contentBinding=\"KG.core_search.plugins\" isVisibleBinding=\"KG.core_search.searchAsked\" class=\"search-cat-list\" itemViewClass=\"KG.PluginRecordsButtonView\"}}\n\t\t\t\t\t\t\t{{#view KG.Button class=\"search-plugin-item common-list-button\" tagName=\"div\" sc_action=\"selectSearchPluginAction\" recordsVisibleBinding=\"recordsVisible\" classBinding=\"recordsVisible\"}}\n\t\t\t\t\t\t\t\t{{#view class=\"plugin-title-label label-ellipsis\" titleBinding=\"itemView.content.title\"}}\n\t\t\t\t\t\t\t\t\t{{itemView.content.title}}\n\t\t\t\t\t\t\t\t{{/view}}\n\t\t\t\t\t\t\t{{/view}}\n\t\t\t\t\t\t\t{{#collection contentBinding=\"records\" class=\"search-result-list\" recordsVisibleBinding=\"recordsVisible\" classBinding=\"recordsVisible\"}}\n\t\t\t\t\t\t\t\t{{#view KG.Button class=\"search-record-item common-list-button\" tagName=\"div\" sc_action=\"featureZoomAction\"}}\n\t\t\t\t\t\t\t\t\t{{#view class=\"label-ellipsis\" titleBinding=\"itemView.content.title\"}}\n\t\t\t\t\t\t\t\t\t\t{{itemView.content.title}}\n\t\t\t\t\t\t\t\t\t{{/view}}\n\t\t\t\t\t\t\t\t\t{{#view KG.Button isVisibleBinding=\"itemView.content.hasCreateNote\" class=\"search-create-note\" tagName=\"div\"  sc_action=\"createNoteFromFeatureAction\"}}\t\n\t\t\t\t\t\t\t\t\t\t<img src=\"resources/images/note_black.png\"/>\t\t\n\t\t\t\t\t\t\t\t\t{{/view}}\n\t\t\t\t\t\t\t\t{{/view}}\n\t\t\t\t\t\t\t{{/collection}}\n\t\t\t\t\t\t{{/collection}}\n\t\t\t\t{{/view}}\n{{/view}}\n");
});spade.register("kloudgis/sandbox/templates/send_text_notification", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("<div id=\"send-notification-panel\">\n\t{{KG.sendNotificationController.notificationLabel}}\n\t{{view KG.Button class=\"x-button notification-close-button\"  sc_action=\"closeSendNotificationAction\" titleBinding=\"KG.sendNotificationController.closeLabel\"}}\n\t{{view KG.TextNotificationAreaView valueBinding=\"KG.sendNotificationController.content\"}}\n\t{{KG.sendNotificationController.feedbackMessage}}\n\t{{#view KG.Button class=\"white-button send-notification-button\"  sc_action=\"sendNotificationButtonAction\"}}\n\t\t{{KG.sendNotificationController.sendLabel}}\n\t{{/view}}\n\t{{view SC.Checkbox valueBinding=\"KG.sendNotificationController.sendOnEnterValue\"}}\n\t<img src=\"resources/images/return.png\" {{bindAttr title=\"KG.sendNotificationController.sendOnEnterTooltip\"}}/>\n\t{{#view KG.LoadingImageView isVisibleBinding=\"KG.sendNotificationController.hasNotificationPending\"}}\n\t\t<img {{bindAttr src=\"loadingImage\"}} alt=\"Loading\"/>\n  \t{{/view}}\t\t\n</div>\n");
});spade.register("kloudgis/sandbox/templates/text_renderer", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("<span class=\"inspector-attr-name\">\n\t{{itemView.content.label}}\n</span>\t\n<div class=\"inspector-attr-value\">\n\t{{#view KG.TextField valueBinding=\"itemView.content.value\" spellcheck=\"false\" autocorrect=\"off\" autocapitalize=\"off\" disabledBinding=\"KG.inspectorController.isReadOnly\"}}\n\t{{/view}}\n</div>\n");
});