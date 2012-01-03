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
    createNoteLabel: "_createNote".loc(),

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

KG.bookmarksController = SC.ArrayProxy.create({
	content: [],
	activePopup: NO,
	editMode: NO	
	
});

});spade.register("kloudgis/sandbox/lib/controllers/comments", function(require, exports, __module, ARGV, ENV, __filename){
//super class for comments controllers (note + feature)
KG.CommentsController = SC.ArrayProxy.extend({

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

	commentsBinding: 'KG.inspectorController.feature.comments'	
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

KG.infoController = SC.ArrayProxy.create({
	content: [],
	
	//show/hide the other possible features 
	listVisible: NO,
	
	featureCount: function(){
		return this.getPath('content.length');
	}.property('content.length'),
	
	multipleFeatures:function(){
		return this.get('featureCount') > 1;
	}.property('featureCount')
});

});spade.register("kloudgis/sandbox/lib/controllers/inspector", function(require, exports, __module, ARGV, ENV, __filename){
/**
* List of feature attributes to render in the inspector.
**/

KG.inspectorController = SC.ArrayProxy.create({
	//attributes
	content: [],
	feature: null,
	
	//inspector title (top)
	title: function() {
        var f = this.get('feature');
		if(f){
			return f.get('title');
		}
    }.property('feature.title'),
	
	isDirty: function(){
		return this.getPath('feature.status') & SC.Record.DIRTY;
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
			return "_closeInspectorLabel".loc();
		}
	}.property('isDirty')
});

});spade.register("kloudgis/sandbox/lib/controllers/layers", function(require, exports, __module, ARGV, ENV, __filename){
/**
* List of WMS layers
**/

KG.layersController = SC.ArrayProxy.create({
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

KG.noteMarkersController = SC.ArrayProxy.create({
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

KG.notesPopupController = SC.ArrayProxy.create({
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

KG.notificationsController = SC.ArrayProxy.create({
	content: [],
	
	activePopup: NO,
	
	hasNotification: function(){
		return this.get('length') > 0;
	}.property('length')
});

});spade.register("kloudgis/sandbox/lib/controllers/search", function(require, exports, __module, ARGV, ENV, __filename){
/**
* List of Search categories upon search request.
**/

KG.searchController = SC.ArrayProxy.create({
	content: [],
	searchHistorySize: 5,
	searchValue: null,
	
	hasResults: function(){
		return this.getPath('content.length') > 0;
	}.property('content.length'),
	
});

});spade.register("kloudgis/sandbox/lib/controllers/search_results", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Features found on search category selection.
**/

KG.searchResultsController = SC.ArrayProxy.create({
	content: [],
	closeLabel: "_closeSearch".loc(),
	listVisible: NO,
	category: null,
	plugin: null,
	
	listTitle: function(){
		if(SC.none(this.get('content'))){
			return '';
		}else{
			var cat = this.get('category');
			if(SC.none(cat)){
				var plugin = this.get('plugin');
				if(!SC.none(plugin)){
					return "_searchResult".loc(this.getPath('content.length'), plugin.get('searchValue'), plugin.get('pluginName'));
				}
			}else{
				return "_searchResult".loc(this.getPath('content.length'), cat.get('search'), cat.get('title'));
			}
		}
	}.property('content.length'),
	
	hasResults: function(){
		return this.getPath('content.length') > 0;
	}.property('content.length')
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
                SC.run.begin();
                if (KG.infoController.get('status') & SC.Record.ERROR) {
                    this._finding = NO;
                }
                self.findFeaturesAt(lonLat);
                SC.run.end();
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
        if (SC.none(this._div_info)) {
            this._div_info = document.createElement('div');         
        }
		this.clearViewInfo();
		this._view_info = SC.View.create({
            templateName: 'info-popup',
        });
        this._view_info.appendTo(this._div_info);
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
                var div = this._div_info;
                KG.core_leaflet.showPopupInfo(center, div);
            }
        }

    },

    hideInfoPopup: function() {
        KG.core_leaflet.closePopup();
		this.clearViewInfo();
    },

    expandPopupDidChange: function() {
        setTimeout(function() {
            SC.run.begin();
            KG.core_leaflet.updatePopupInfo();
            SC.run.end();
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
        comment.destroy();
        //commit only on record
        KG.store.commitRecords(null, null, [comment.get('storeKey')]);
    }
});

});spade.register("kloudgis/sandbox/lib/core_layer", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Core functions to manage the layers
**/

KG.core_layer = SC.Object.create({
	
	loadLayers:function(){		
		var layers = KG.store.find(KG.LAYER_QUERY);
		KG.layersController.set('content', layers);
		layers.onReady(this, this._layersReady);
	},
	
	_layersReady: function(layers){
		//FIXME: sortProperty is not yet implemented in beta3
		var ordered = layers;//layers.sortProperty('renderOrder'); 
		
		ordered.filterProperty('visibility', YES).filterProperty('canRender', YES).forEach(function(layer){
			KG.core_leaflet.addWMSLayer(layer);
		});
	},
	
	getLayersSelection: function(){
		var layers = KG.layersController.get('content');
		if(!SC.none(layers) && layers.get('length') > 0){
			var sel = layers.filterProperty('visibility', YES).filterProperty('isSelectable', YES);
			return sel;
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
        this._new_note_marker = KG.core_leaflet.addNewNoteMarker("_moveNote".loc());
        return YES;
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
                this._new_note_marker = KG.core_leaflet.addNewNoteMarker(null, feature.get('center'));
            }
        } else {
            if (this._new_note_marker.get('lon') && this._new_note_marker.get('lat')) {
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
                SC.run.begin();
                KG.core_leaflet.showPopupMarker(marker, noteDiv);
                SC.run.end();
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
            templateName: 'notes-marker-popup',
        });
        this._view_multiple_notes.appendTo(div);
        setTimeout(function() {
            SC.run.begin();
            KG.core_leaflet.showPopupMarker(marker, div);
            SC.run.end();
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

    /**
	* flush and recalculate the note clusters
	**/
    refreshMarkers: function(force) {
        console.log('Refresh markers, Force:' + force);
        var bounds = KG.core_leaflet.getBounds();
        var zoom = KG.core_leaflet.getZoom();
        if (force || SC.none(this._zoom) || this._zoom != zoom || SC.none(this._bounds) || !this._bounds.contains(bounds)) {
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
                //completly remove the marker - no good anymore
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
                KG.core_leaflet.addMarker(marker, this, this.markerClicked);
            }
        }
        //readd the hl marker if any (to put it on top)
        if (this._highlightMarker) {
            KG.core_leaflet.reAddMarker(this._highlightMarker);
        }
    },

    /**
	* The user just click a marker. Try to continue.
	**/
    markerClicked: function(marker) {
        KG.statechart.sendAction('clickMarkerAction', marker);
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

});spade.register("kloudgis/sandbox/lib/core_sandbox", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Core functions for the Sandbox page
**/

KG.core_sandbox = SC.Object.create({

    sandboxMeta: {},
    membership: null,
    isSandboxOwner: NO,

    mousePosition: null,

    setCenter: function(lonLat, zoom) {
        window.location.hash = 'lon:%@;lat:%@;zoom:%@'.fmt(lonLat.get('lon').toFixed(4), lonLat.get('lat').toFixed(4), zoom);
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
        $('#active-sandbox-label span').text(this.get('sandboxMeta').name);
        this.set('isSandboxOwner', KG.core_auth.get('activeUser').id === this.get('sandboxMeta').owner)
    }.observes('sandboxMeta'),

    extractHashValues: function() {
        var hashLoc = window.location.hash;
        if (hashLoc && hashLoc.length > 0) {
            var tokens = hashLoc.split(';');
            if (tokens.length === 3) {
                return {
                    lon: parseFloat(tokens[0].substring(5)),
                    lat: parseFloat(tokens[1].substring(4)),
                    zoom: parseInt(tokens[2].substring(5))
                }
            }
        }
        return {};
    },

    addMap: function() {
        var hash = this.extractHashValues();
        KG.core_leaflet.addToDocument(hash.lon, hash.lat, hash.zoom);
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
		if(!options){
			options = {extraSpace:20};
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
        return this.get('membership').access_type === 'owner' || this.get('membership').access_type === 'regular';
    }
});

$(document).ready(function() {
    KG.statechart.initStatechart();
    /*if ($.browser.isIphone) {
        //tweaks to hide the address bar
        $('#box').addClass('mobile');
        setTimeout(function() {
            window.scrollTo(0, 1);
        },
        1000);
    }*/
});

});spade.register("kloudgis/sandbox/lib/core_search", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Core functions to perform searches
**/

KG.core_search = SC.Object.create({

    plugins: [],
	searchAsked: NO,

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
        KG.searchResultsController.set('listVisible', YES);
        var cat = KG.searchResultsController.get('category');
        if (SC.none(cat)) {
            var plugin = KG.searchResultsController.get('plugin');
            if (!SC.none(plugin)) {
                plugin.loadRecords(null, function(records) {
                    KG.searchResultsController.set('content', records);
                });
            }
        } else {
            var records = cat.get('records');
            KG.searchResultsController.set('content', records);
        }
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
        600);
    }
});

});spade.register("kloudgis/sandbox/lib/core_statechart", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Statechart for the sandbox page
**/

SC.mixin(KG, {
    //sandbox page state chart
    statechart: SC.Statechart.create({
        //log trace
        trace: NO,

        rootState: SC.State.extend({

            initialSubstate: 'tryAuthenticateState',

            //******************************
            // transient state to check 
            // if the user is logged in
            //******************************
            tryAuthenticateState: SC.State.extend({
                enterState: function() {
                    var sb = $.getQueryString('sandbox');
                    KG.set('activeSandboxKey', sb);

                    setTimeout(function() {
                        SC.run.begin();
                        KG.core_sandbox.authenticate();
                        SC.run.end();
                    },
                    1);
                },

                authenticationSucceeded: function() {
                    this.gotoState('tryMembershipState');
                },

                authenficationFailed: function() {
                    window.location.href = "index.html";
                }
            }),

            //******************************
            // transient state to check 
            // if the user is a member of 
            // the selected sandbox
            //******************************
            tryMembershipState: SC.State.extend({

                enterState: function() {
                    //show the map to not slow down the app
                    KG.core_sandbox.addMap();
                    KG.core_sandbox.membershipCheck();
                    KG.core_sandbox.fetchSandboxMeta();
                },

                membershipSucceeded: function() {
                    this.gotoState('runningState');
                },

                membershipFailed: function() {
                    window.location.href = "home.html?message=_wrong-membership";
                }
            }),

            //login successful on the map service.  We can add the layers
            mapLoginSucceeded: function() {
                KG.core_layer.loadLayers();
                KG.core_bookmark.loadBookmarks();
            },

            //******************************
            // Running 
            // The user can now use the App.
            //******************************
            runningState: SC.State.extend({

                substatesAreConcurrent: YES,

                enterState: function() {
                    KG.core_notification.listen();
                    //fetch the featuretypes and attrtypes locally
                    KG.store.find(KG.FEATURETYPE_QUERY);
                    KG.store.find(KG.ATTRTYPE_QUERY);
                },

                //******************************
                // Concurrent state for Inpector
                // Inspector 
                //******************************
                inspectorState: SC.State.extend({
                    initialSubstate: 'inspectorHiddenState',

                    //******************************
                    // Inspector is Hidden 
                    //******************************
                    inspectorHiddenState: SC.State.extend({

                        selectFeatureInspectorAction: function(feature) {
                            if (feature && feature.get('isSelectable') && feature.get('isInspectorSelectable')) {
                                this.gotoState('inspectorVisibleState');
                                KG.core_inspector.selectFeature(feature);
                            }
                        }
                    }),

                    //******************************
                    // Inspector is visible
                    //******************************
                    inspectorVisibleState: SC.State.extend({

                        enterState: function() {
                            var panel = $('#left-side-panel');
                            panel.addClass('active');
                            KG.featureCommentsController.set('commentsPanelVisible', YES);
                        },

                        exitState: function() {
                            var panel = $('#left-side-panel');
                            panel.removeClass('active');
                            KG.core_inspector.commitModifications();
                            KG.core_inspector.removeHighlight();
                            KG.featureCommentsController.set('commentsPanelVisible', NO);
							KG.featureCommentsController.set('showing', NO);
							setTimeout(function(){
								KG.inspectorController.set('feature', null);
						        KG.inspectorController.set('content', null);
							},500);
                        },

                        selectFeatureInspectorAction: function(feature) {
                            if (feature && feature.get('isSelectable') && feature.get('isInspectorSelectable')) {
                                KG.core_inspector.selectFeature(feature);
                            }
                        },

                        closeInspectorAction: function() {
                            this.gotoState('inspectorHiddenState');
                        },

                        cancelInspectorAction: function() {
                            KG.core_inspector.rollbackModifications();
                            this.gotoState('inspectorHiddenState');
                        },

                        showFeatureCommentsAction: function() {
                            if (KG.featureCommentsController.get('showing')) {
                                //hide comment section
                                KG.featureCommentsController.set('showing', NO);
                            } else {
                                //show comment section
                                if (KG.featureCommentsController.get('length') === 0) {
                                    KG.core_inspector.fetchComments();
                                }
                                KG.featureCommentsController.set('showing', YES);
                                setTimeout(function() {
                                    KG.core_sandbox.autosize('#feature-new-comment-area',{minHeight: 0, extraSpace:45});
                                    if (KG.featureCommentsController.getPath('content.length') === 0) {
										var area = $("#feature-new-comment-area").focus();
                                    }
                                },
                                1);
                            }
                        },

                        addFeatureCommentAction: function() {
                            var comment = KG.featureNewCommentController.get('content');
                            if (!SC.none(comment)) {
                                comment = comment.replace("\n", '');
                                if (comment.length > 0) {
                                    KG.core_inspector.addComment(comment);
                                }
                            }
                            KG.featureNewCommentController.set('content', '');
                        },

                        featureCommentsReadyEvent: function() {
                            setTimeout(function() {
                                console.log('scroll to bottom');
                                var container = $('#feature-comments-container');
                                if (container[0]) {
                                    container.scrollTop(container[0].scrollHeight);
                                }
                            },
                            1);
                        },

                        toggleDeleteFeatureCommentButtonAction: function(comment) {
                            if (KG.featureDeleteCommentController.get('content') === comment) {
                                KG.featureDeleteCommentController.set('content', null);
                            } else {
                                KG.featureDeleteCommentController.set('content', comment);
                            }
                        },

                        deleteFeatureCommentButtonAction: function(comment) {
                            if (KG.featureDeleteCommentController.get('content') == comment) {
                                KG.core_inspector.deleteComment(comment);
                                KG.featureDeleteCommentController.set('content', null);
                            }
                        }
                    })
                }),

                //******************************
                // Concurrent state for Popup that 
                // cannot be visible at the same time.
                // Map Interaction
                //******************************
                interactionPopupState: SC.State.extend({
                    initialSubstate: 'noPopupState',

                    toggleNotificationPopupAction: function() {
                        this.gotoState('notificationPopupState');
                    },

                    toggleBookmarkPopupAction: function() {
                        this.gotoState('bookmarkPopupState');
                    },

                    //******************************
                    // No popup visible
                    //******************************
                    noPopupState: SC.State.extend({
                        //nothing to do so far
                    }),

                    //******************************
                    // Notification Popup
                    //******************************
                    notificationPopupState: SC.State.extend({

                        enterState: function() {
                            KG.notificationsController.set('activePopup', YES);
                        },

                        exitState: function() {
                            KG.notificationsController.set('activePopup', NO);
                        },

                        sendTextNotificationAction: function() {
                            this.gotoState('sendNotificationState');
                        },

                        toggleNotificationPopupAction: function() {
                            this.gotoState('noPopupState');
                        },

                        clearNotificationAction: function() {
                            KG.notificationsController.set('content', []);
                            this.gotoState('noPopupState');
                        }
                    }),

                    //******************************
                    // Show a popup dialog to send a notification
                    //******************************
                    sendNotificationState: SC.State.extend({

                        view: null,
                        timeout: null,

                        enterState: function() {
                            KG.sendNotificationController.set('showing', YES);
                            this.view = SC.View.create({
                                templateName: 'send-text-notification'
                            });
                            this.view.append();
                            KG.core_sandbox.autosize('#send-notification-panel textarea');
                            this.focusArea();
                        },

                        exitState: function() {
                            KG.sendNotificationController.set('showing', NO);
                            KG.core_sandbox.destroyAutosize('#send-notification-panel textarea');
                            this.view.destroy();
                            this.view = null;
                            if (this.timeout) {
                                clearTimeout(this.timeout);
                                this.timeout = null;
                            }
                            KG.sendNotificationController.set('pendingMessage', null);
                            KG.sendNotificationController.set('feedbackMessage', '');
                            KG.sendNotificationController.set('content', '');
                        },

                        focusArea: function() {
                            setTimeout(function() {
                                $('#send-notification-panel textarea').focus();
                            },
                            300);
                        },

                        sendNotificationButtonAction: function() {
                            setTimeout(function() {
                                $('#send-notification-panel textarea').data('AutoResizer').check();
                            },
                            305);
                            this.sendNotificationAction();
                            this.focusArea();
                        },

                        sendNotificationAction: function() {
                            var message = KG.sendNotificationController.get('content');
                            if (message && message.length > 0) {
                                KG.sendNotificationController.set('content', '');
                                if (this.timeout) {
                                    clearTimeout(this.timeout);
                                }
                                var notification = KG.Message.create({
                                    type: 'text',
                                    user_descriptor: KG.core_sandbox.get('membership').user_descriptor,
                                    author: KG.core_auth.get('activeUser').user,
                                    content: {
                                        text: message
                                    },
                                    dateMillis: new Date().getTime()
                                });
                                KG.sendNotificationController.set('pendingNotification', notification);
                                var ret = KG.core_notification.postMessage(notification);
                                if (!ret) {
                                    KG.sendNotificationController.set('feedbackMessage', '_failedToSendMessage'.loc());
                                } else {
                                    KG.sendNotificationController.set('feedbackMessage', '');
                                    //10s timeout
                                    this.timeout = setTimeout(function() {
                                        KG.sendNotificationController.set('pendingNotification', null);
                                        KG.sendNotificationController.set('feedbackMessage', '_timeoutSendMessage'.loc());
                                    },
                                    10000);
                                }
                            }
                        },

                        notificationSent: function(message) {
                            var pending = KG.sendNotificationController.get('pendingNotification');
                            if (message && pending && SC.isEqual(message, pending)) {
                                KG.sendNotificationController.set('pendingNotification', null);
                                KG.sendNotificationController.set('feedbackMessage', '_sendMessageSuccessful'.loc());
                                if (this.timeout) {
                                    clearTimeout(this.timeout);
                                }
                            }
                        },

                        closeSendNotificationAction: function() {
                            this.gotoState('noPopupState');
                        }
                    }),

                    //******************************
                    // Bookmark Popup
                    //******************************
                    bookmarkPopupState: SC.State.extend({

                        initialSubstate: 'normalModeState',

                        enterState: function() {
                            KG.bookmarksController.set('activePopup', YES);
                            KG.core_bookmark.refreshBookmarks();
                        },

                        exitState: function() {
                            KG.bookmarksController.set('activePopup', NO);
                        },

                        toggleBookmarkPopupAction: function() {
                            this.gotoState('noPopupState');
                        },

                        refreshBookmarkAction: function() {
                            KG.core_bookmark.refreshBookmarks();
                        },

                        normalModeState: SC.State.extend({

                            selectBookmarkAction: function(bookmark) {
                                KG.core_bookmark.gotoBookmark(bookmark);
                                this.gotoState('noPopupState');
                            },

                            editBookmarkAction: function() {
                                this.gotoState('editModeState');
                            },

                            addBookmarkAction: function() {
                                this.gotoState('addModeState');
                            }
                        }),

                        editModeState: SC.State.extend({

                            enterState: function() {
                                KG.bookmarksController.set('editMode', YES);
                            },

                            exitState: function() {
                                KG.bookmarksController.set('editMode', NO);
                            },

                            deleteBookmarkAction: function(bookmark) {
                                KG.core_bookmark.deleteBookmark(bookmark);
                            },

                            editBookmarkAction: function() {
                                this.gotoState('normalModeState');
                            },

                            addBookmarkAction: function() {
                                this.gotoState('addModeState');
                            }
                        }),

                        addModeState: SC.State.extend({
                            view: null,

                            enterState: function() {
                                this.view = SC.View.create({
                                    templateName: 'add-bookmark'
                                });
                                this.view.append();
                                setTimeout(function() {
                                    $('#add-bookmark-panel input').focus();
                                },
                                300);
                            },

                            exitState: function() {
                                this.view.destroy();
                                KG.addBookmarkController.set('content', '');
                            },

                            addBookmarkAction: function() {
                                var label = KG.addBookmarkController.get('content');
                                var center = KG.core_leaflet.getCenter();
                                var zoom = KG.core_leaflet.getZoom();
                                KG.core_bookmark.addBookmark(label, center, zoom);
                                this.gotoState('normalModeState');
                            },

                            closeAddBookmarkAction: function() {
                                this.gotoState('noPopupState');
                            },

                            editBookmarkAction: function() {
                                this.gotoState('editModeState');
                            },
                        })
                    })
                }),

                //******************************
                // Concurrent state for Map Interaction
                // Map Interaction
                //******************************
                mapInteractionState: SC.State.extend({

                    initialSubstate: 'navigationState',

                    mapMovedAction: function() {
                        KG.core_note.refreshMarkers();
                    },

                    mapZoomedAction: function() {
                        KG.core_note.refreshMarkers();
                    },

                    //anytime, the user can perfrom a search
                    searchAction: function() {
                        KG.core_search.searchFeatures();
                    },

                    //select a search category from the list -> activate the result dialog
                    selectSearchCategoryAction: function(cat) {
                        KG.searchResultsController.set('category', cat);
                        this.gotoState('searchResultsState');
                    },

                    //select a search plugin from the list
                    selectSearchPluginAction: function(plugin) {
                        KG.searchResultsController.set('category', null);
                        KG.searchResultsController.set('plugin', plugin);
                        this.gotoState('searchResultsState');
                    },

                    //wipe the search category results
                    clearSearchAction: function() {
                        KG.core_search.clearSearchFeatures();
                    },

                    //a note as been clicked -> activate the note
                    clickMarkerAction: function(marker) {
                        this.gotoState('navigationState');
                        KG.core_note.continueMarkerClicked(marker);
                    },

                    //an ajax error happen... if 401, validate the login state
                    httpError: function(code) {
                        if (code === 401) {
                            KG.core_sandbox.authenticate();
                        }
                    },

                    //the user if definitly not logged in -> bring him back to the login page
                    authenficationFailed: function() {
                        window.location.href = "index.html";
                    },

                    //******************************
                    // Default state - Navigation
                    //******************************
                    navigationState: SC.State.extend({

                        _ignoreMouseClicked: YES,

                        enterState: function() {
                            console.log('enter navigation state');
                            //enable search field
                            KG.searchController.set('fieldDisabled', NO);
                            //refresh markers
                            KG.core_note.refreshMarkers();
                            var self = this;
                            setTimeout(function() {
                                self._ignoreMouseClicked = NO
                            },
                            100);
                        },

                        exitState: function() {
                            //disable search field
                            KG.searchController.set('fieldDisabled', YES);
                            this._ignoreMouseClicked = YES;
                        },

                        clickOnMapAction: function(lonLat) {
                            if (!this._ignoreMouseClicked) {
                                KG.core_sandbox.set('mousePosition', lonLat);
                                KG.core_info.findFeaturesAt(lonLat);
                            }
                        },

                        mousePositionChanged: function(lonLat) {
                            KG.core_sandbox.set('mousePosition', lonLat);
                        },

                        featureInfoReady: function() {
                            this.gotoState("popupFeatureInfoState");
                        },

                        clickMarkerAction: function(marker) {
                            KG.core_note.continueMarkerClicked(marker);
                        },

                        noteSelectedAction: function(note, params) {
                            KG.core_note.activateNote(note, params);
                            this.gotoState('editNoteState');
                        },

                        multipleNotesSelectedAction: function(notes, marker) {
                            KG.core_note.activateMultipleNotes(notes, marker);
                            this.gotoState('multipleNotesState');
                        },

                        createNoteAction: function() {
                            this.gotoState('locateNoteState');
                        }
                    }),

                    //******************************
                    // Show the search result
                    //******************************
                    searchResultsState: SC.State.extend({

                        _highlight: null,
                        _hlMarker: null,

                        enterState: function() {
                            console.log('show results state');
                            KG.core_search.showResults();
                        },

                        exitState: function() {
                            KG.core_search.hideResults();
                            KG.core_highlight.clearHighlight(this._highlight);
                            this._highlight = null;
                            KG.core_highlight.clearHighlightMarker(this._hlMarker);
                            this._hlMarker = null;
                        },

                        selectSearchCategoryAction: function(cat) {
                            KG.searchResultsController.set('category', cat);
                            KG.core_search.showResults();
                        },

                        selectSearchPluginAction: function(plugin) {
                            KG.searchResultsController.set('category', null);
                            KG.searchResultsController.set('plugin', plugin);
                            KG.core_search.showResults();
                        },

                        hideSearchResultAction: function() {
                            this.gotoState('navigationState');
                        },

                        createNoteFromFeatureAction: function(feature) {
                            //create the note and put it in edit mode
                            if (feature) {
                                KG.core_leaflet.setCenter(feature.get('center'));
                                KG.core_note.set('featureTemplate', feature);
                                this.gotoState('createNoteState');
                            }
                        },

                        featureZoomAction: function(feature) {
                            KG.core_highlight.clearHighlightMarker(this._hlMarker);
                            KG.core_highlight.clearHighlight(this._highlight);
                            this._highlight = KG.core_highlight.highlightFeature(feature);
                            if (KG.store.recordTypeFor(feature.get('storeKey')) === KG.Note) {
                                this._hlMarker = KG.core_highlight.addHighlightMarker(feature.get('center'));
                                KG.core_note.setHighlightMarker(this._hlMarker);
                            }
                            KG.core_leaflet.setCenter(feature.get('center'));

                        },

                        selectFeatureInspectorAction: function(feature) {
                            KG.core_highlight.clearHighlightMarker(this._hlMarker);
                            if (KG.store.recordTypeFor(feature.get('storeKey')) === KG.Note) {
                                var marker = KG.core_highlight.addHighlightMarker(feature.get('center'));
                                KG.core_note.setHighlightMarker(marker);
                                KG.core_note.activateNote(feature, {
                                    marker: marker
                                });
                                this.gotoState('editNoteState');
                            }
                        }
                    }),

                    //******************************
                    // Show the Feature Info result
                    //******************************
                    popupFeatureInfoState: SC.State.extend({

                        _highlight: null,

                        enterState: function() {
                            console.log('enter popupFeatureInfoState');
                            KG.core_info.showInfoPopup();
                        },

                        exitState: function() {
                            KG.core_highlight.clearHighlight(this._highlight);
                            this._highlight = null;
                            KG.core_info.hideInfoPopup();
                        },

                        hideInfoPopupAction: function() {
                            this.gotoState('navigationState');
                        },

                        selectFeatureInspectorAction: function() {
                            //the concurrent inspector state take care of showing the inspector
                            this.gotoState('navigationState');
                        },

                        featureInfoMouseUpAction: function(feature) {
                            KG.core_highlight.clearHighlight(this._highlight);
                            this._highlight = KG.core_highlight.highlightFeature(feature);
                        },

                        featureInfoMouseEnterAction: function(feature) {
                            KG.core_highlight.clearHighlight(this._highlight);
                            this._highlight = KG.core_highlight.highlightFeature(feature);
                        },

                        featureInfoMouseLeaveAction: function(feature) {
                            KG.core_highlight.clearHighlight(this._highlight);
                        }
                    }),

                    //******************************
                    // Show a popup dialog for note
                    //******************************
                    popupNoteState: SC.State.extend({

                        initialSubstate: 'locateNoteState',

                        exitState: function() {
                            KG.core_leaflet.closePopup();
                            KG.core_note.clearCreateNote();
                            var marker = KG.activeNoteController.get('marker');
                            if (marker) {
                                KG.core_leaflet.disableDraggableMarker(marker);
                            }
                        },

                        mapMovedAction: function() {
                            //override map interaction action
                        },

                        mapZoomedAction: function() {
                            //override map interaction action
                        },

                        hideMarkerPopupAction: function() {
                            console.log('marker popup closed, go back to navigation...');
                            this.gotoState('navigationState');
                        },

                        clickOnMapAction: function(lonLat) {
                            console.log('click outside the popup');
                            this.gotoState('navigationState');
                        },

                        //******************************
                        // As the user to locate the note
                        // to create
                        //******************************
                        locateNoteState: SC.State.extend({

                            enterState: function() {
                                console.log('enter locatenotestate');
                                this._ignoreCancel = YES;
                                var self = this;
                                setTimeout(function() {
                                    self._ignoreCancel = NO;
                                },
                                500);
                                KG.core_note.locateNote();
                                KG.activeNoteController.set('createNoteLabel', "_cancelCreateNote".loc());
                            },

                            exitState: function() {
                                KG.activeNoteController.set('createNoteLabel', "_createNote".loc());
                            },

                            hideMarkerPopupAction: function() {},

                            notePositionSetAction: function() {
                                console.log('note position is now set');
                                this.gotoState('createNoteState');
                            },

                            createNoteAction: function() {
                                if (!this._ignoreCancel) {
                                    console.log('cancel create note!');
                                    //cancel
                                    KG.core_note.cancelLocateNote();
                                    this.gotoState('navigationState');
                                }
                            }
                        }),

                        //******************************
                        // Show the form to enter the 
                        // note properties
                        //******************************
                        createNoteState: SC.State.extend({

                            enterState: function() {
                                console.log('enter createNoteState');
                                KG.core_note.createNote();
                                KG.core_sandbox.autosize('#note-description-area');
                            },

                            exitState: function() {
                                console.log('exit createNoteState');
                                KG.core_note.rollbackModifications();
                                KG.activeNoteController.set('content', null);
                                KG.core_note.clearCreateNote();
                                KG.core_sandbox.destroyAutosize('#note-description-area');
                            },

                            confirmNoteAction: function() {
                                var note = KG.activeNoteController.get('content');
                                KG.core_note.commitModifications(function(){KG.core_note.refreshMarkers(YES);});
                                KG.core_note.confirmCreateNote();
                                this.gotoState('navigationState');
                            },

                            cancelCreateNoteAction: function() {
                                this.gotoState('navigationState');
                            },

                            notePositionSetAction: function(lon, lat) {
                                KG.core_note.updatePosition(lon, lat);
                            }

                        }),

                        //******************************
                        // Show a dialog with a list
                        // of notes to let the user pick one.
                        //******************************
                        multipleNotesState: SC.State.extend({

                            enterState: function() {
                                console.log('enter multiple notes');
                            },

                            exitState: function() {
                                console.log('exit multiple notes');
                                KG.notesPopupController.set('marker', null);
                                KG.notesPopupController.set('content', []);
                                KG.core_note.cleanUpMultipleNotesElements();
                            },

                            noteSelectedAction: function(note, params) {
                                KG.core_note.activateNote(note, params);
                                this.gotoState('editNoteState');
                            }
                        }),

                        //******************************
                        // Edit note popup.
                        // Detail view on the active Note
                        //******************************
                        editNoteState: SC.State.extend({

                            dirtyMarker: NO,

                            enterState: function() {
                                console.log('enter editNoteState');
                                KG.core_note.beginModifications();
                                KG.noteNewCommentController.set('content', '');
                                KG.noteCommentsController.set('showing', NO);
                                KG.noteCommentsController.set('commentsPanelVisible', YES);
                                KG.noteCommentsController.set('isLoading', NO);
                                KG.core_sandbox.autosize('#note-description-area');
                            },

                            exitState: function() {
                                console.log('exit editNoteState');
                                KG.core_note.postEdition();
                                KG.activeNoteController.set('content', null);
                                KG.noteCommentsController.set('showing', NO);
                                KG.noteCommentsController.set('commentsPanelVisible', NO);
                                KG.noteDeleteCommentController.set('content', null);
                                KG.core_sandbox.destroyAutosize('#note-description-area');
                                if (this.dirtyMarker) {
                                    KG.core_note.refreshMarkers(YES);
                                    this.dirtyMarker = NO;
                                }
                            },

                            showNoteCommentsAction: function() {
                                if (KG.noteCommentsController.get('showing')) {
                                    //hide comment section
                                    KG.noteCommentsController.set('showing', NO);
                                } else {
                                    //show comment section
                                    if (KG.noteCommentsController.get('length') === 0) {
                                        KG.core_note.fetchComments();
                                    }
                                    KG.noteCommentsController.set('showing', YES);
                                    setTimeout(function() {
                                        KG.core_sandbox.autosize('#note-new-comment-area', {minHeight: 0, extraSpace:20});
                                        var area = $("#note-new-comment-area");
                                        if (KG.noteCommentsController.getPath('content.length') === 0) {
                                            area.focus();
                                        }
                                    },
                                    1);
                                }
                            },

                            addNoteCommentAction: function() {
                                var comment = KG.noteNewCommentController.get('content');
                                if (!SC.none(comment)) {
                                    comment = comment.replace("\n", '');
                                    if (comment.length > 0) {
                                        KG.core_note.addCommentToActiveNote(comment);
                                    }
                                }
                                KG.noteNewCommentController.set('content', '');
                            },

                            noteCommentsReadyEvent: function() {
                                setTimeout(function() {
                                    var container = $('#note-comments-container');
                                    if (container[0]) {
                                        container.scrollTop(container[0].scrollHeight);
                                    }
                                },
                                1);
                            },

                            toggleDeleteNoteCommentButtonAction: function(comment) {
                                if (KG.noteDeleteCommentController.get('content') === comment) {
                                    KG.noteDeleteCommentController.set('content', null);
                                } else {
                                    KG.noteDeleteCommentController.set('content', comment);
                                }
                            },

                            deleteNoteCommentButtonAction: function(comment) {
                                if (KG.noteDeleteCommentController.get('content') == comment) {
                                    KG.core_note.deleteComment(comment);
                                    KG.noteDeleteCommentController.set('content', null);
                                }
                            },

                            confirmNoteAction: function() {
                                var note = KG.activeNoteController.get('content');
                                KG.core_note.commitModifications(function(){KG.core_note.refreshMarkers(YES);});
								this.dirtyMarker = NO;
                                this.gotoState('navigationState');
                            },

                            deleteNoteAction: function() {
                                KG.core_note.deleteActiveNote();
                                KG.core_note.commitModifications();
                                this.gotoState('navigationState');
                            },

                            zoomNoteAction: function() {
                                KG.core_note.zoomActiveNote();
                                this.gotoState('navigationState');
                            },

                            markerDragEnded: function(lon, lat) {
                                this.dirtyMarker = YES;
                                KG.core_note.updatePosition(lon, lat);
                            }
                        })
                    })
                })
            })
        })
    })
});

});spade.register("kloudgis/sandbox/lib/main", function(require, exports, __module, ARGV, ENV, __filename){
require("kloudgis/app/lib/main");
require("kloudgis/app/lib/views/button");
require("kloudgis/app/lib/views/text_field");
require("kloudgis/app/lib/views/numeric_text_field");
require("kloudgis/app/lib/views/text_area");
require("kloudgis/app/lib/views/loading_image");
require("kloudgis/auth/lib/main");
require("kloudgis/core/lib/main_ds");
require("kloudgis/core/lib/models/feature");
require("kloudgis/core/lib/models/bounds");
require("kloudgis/core/lib/core_date");
require("./strings");
require("./core_statechart");
require("./core_sandbox");
require("./controllers/comments");
//map
require("kloudgis/map/lib/core_leaflet");
require("kloudgis/map/lib/core_highlight");

//search
require("kloudgis/core/lib/models/search_category");
require("./core_search");
require("./controllers/search");
require("./controllers/search_results");
require("./views/search_field");
require("./views/search_result_label");
//search plugins
require("./search_plugins/core_google");
require("./search_plugins/core_geonames");
require("./search_plugins/core_osm");
require("./search_plugins/core_yahoo");

//inspector
require("./core_inspector");
require("./controllers/inspector");
require("./views/inspector_attribute");
require("kloudgis/app/lib/views/switch");
require("kloudgis/app/lib/views/select");
require("./views/delete_feature_comment");
require("./controllers/feature_comments");
require("./controllers/feature_new_comment");
require("./controllers/feature_delete_comment");

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
require("./views/notification_button");
require("./views/text_notification_area");

//bookmark
require("./core_bookmark");
require("./controllers/bookmarks");
require("./controllers/add_bookmark");
require("kloudgis/app/lib/views/bubble_touch");
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
	"_closeInspectorLabel" : "Fermer",
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
	"_sendMessageSuccessful" : "Message envoyé."
};

var en = {
	"_me": "Me",
	"_save": "Save",
	"_cancel": "Cancel",
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
	"_moveNote": "Drag where you want it.",
	"_author": "By %@",
	"_0comment": "Add a comment",
	"_1comment": "One comment",
	"_comments": "%@ comments",
	"_0hideComment": "Hide",
	"_1hideComment": "Hide the comment",
	"_hideComments": "Hide the %@ comments",
	"_commentPlaceholder": "Write a comment...",
	"_closeInspectorTitle": "Close the Inspector",
	"_closeInspectorLabel" : "Close",
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
	"_sendMessageSuccessful" : "Message envoyé."	
};

if(KG.lang === 'fr'){
	SC.STRINGS = fr;
}else{
	SC.STRINGS = en;
}

//do the localize after the rendering
SC.run.schedule('render',null, function(){
	console.log('localize page');
	$('#back-home a').text("_backHome".loc());
});

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
	classNames: ['bookmark-item'],
	tagName: 'tr'
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

KG.FeatureInfoPopupItemView = SC.Button.extend({
	
	classNames: 'info-popup-item'.w(),
	
	tagName: 'div',
	
	isVisible: function(){
		if(this.get('ignoreIfFirst')){
			if(this.getPath('itemView.contentIndex') === 0){
				return NO;
			}
		}
		return YES;
	}.property('ignoreIfFirst'),

	
	mouseUp: function(e){
		var content = this.get('content') || this.getPath('itemView.content');
		KG.statechart.sendAction('featureInfoMouseUpAction', content);
		return NO;
	},
	
	mouseEnter: function(e){
		var content = this.get('content') || this.getPath('itemView.content');
		KG.statechart.sendAction('featureInfoMouseEnterAction', content);
		return NO;
	},
	
	mouseLeave: function(e){
		var content = this.get('content') || this.getPath('itemView.content');
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
			ren = SC.View.create({templateName: 'read-only-renderer', parentView: this});
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

});spade.register("kloudgis/sandbox/lib/views/notification_button", function(require, exports, __module, ARGV, ENV, __filename){
KG.NotificationButtonView = KG.Button.extend({
	notificationPath: 'resources/images/notification.png',
	notificationActivePath:  'resources/images/notification.png',
	
	activatedBinding: "KG.notificationsController.activePopup",
	
	notificationCountBinding: "KG.notificationsController.length",
	
	notificationImg: function(){
		if(this.get('activated')){
			return this.get('notificationActivePath');
		}else{
			return this.get('notificationPath');
		}
	}.property('activated')
	
	
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

});spade.register("kloudgis/sandbox/lib/views/search_result_label", function(require, exports, __module, ARGV, ENV, __filename){
/**
* View to renderer a feature in the search result list.
**/

KG.SearchResultLabelView = KG.Button.extend({
	
	tagName:'div',
	
	mouseUp: function(e){
		KG.statechart.sendAction('featureZoomAction', this.getPath('itemView.content'));
		return NO;
	}
});

});spade.register("kloudgis/sandbox/lib/views/text_notification_area", function(require, exports, __module, ARGV, ENV, __filename){
KG.TextNotificationAreaView = KG.TextArea.extend({

    insertNewline: function(event) {
        if (KG.sendNotificationController.get('sendOnEnterValue')) {
            KG.statechart.sendAction('sendNotificationAction');
        }
    },
});

});