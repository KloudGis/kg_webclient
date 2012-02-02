/*
 Copyright (c) 2010-2011, XYZ Civitas
 Kloudgis.
 http://kloudgis.com
*/
//loc helper
Handlebars.registerHelper('loc',
function(property, options) {
    var value = property.loc();
    if (options.hash.id) {
        var tag = options.hash.tagName || 'span';
        return new Handlebars.SafeString('<' + tag + ' id="' + options.hash.id + '">' + value + '</' + tag + '>');
    } else if (options.hash.class) {
        var tag = options.hash.tagName || 'span';
        return new Handlebars.SafeString('<' + tag + ' class="' + options.hash.class + '">' + value + '</' + tag + '>');
    } else if (options.hash.tagName) {
        var tag = options.hash.tagName;
        return new Handlebars.SafeString('<' + tag + '>' + value + '</' + tag + '>');
    }
    return value;
});

//highlight helper
Handlebars.registerHelper('highlight',
function(property) {
    var value = SC.getPath(this, property);
    return new Handlebars.SafeString('<span class="highlight">' + value + '</span>');
});


//jQuery extension
$.extend({
    //extract from the URL a query value
    getQueryString: function(name) {
        function parseParams() {
            var params = {},
            e, a = /\+/g,
            // Regex for replacing addition symbol with a space
            r = /([^&=]+)=?([^&]*)/g,
            d = function(s) {
                return decodeURIComponent(s.replace(a, " "));
            },
            q = window.location.search.substring(1);

            while (e = r.exec(q))
            params[d(e[1])] = d(e[2]);

            return params;
        }

        if (!this.queryStringParams) this.queryStringParams = parseParams();

        return this.queryStringParams[name];
    }

});

//detect safari mobile
jQuery.extend(jQuery.browser, {
    isIphone: navigator.userAgent.toLowerCase().indexOf('iphone') > 0
});


//create the namespace
KG = Ember.Application.create({
    lang: 'fr',
    activeSandboxKey: null,
    serverHost: '/',

    //set to NO for PRODUCTION
    debugMode: YES,

    enableLogger: function() {
        if (!this._oldLogger) {
            return;
        }
        window.console.log = this._oldLogger;
    },

    _oldLogger: null,

    disableLogger: function() {
        this._oldLogger = window.console.log;
        window.console.log = function() {};
    }
});

//default: Disable log is not Debug 
if (!KG.get('debugMode')) {
    KG.disableLogger();
}

$(document).ready(function() {
    KG.statechart.initStatechart();
});



KG.HomeState = SC.State.extend({

    initialSubstate: 'listSandboxState',

    enterState: function() {
        console.log('home!');
		var loadNeeded = YES;
		var hashLoc = window.location.hash;
        if (hashLoc && hashLoc.length > 0) {
            var tokens = hashLoc.split(';');
            if (tokens.length > 0) {
                var sb = tokens[0];
				if(sb && sb.charAt(1) === 's' && sb.charAt(2) === "b"){
					var sbVal = sb.substring(4);
					if(sbVal && sbVal.length > 0){
						KG.set('activeSandboxKey', sbVal);            
						this.gotoState('sandboxState');
						loadNeeded = NO;
					}
				}
            }
        }
		if(loadNeeded){
        	KG.core_home.loadSandboxList();
		}
    },

	exitState: function() {
	},

    listSandboxState: SC.State.extend({

        initialSubstate: 'selectSandboxState',

        enterState: function() {
            KG.homePanelController.setListSandboxActive();
        },

        createSandboxAction: function() {
            this.gotoState('createSandboxState');
        },

        selectSandboxState: SC.State.extend({

            enterState: function() {},

            exitState: function() {},

            openSandboxAction: function(sbKey) {
				KG.set('activeSandboxKey', sbKey);            
				this.gotoState('sandboxState');
            },

            toggleDeleteSandboxModeAction: function() {
                this.gotoState('deleteSandboxState');
            }
        }),

        deleteSandboxState: SC.State.extend({

            enterState: function() {
                KG.homePanelController.set('deleteMode', YES);
            },

            exitState: function() {
                KG.homePanelController.set('deleteMode', NO);
				KG.deleteController.set('content', []);
            },

            toggleDeleteSandboxModeAction: function() {
                this.gotoState('selectSandboxState');
            },

			deleteSandboxAction:function(){
				console.log('delete selected sandboxes');
				var select = KG.deleteController.get('content');
				select.forEach(function(sandbox){
					sandbox.destroy();
				});
				KG.store.commitRecords();
				this.gotoState('selectSandboxState');
			},

			checkSandboxAction: function(content){
				console.log('add to delete sandbox');
				if(content){
					if(KG.deleteController.indexOf(content) > -1){
						KG.deleteController.removeObject(content);
					}else{
						KG.deleteController.pushObject(content);
					}
				}
			}
        }),

    }),

    createSandboxState: SC.State.extend({

        enterState: function() {
            console.log('Enter create sandbox state!');
			KG.homePanelController.set('createSandboxInProgress', NO);
      		KG.core_home.get('map').addToDocument(null,null,null,'add-sandbox-map')
            KG.homePanelController.set('errorMessage', '');
			KG.homePanelController.setAddSandboxActive();
        },

        exitState: function() {
            KG.homePanelController.set('errorMessage', '');
            //to close mobile keyboard
            $('#add-sandbox-panel input').blur();
            KG.addSandboxController.set('name', '');
        },

        commitCreateAction: function() {
            var name = KG.getPath('addSandboxController.name');
            if (!Ember.none(name) && name.length > 0) {
                var qUnique = SC.Query.local(KG.Sandbox, {
                    conditions: "name='%@'".fmt(name)
                });
                var res = KG.store.find(qUnique);
                if (res.get('length') > 0) {
                    console.log('sb name already in use');
                    KG.homePanelController.set('errorMessage', '_nameAlreadyTaken'.loc());
                } else {
					KG.homePanelController.set('createSandboxInProgress', YES);
                    var center = KG.core_home.get('map').getCenter();
                    var rec = KG.store.createRecord(KG.Sandbox, {
                        name: name,
                        lon: center.get('lon'),
                        lat: center.get('lat'),
                        zoom: KG.core_home.get('map').getZoom()
                    });
                    KG.store.commitRecords();
                    rec.onReady(null,
                    function() {
                        KG.statechart.sendAction('sandboxCreateSuccess');
						KG.homePanelController.set('createSandboxInProgress', NO);
                    });
                    rec.onError(null,
                    function() {
                        rec.destroy();
                        KG.statechart.sendAction('sandboxCreateError');
						KG.homePanelController.set('createSandboxInProgress', NO);
                    });
                }
            } else {
                console.log('empty sb name');
            }
        },

        sandboxCreateSuccess: function() {
            this.gotoState('selectSandboxState');
        },

        sandboxCreateError: function() {
            console.log('error while commit');

        },

        httpError: function(status) {
            if (status == 400) {
                KG.homePanelController.set('errorMessage', '_requestError'.loc());
            } else {
                KG.homePanelController.set('errorMessage', '_serverError'.loc());
            }
        },

        cancelCreateAction: function() {
            var rec = KG.addSandboxController.get('content');
            if (rec) {
                rec.destroy();
            }
            this.gotoState('selectSandboxState');
        }
    })

});

KG.SandboxState = SC.State.extend({

    initialSubstate: 'tryAuthenticateState',

	exitState:function(){
		window.location.hash='';
	},
	
    //******************************
    // transient state to check 
    // if the user is logged in
    //******************************
    tryAuthenticateState: SC.State.extend({
        enterState: function() {
            setTimeout(function() {
                KG.core_sandbox.authenticate();
            },
            1);
        },

        authenticationSucceeded: function() {
            this.gotoState('tryMembershipState');
        },

        authenficationFailed: function() {
            this.gotoState('loggedOutState');
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
            this.gotoState('homeState');
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
		
		_featuretypes: null,
		_attrtypes: null,
		
        enterState: function() {
            KG.core_notification.listen();
            //fetch the featuretypes and attrtypes locally
            this._featuretypes = KG.store.find(KG.FEATURETYPE_QUERY);
            this._attrtypes = KG.store.find(KG.ATTRTYPE_QUERY);
			//show the center coord and update the hash in the address bar
			KG.core_sandbox.setCenter(KG.core_leaflet.getCenter(), KG.core_leaflet.getZoom());
			//lazzy load views
			KG.core_inspector.createView();
			KG.core_search.createView();
			KG.core_palette.createView();
        },

		exitState: function(){
			this._featuretypes.destroy();
			this._attrtypes.destroy();
			KG.core_sandbox.cleanUp();
		},

        //******************************
        // Concurrent state for Inpector
        // Inspector and the palette
        //******************************
        inspectorPaletteState: SC.State.extend({

            initialSubstate: 'allHiddenState',

            selectFeatureInspectorAction: function(feature) {
                if (feature && feature.get('isSelectable') && feature.get('isInspectorSelectable')) {
                    this.gotoState('inspectorVisibleState');
                    KG.core_inspector.selectFeature(feature);
                }
            },

            showPaletteAction: function() {
                this.gotoState('paletteVisibleState');
            },

            //******************************
            // Inspector and Palette are Hidden 
            //******************************
            allHiddenState: SC.State.extend({

}),

            //******************************
            // Inspector is visible
            //******************************
            inspectorVisibleState: SC.State.extend({

                enterState: function() {
                    KG.inspectorController.set('active', YES);
                    KG.featureCommentsController.set('commentsPanelVisible', YES);
                },

                exitState: function() {
                    KG.inspectorController.set('active', NO);
                    KG.core_inspector.commitModifications();
                    KG.core_inspector.removeHighlight();
                    KG.featureCommentsController.set('commentsPanelVisible', NO);
                    KG.featureCommentsController.set('showing', NO);
                    setTimeout(function() {
                        KG.inspectorController.set('feature', null);
                        KG.inspectorController.set('content', null);
                    },
                    500);
                },

                selectFeatureInspectorAction: function(feature) {
                    if (feature && feature.get('isSelectable') && feature.get('isInspectorSelectable')) {
                        KG.featureCommentsController.set('showing', NO);
                        KG.core_inspector.selectFeature(feature);
                    }
                },

                closeInspectorAction: function() {
                    this.gotoState('allHiddenState');
                },

                cancelInspectorAction: function() {
                    KG.core_inspector.rollbackModifications();
                    this.gotoState('allHiddenState');
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
                            KG.core_sandbox.autosize('#feature-new-comment-area', {
                                minHeight: 0,
                                extraSpace: 45
                            });
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
                },

                deleteFeatureInspectorAction: function() {
                    KG.core_inspector.deleteFeature();
                    this.gotoState('allHiddenState');
                }
            }),

            //******************************
            // Palette is visible
            //******************************
            paletteVisibleState: SC.State.extend({

                enterState: function() {
                    KG.paletteController.set('active', YES);
                    if (Ember.none(KG.paletteController.get('content'))) {
                        var query = SC.Query.local(KG.Featuretype, {
                            conditions: 'geometry_type != null'
                        })
                        KG.paletteController.set('content', KG.store.find(query));
                    }
                },

                exitState: function() {
                    KG.paletteController.set('active', NO);
                    KG.paletteController.set('isDirty', NO);
                    KG.core_palette.clearCreateFeature();
                    //do no clear the paletteController because rebuilding the view takes a while (on mobile)
                },

                paletteMarkerDragEnded: function(params) {
                    this.gotoState('inspectorVisibleState');
                    KG.core_inspector.createFeature(params.paletteItem, params.lon, params.lat);
                },

                selectPaletteItemAction: function(paletteItem) {
                    KG.core_palette.createFeature(paletteItem);
                },

                closePaletteAction: function() {
                    this.gotoState('allHiddenState');
                },

                cancelPaletteAction: function() {
                    KG.core_palette.clearCreateFeature();
                },

                showPaletteAction: function() {
                    this.gotoState('allHiddenState');
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

			toggleUserOptionsPopupAction: function(){
				this.gotoState('userOptionsState');
			},

            //******************************
            // No popup visible
            //******************************
            noPopupState: SC.State.extend({
                //nothing to do so far
            }),

			//******************************
            // User Options Popup
            //******************************

			userOptionsState: SC.State.extend({
				
				enterState: function() {
                    KG.activeUserController.set('activePopup', YES);
                },

                exitState: function() {
                    KG.activeUserController.set('activePopup', NO);
                },

	            backHomeAction: function() {
	                this.gotoState('homeState');
	            },
	
				toggleUserOptionsPopupAction: function(){
					this.gotoState('noPopupState');
				}
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
                    this.view.appendTo('#main-sandbox-view');
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
						KG.bookmarksController.set('deleteList', []);
                    },

					checkBookmarkAction: function(bookmark){
						var list = KG.bookmarksController.get('deleteList');
						if(list.indexOf(bookmark) > -1){
							list.removeObject(bookmark);
						}else{
							list.pushObject(bookmark);
						}
					},

                    deleteBookmarkAction: function() {
                        KG.core_bookmark.deleteSelectedBookmarks();
						this.gotoState('normalModeState');
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
                        this.view.appendTo('#main-sandbox-view');
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

            mapMovedAction: function(center, zoom) {
                KG.core_note.refreshMarkers();
                KG.core_sandbox.setCenter(center, zoom);
            },

            mapZoomedAction: function(center, zoom) {
                //remove all marker because Leaflet will not render them while zooming and it make a flash after.
                KG.core_note.removeAllMarkers();
                KG.core_note.refreshMarkers();
                KG.core_sandbox.setCenter(center, zoom);
            },

            toogleSearchPopopAction: function() {
                this.gotoState('searchState');
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
                window.location.href = "/";
            },

            createNoteAction: function() {
                this.gotoState('locateNoteState');
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

            //******************************
            // Default state - Navigation
            //******************************
            navigationState: SC.State.extend({

                _ignoreMouseClicked: YES,

                enterState: function() {
                    console.log('enter navigation state');
                    //refresh markers
                    KG.core_note.refreshMarkers();
                    var self = this;
                    setTimeout(function() {
                        self._ignoreMouseClicked = NO
                    },
                    100);
                },

                exitState: function() {
                    this._ignoreMouseClicked = YES;
                }
            }),

            //******************************
            // Show the search panel
            //******************************
            searchState: SC.State.extend({

                _highlight: null,
                _hlMarker: null,

                enterState: function() {
                    KG.searchController.set('activePopup', YES);
                    $('#search-popup input').focus();
                },

                exitState: function() {
                    KG.searchController.set('activePopup', NO);
                    KG.searchController.set('searchValue', '');
                    KG.core_search.hideResults();
                    KG.core_highlight.clearHighlight(this._highlight);
                    this._highlight = null;
                    KG.core_highlight.clearHighlightMarker(this._hlMarker);
                    this._hlMarker = null;
                },

                toogleSearchPopopAction: function() {
                    this.gotoState('navigationState');
                },

                searchAction: function() {
                    KG.core_search.searchFeatures();
                },

                clearSearchAction: function() {
                    KG.core_search.clearSearchFeatures();
                },

                selectSearchCategoryAction: function(cat) {
                    KG.searchResultsController.set('plugin', null);
                    if (KG.searchResultsController.get('category') === cat) {
                        KG.searchResultsController.set('category', null);
                    } else {
                        KG.searchResultsController.set('category', cat);
                        KG.core_search.showResults();
                    }
                },

                selectSearchPluginAction: function(plugin) {
                    KG.searchResultsController.set('category', null);
                    if (KG.searchResultsController.get('plugin') == plugin) {
                        KG.searchResultsController.set('plugin', null);
                    } else {
                        KG.searchResultsController.set('plugin', plugin);
                        KG.core_search.showResults();
                    }
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
                },

				showMoreResultsAction:function(){
					KG.core_search.showMoreResults();
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

                    markerDragEnded: function() {
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
                        KG.core_note.clearCreateNote();
                        KG.core_note.rollbackModifications();
                        KG.activeNoteController.set('content', null);
                        KG.core_sandbox.destroyAutosize('#note-description-area');
                    },

                    confirmNoteAction: function() {
                        var note = KG.activeNoteController.get('content');
                        KG.core_note.commitModifications(function() {
                            KG.core_note.refreshMarkers(YES);
                        });
                        KG.core_note.confirmCreateNote();
                        this.gotoState('navigationState');
                    },

                    cancelCreateNoteAction: function() {
                        this.gotoState('navigationState');
                    },

                    markerDragEnded: function(lon, lat) {
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
                        KG.core_note.cleanUpMultipleNotesElements();
                        KG.notesPopupController.set('marker', null);
                        KG.notesPopupController.set('content', []);
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
                                KG.core_sandbox.autosize('#note-new-comment-area', {
                                    minHeight: 0,
                                    extraSpace: 20
                                });
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
                        KG.core_note.commitModifications(function() {
                            KG.core_note.refreshMarkers(YES);
                        });
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
});


//the global statechart
Ember.mixin(KG, {
    //global state chart
    statechart: Ember.Statechart.create({
        //log trace
        trace: NO,

        rootState: Ember.State.extend({

            initialSubstate: 'tryLoginAutoState',

            //-----------------------
            // Transient: Auto Login with Cache
            //-----------------------
            tryLoginAutoState: Ember.State.extend({
                enterState: function() {
                    KG.core_init.loadLoginCore();
                    console.log('try auto login state');
                    var user = $.getQueryString('user');
                    if (Ember.none(user)) {
                        setTimeout(function() {
                            KG.core_login.tryLoginAuto();
                        },
                        1);
                    } else {
                        this.gotoState('loggedOutState');
                    }
                },

				exitState:function(){
					$('#loading').hide();
				},

                authenticationSucceeded: function(sender) {
                    console.log('auto auth success');
                    this.gotoState('loggedInState');
                },

                authenticationFailed: function(sender) {
                    console.log('auto auth failed');
                    this.gotoState('loggedOutState');
                }
            }),

            //-----------------------
            // Logout state: Show the login Page
            //-----------------------
            loggedOutState: Ember.State.extend({

                enterState: function() {
                    KG.pageController.setLoginActive();
                    var user = $.getQueryString('user');
                    if (!Ember.none(user)) {
                        KG.credential.set('user', user);
                    }
                    KG.core_init.loadLoginPage();
                },

                exitState: function() {},

                loginAction: function(sender) {
                    KG.core_login.login();
                },

                authenticationSucceeded: function() {
                    KG.credential.set('pwd', null);
                    KG.core_login.focusUserField();
                    this.gotoState('loggedInState');
                },

                authenticationFailed: function() {}

            }),

            //-----------------------
            // Login Successful State
            //-----------------------
            loggedInState: Ember.State.extend({

                initialSubstate: 'homeState',

                enterState: function() {
                    console.log('login successful');
                },

                logoutAction: function() {
                    KG.core_auth.logout();
                    this.gotoState('loggedOutState');
                },

                //-----------------------
                // Home Page State
                //-----------------------
                homeState: Ember.State.extend({

                    initialSubstate: 'tranHomeState',
					
                    //-----------------------
                    // Transient - create Home Page 
                    // and anim transition
                    //-----------------------
                    tranHomeState: Ember.State.extend({

                        _timeout: null,

                        enterState: function() {
                            KG.core_init.loadHomePage();
                            var self = this;
                            this._timeout = setTimeout(function() {
                                KG.pageController.setHomeActive();
                                self.gotoState('openHomeState');
                            },
                            100);
                        },

                        exitState: function() {
                            clearTimeout(this._timeout);
                        }
                    }),

					//-----------------------
                    // Open HOME Page State
                    //-----------------------
                    openHomeState: Ember.State.plugin('KG.HomeState'),
                }),

                //-----------------------
                // Sandbox Page State
                //-----------------------
                sandboxState: Ember.State.extend({

                    initialSubstate: 'transSandboxState',

                    //-----------------------
                    // Transient - create Sandbox Page 
                    // and anim transition
                    //-----------------------
                    transSandboxState: Ember.State.extend({

                        _timeout: null,

                        enterState: function() {
                            KG.core_init.loadSandboxPage();
                            var self = this;
                            this._timeout = setTimeout(function() {
                                KG.pageController.setSandboxActive();
                                self.gotoState('openSandboxState');
                            },
                            100);
                        },

                        exitState: function() {
                            clearTimeout(this._timeout);
                        }
                    }),

                    //-----------------------
                    // Open Sandbox Page State
                    //-----------------------
                    openSandboxState: Ember.State.plugin('KG.SandboxState')

                }),
            }),

            //different page for signup (an other app)
            signupAction: function(sender) {
                window.location.href = "/signup";
            },
        })
    })
});


KG.core_init = Ember.Object.create({

    _loginView: null,
    _homeView: null,
	_sandboxView: null,

    loadLoginCore: function() {
	    require('kloudgis/login/lib/strings');
        require('kloudgis/login/lib/core_login');
    },

    loadLoginPage: function() {
        if (!this._loginView) {
            this._loginView = SC.View.create({
                templateName: "login-page"
            });
            this._loginView.appendTo('#super-pages');
        }
    },

    loadHomePage: function() {
        if (!this._homeView) {
            //login-page
            this._homeView = SC.View.create({
                templateName: "home-page"
            });
            this._homeView.appendTo('#super-pages');
        }
    },

    loadSandboxPage: function() {
        if (!this._sandboxView) {
            this._sandboxView = SC.View.create({
                templateName: "sandbox-page"
            });
            this._sandboxView.appendTo('#super-pages');
        }
    }
});


KG.pageController = Ember.Object.create({
    loginHidden: NO,
    loginPushedLeft: NO,
    loginPushedRight: NO,

    homeHidden: YES,
    homePushedLeft: NO,
    homePushedRight: YES,

    sandboxHidden: YES,
    sandboxPushedLeft: NO,
    sandboxPushedRight: YES,

    _timeout: null,
	_timeout2: null,

    setLoginActive: function() {
        clearTimeout(this._timeout);
		clearTimeout(this._timeout2);
        var self = this;
        this.set('loginHidden', NO);
        this.set('loginPushedLeft', NO);
        this.set('loginPushedRight', NO);
        this._timeout = setTimeout(function() {
            self.set('homeHidden', YES);
        },
        1500);
        this.set('homePushedLeft', NO);
        this.set('homePushedRight', YES);
        this.set('sandboxHidden', YES);
        this.set('sandboxPushedLeft', NO);
        this.set('sandboxPushedRight', YES);
    },

    setHomeActive: function() {
        clearTimeout(this._timeout);
		clearTimeout(this._timeout2);
		var self = this;
		this._timeout = setTimeout(function() {
            self.set('loginHidden', YES);
        },
        1500);
        this.set('loginPushedLeft', YES);
        this.set('loginPushedRight', NO);
        this.set('homeHidden', NO);
        this.set('homePushedLeft', NO);
        this.set('homePushedRight', NO);
		this._timeout2 = setTimeout(function() {
            self.set('sandboxHidden', YES);
        },
        1500);
        this.set('sandboxPushedLeft', NO);
        this.set('sandboxPushedRight', YES);
    },

    setSandboxActive: function() {
	    var self = this;
        clearTimeout(this._timeout);
		clearTimeout(this._timeout2);
        this.set('loginHidden', YES);
        this.set('loginPushedLeft', YES);
        this.set('loginPushedRight', NO);
		this._timeout = setTimeout(function() {
            self.set('homeHidden', YES);
        },
        1500);
        this.set('homePushedLeft', YES);
        this.set('homePushedRight', NO);
        this.set('sandboxHidden', NO);
        this.set('sandboxPushedLeft', NO);
        this.set('sandboxPushedRight', NO);
    },

});


Ember.TEMPLATES["login-page"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n	<div>\n		<a id=\"kloud-logo\">\n			<img src=\"css/images/kloudgis_black_128.png\" alt=\"Kloudgis\"/>\n		</a>		\n		<a id=\"kloud-brand\">Kloudgis</a>\n	<div class=\"login-pane\">\n		<table>\n		<tr>\n		<td>\n			<label id=\"email-label\" for=\"user-field\">");
  stack1 = depth0;
  stack2 = "_email";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "</label>\n		</td>\n		<td>\n			");
  stack1 = depth0;
  stack2 = "KG.TextField";
  stack3 = {};
  stack4 = "user-field";
  stack3['id'] = stack4;
  stack4 = "KG.credential.user";
  stack3['valueBinding'] = stack4;
  stack4 = "email";
  stack3['type'] = stack4;
  stack4 = "_UsernameHint";
  stack3['placeholder_not_loc'] = stack4;
  stack4 = "false";
  stack3['spellcheck'] = stack4;
  stack4 = "off";
  stack3['autocorrect'] = stack4;
  stack4 = "off";
  stack3['autocapitalize'] = stack4;
  stack4 = "on";
  stack3['autocomplete'] = stack4;
  stack4 = "loginAction";
  stack3['nl_sc_action'] = stack4;
  stack4 = "true";
  stack3['autofocus'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(2, program2, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("	\n			</td>\n		<tr>\n		<td>\n			<label id=\"pwd-label\" for=\"pwd-field\">");
  stack1 = depth0;
  stack2 = "_pwd";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "</label>\n			</td>\n			<td>\n			");
  stack1 = depth0;
  stack2 = "KG.TextField";
  stack3 = {};
  stack4 = "pwd-field";
  stack3['id'] = stack4;
  stack4 = "KG.credential.pwd";
  stack3['valueBinding'] = stack4;
  stack4 = "password";
  stack3['type'] = stack4;
  stack4 = "_PasswordHint";
  stack3['placeholder_not_loc'] = stack4;
  stack4 = "false";
  stack3['spellcheck'] = stack4;
  stack4 = "off";
  stack3['autocorrect'] = stack4;
  stack4 = "off";
  stack3['autocapitalize'] = stack4;
  stack4 = "on";
  stack3['autocomplete'] = stack4;
  stack4 = "loginAction";
  stack3['nl_sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(4, program4, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n			</td>\n		</div>\n		<tr id=\"login-button-row\">\n		<td>\n		</td>\n		<td>	\n			");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "loginAction";
  stack3['sc_action'] = stack4;
  stack4 = "login-button";
  stack3['id'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(6, program6, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n		</td>\n		</table>\n		");
  stack1 = depth0;
  stack2 = "SC.Checkbox";
  stack3 = {};
  stack4 = "remember-me";
  stack3['id'] = stack4;
  stack4 = "KG.core_login.rememberMeLabel";
  stack3['titleBinding'] = stack4;
  stack4 = "KG.core_login.rememberMe";
  stack3['valueBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "view", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n		");
  stack1 = {};
  stack2 = "error-message";
  stack1['class'] = stack2;
  stack2 = "KG.core_login.errorMessage";
  stack1['messageBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(8, program8, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	</div>	\n	<div id=\"signup-box\">\n		<span id=\"signup-title\">");
  stack1 = depth0;
  stack2 = "_signupTitle";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "</span>\n		");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "signupAction";
  stack3['sc_action'] = stack4;
  stack4 = "signup-button";
  stack3['id'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(10, program10, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	</div>\n");
  return buffer;}
function program2(depth0,data) {
  
  
  data.buffer.push("\n			");}

function program4(depth0,data) {
  
  
  data.buffer.push("\n			");}

function program6(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n				");
  stack1 = depth0;
  stack2 = "_login";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "\n			");
  return buffer;}

function program8(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "message";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + " \n		");
  return buffer;}

function program10(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("	\n			");
  stack1 = depth0;
  stack2 = "_signup";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "\n		");
  return buffer;}

  stack1 = {};
  stack2 = "main-login-view";
  stack1['id'] = stack2;
  stack2 = "main-panel";
  stack1['class'] = stack2;
  stack2 = "KG.pageController.loginHidden KG.pageController.loginPushedLeft KG.pageController.loginPushedRight";
  stack1['classBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("	\n");
  return buffer;
})

Ember.TEMPLATES["home-page"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var stack1, stack2, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n	<div id=\"home-header\">\n		");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "logout-button";
  stack3['id'] = stack4;
  stack4 = "logoutAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(2, program2, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n		");
  stack1 = {};
  stack2 = "welcome-usr-label";
  stack1['id'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(4, program4, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n		");
  stack1 = {};
  stack2 = "home-error-message error-message";
  stack1['class'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(6, program6, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	</div>\n	<div id=\"super-home-panel\">\n		");
  stack1 = depth0;
  stack2 = "KG.SandboxListView";
  stack3 = {};
  stack4 = "sandbox-list-panel";
  stack3['id'] = stack4;
  stack4 = "sandbox-list";
  stack3['templateName'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "view", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n		");
  stack1 = depth0;
  stack2 = "KG.AddSandboxView";
  stack3 = {};
  stack4 = "add-sandbox-panel";
  stack3['id'] = stack4;
  stack4 = "add-sandbox";
  stack3['templateName'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "view", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n	</div>\n");
  return buffer;}
function program2(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "_logout";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "\n		");
  return buffer;}

function program4(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "KG.core_home.connectedUserLabel";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "	\n		");
  return buffer;}

function program6(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "KG.homePanelController.errorMessage";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n		");
  return buffer;}

  stack1 = {};
  stack2 = "main-home-view";
  stack1['id'] = stack2;
  stack2 = "main-panel";
  stack1['class'] = stack2;
  stack2 = "KG.pageController.homeHidden KG.pageController.homePushedLeft KG.pageController.homePushedRight";
  stack1['classBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
})

Ember.TEMPLATES["sandbox-page"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var stack1, stack2, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2;
  data.buffer.push("\n	");
  stack1 = {};
  stack2 = "page-header";
  stack1['templateName'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "view", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1) + "\n	");
  stack1 = {};
  stack2 = "position-label";
  stack1['id'] = stack2;
  stack2 = "span";
  stack1['tagName'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(2, program2, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	<div id=\"map\">	\n	</div>\n");
  return buffer;}
function program2(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n		<span>");
  stack1 = depth0;
  stack2 = "KG.core_sandbox.latitudeLabel";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "</span>\n		<span>");
  stack1 = depth0;
  stack2 = "KG.core_sandbox.longitudeLabel";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "</span>\n	");
  return buffer;}

  stack1 = {};
  stack2 = "main-sandbox-view";
  stack1['id'] = stack2;
  stack2 = "main-panel";
  stack1['class'] = stack2;
  stack2 = "KG.pageController.sandboxHidden KG.pageController.sandboxPushedLeft KG.pageController.sandboxPushedRight";
  stack1['classBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
})

/**
* Extend the SC.Button to add more attributes and send Statechart action
**/
var get = SC.get;
KG.Button = SC.Button.extend({

    attributeBindings: ['type', 'disabled', 'title'],

    triggerAction: function() {
        this._super();
        var action = get(this, 'sc_action');
        if (action && KG.statechart) {
            KG.statechart.sendAction(action, this.get('content') || this.getPath('itemView.content'));
            if (this.postAction) {
                this.postAction();
            }
        }
    },

	//manual mouseDown Event Handling
	manualMouseDown: NO,

	_mouseDownListener: null,
	_element: null,

    didInsertElement: function() {
        if (this.get('manualMouseDown')) {
            this._element = this.get('element');
            var self = this;
			this._mouseDownListener = function(e) {
                return self.mouseDown(e);
            };
			this._clickListener = function(e) {
                return self.click(e);
            };
            this._element.addEventListener('mousedown', this._mouseDownListener, false);
			this._element.addEventListener('click', this._clickListener, false);
        }
    },

	destroy:function(){
		if (get(this, 'isDestroyed')) { return; }
		if (this.get('manualMouseDown') && this._element) {
			this._element.removeEventListener('mousedown', this._mouseDownListener, false);
			this._element.removeEventListener('click', this._clickListener, false);
			this._element = null;
		}  
		this._super();
	}
});


/**
* View to show a spinner image 
**/
KG.LoadingImageView = SC.View.extend({
	classNames:'loading-image'.w(),
	loadingImage: 'css/images/loading.gif'
});

/**
* Extend the Ember.TextField to add more attributes and localize the placeholder
**/
KG.NumericTextField = Ember.TextField.extend({

    attributeBindings: ['type', 'placeholder', 'value', 'autofocus', 'min', 'max', 'step']
});

KG.otherKey = '|?|';
KG.SelectInputView = Ember.View.extend({
	
	value: null,
	
	keyName: 'key',
	
	didInsertElement: function(){
        var self = this;
		this.valueChanged();	
    },

    valueChanged: function(){
		var content = this.get('content');
		var value = this.get('value');
		var found = NO;
		if(content){
			found = content.findProperty(this.get('keyName'), value);
		}
		if(!found){
			this.set('valueSelect', KG.otherKey);
			this.set('valueInput', value);
		}else{
			this.set('valueSelect', found.key);
		}
    }.observes('value'),

	valueSelect: null,
	
	valueSelectChanged: function(){
		var sv = this.get('valueSelect');
		//console.log('select view value:' + sv);
		if(sv === KG.otherKey){
			this.set('inputClass', 'visible-element');
		}else{
			var v = this.get('value');
			if(sv !== v){
				this.set('value', sv);
			}
			this.set('inputClass', 'not-visible-element');
		}
    }.observes('valueSelect'),

	valueInput: '',

    valueInputChanged: function(){
		var iv = this.get('valueInput');
        //console.log('Input view value:' + iv);
		var v = this.get('value');
		if(iv !== v){
			this.set('value', iv);
		}
    }.observes('valueInput'),

	inputClass: 'not-visible-element'
});

KG.SelectView = SC.View.extend({
    value: null,

    valueChanged: function(){
        this.$('select').val( this.get('value') );
    }.observes('value'),

    didInsertElement: function(){
        var self = this;
		this.valueChanged();
        this.$('select').change(function(){
            var val = self.$('select option:selected').val();
            self.set('value', val);
        });		
    }
});

KG.SwitchView = KG.Button.extend({
	
	classNames: ['switch'],
	tagName: 'div',
	
	value: null, 
	
	on: function(key, value){
		if(value !== undefined){
			this.setPath('value', value);
		}
		return this.getPath('value');
	}.property('value'),
	
	triggerAction: function() {
		this.set('on', !this.get('on'));
	}
});

/**
* Extend the SC.TextArea to add more attributes and localize the placeholder
**/
KG.TextArea = SC.TextArea.extend({
    attributeBindings: ['placeholder', 'disabled'],

	placeholder: function(){
		if(SC.none(this.get('placeholder_not_loc'))){
			return null;
		}
		return this.get("placeholder_not_loc").loc();
	}.property('placeholder_not_loc')
	
});

/**
* Extend the SC.TextArea to add more attributes and localize the placeholder
**/
KG.TextField = SC.TextField.extend({

    //add more attributes (from autofocus)
    attributeBindings: ['type', 'placeholder', 'value', 'autofocus', 'spellcheck', 'autocorrect', 'autocapitalize', "autocomplete", 'disabled', "size", "results"],

    nl_sc_action: null,
    placeholder_not_loc: null,

    placeholder: function() {
        if (SC.none(this.get('placeholder_not_loc'))) {
            return null;
        }
        return this.get("placeholder_not_loc").loc();
    }.property('placeholder_not_loc'),

    insertNewline: function() {
        if (!SC.none(this.get('nl_sc_action'))) {
            KG.statechart.sendAction(this.get('nl_sc_action'), this);
        }
    },

    didInsertElement: function() {
        //To remove once Firefox support HTML5 autofocus attribute
        if (!SC.none(this.get('autofocus')) && $.browser.mozilla) {
            var self = this;
            setTimeout(function() {
                console.log('fallback focus');
                self.$().focus();
            },
            1);
        }
    }
});


Ember.TEMPLATES["switch"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("\n	<span class=\"thumb\"></span>\n");}

  stack1 = depth0;
  stack2 = "KG.SwitchView";
  stack3 = {};
  stack4 = "on";
  stack3['classBinding'] = stack4;
  stack4 = "content";
  stack3['valueBinding'] = stack4;
  stack4 = "disabled";
  stack3['disabledBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
})

Ember.TEMPLATES["select"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n	<select ");
  stack1 = {};
  stack2 = "disabled";
  stack1['disabled'] = stack2;
  stack2 = helpers.bindAttr || depth0.bindAttr;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "bindAttr", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1) + ">\n		");
  stack1 = depth0;
  stack2 = "content";
  stack3 = helpers.each;
  tmp1 = self.program(2, program2, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  stack1 = stack3.call(depth0, stack2, tmp1);
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	</select>\n");
  return buffer;}
function program2(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n			<option ");
  stack1 = {};
  stack2 = "key";
  stack1['value'] = stack2;
  stack2 = helpers.bindAttr || depth0.bindAttr;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "bindAttr", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1) + " >");
  stack1 = depth0;
  stack2 = "label";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "</option>\n		");
  return buffer;}

  stack1 = depth0;
  stack2 = "KG.SelectView";
  stack3 = {};
  stack4 = "content";
  stack3['contentBinding'] = stack4;
  stack4 = "value";
  stack3['valueBinding'] = stack4;
  stack4 = "disabled";
  stack3['disabledBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
})

Ember.TEMPLATES["select-input"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n	");
  stack1 = {};
  stack2 = "select";
  stack1['templateName'] = stack2;
  stack2 = "content";
  stack1['contentBinding'] = stack2;
  stack2 = "valueSelect";
  stack1['valueBinding'] = stack2;
  stack2 = "disabled";
  stack1['disabledBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "view", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1) + "\n	");
  stack1 = depth0;
  stack2 = "Ember.TextField";
  stack3 = {};
  stack4 = "valueInput";
  stack3['valueBinding'] = stack4;
  stack4 = "inputClass";
  stack3['classNameBindings'] = stack4;
  stack4 = "disabled";
  stack3['disabledBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "view", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n");
  return buffer;}

  stack1 = depth0;
  stack2 = "KG.SelectInputView";
  stack3 = {};
  stack4 = "content";
  stack3['contentBinding'] = stack4;
  stack4 = "value";
  stack3['valueBinding'] = stack4;
  stack4 = "disabled";
  stack3['disabledBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
})

/**
* Core functions for authentification
**/

//Auth properties
SC.mixin(KG, {
    /**
 * Name of localStorage where we store the auth token
 */
    AUTHENTICATION_TOKEN_LOCAL_STORE_KEY: 'KG.AuthenticationToken',
    REMEMBER_ME_LOCAL_STORE_KEY: 'KG.RememberMe',

    /**
 * Name of Authentication header returned in API responses
 */
    AUTHENTICATION_HEADER_NAME: 'X-Kloudgis-Authentication',

});

//store and retreive auth token
//basic login using the auth token
KG.core_auth = SC.Object.create({

    authenticationToken: null,
    activeUser: null,

    load: function(cb_target, cb, useRememberMe) {
		console.log('auth load started.');
        // Get token from local store
        var token = localStorage.getItem(KG.AUTHENTICATION_TOKEN_LOCAL_STORE_KEY);
        var rememberMe = localStorage.getItem(KG.REMEMBER_ME_LOCAL_STORE_KEY);
        if (SC.none(token) || (useRememberMe && rememberMe != 'true')) {
            this.logout();
            cb.call(cb_target, "_failed");
            return NO;
        }

        // Synchronously get user from server
        var postData = {
            user: null,
            pwd: token
        };
        $.ajax({
            type: 'POST',
            url: KG.get('serverHost') + 'api_auth/public/login',
            data: JSON.stringify(postData),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            context: this,
            error: function(jqXHR, textStatus, errorThrown) {
                SC.Logger.error('Load error: HTTP error status code: ' + jqXHR.status);
                cb.call(cb_target, "_error");
            },
            success: function(data, textStatus, jqXHR) {
				console.log('auth load success.');
                var newToken = data.token;
                var user = data.user;
                // Save
                this.saveLogin(newToken, undefined, user);	
                cb.call(cb_target, "_success");
            },
            async: YES
        });
        return YES;
    },

    login: function(user, pwd_hashed, rememberMe, cb_target, cb, cb_params) {

        if (SC.none(rememberMe)) {
            rememberMe = NO;
        }

        var postData = {
            user: user,
            pwd: pwd_hashed
        };

        // Call server
        var url = KG.get('serverHost') + 'api_auth/public/login';
        var context = {
            rememberMe: rememberMe,
            callbackTarget: cb_target,
            callbackFunction: cb,
            callbackParams: cb_params
        };

        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(postData),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            context: context,
            error: this.endLoginError,
            success: this.endLogin,
            async: YES
        });

        return;
    },

    endLoginError: function(jqXHR, textStatus, errorThrown) {

        var error = null;
        SC.Logger.error('HTTP error status code: ' + jqXHR.status);
        if (jqXHR.status === 401) {
            error = {message: '_unauthorized'};
        } else if (jqXHR.status === 503 || jqXHR.status === 404) {
            error = {message: '_serverDown'};
        } else if (jqXHR.status === 403 || jqXHR.status > 500) {
            error = {message: '_serverError'};
        } else {
            error = {message: '_unexpectedError'};
        }

        // Callback
        if (!SC.none(this.callbackFunction)) {
            this.callbackFunction.call(this.callbackTarget, this.callbackParams, error);
        }
        return YES;
    },

    endLogin: function(data, textStatus, jqXHR) {
        var error = null;
        try {
            // Get the token
            var token, user;
            if (!SC.none(data)) {
                token = data.token;
                user = data.user;
            }
            if (SC.none(token)) {
                throw {message: '_nullTokenError'};
            }
            KG.core_auth.saveLogin(token, this.rememberMe, user);
        }
        catch(err) {
            error = err;
            SC.Logger.error('endLogin: ' + err.message);
        }

        // Callback
        if (!SC.none(this.callbackFunction)) {
            this.callbackFunction.call(this.callbackTarget, this.callbackParams, error);
        }
        // Return YES to signal handling of callback
        return YES;
    },

    saveLogin: function(token, rememberMe, user) {
        this.set('authenticationToken', token);
        this.set('activeUser', user);
        if (SC.none(token)) {
            localStorage.setItem(KG.AUTHENTICATION_TOKEN_LOCAL_STORE_KEY, '');
            localStorage.setItem(KG.REMEMBER_ME_LOCAL_STORE_KEY, NO);
        } else {
            localStorage.setItem(KG.AUTHENTICATION_TOKEN_LOCAL_STORE_KEY, token);
            if (rememberMe !== undefined) {
                localStorage.setItem(KG.REMEMBER_ME_LOCAL_STORE_KEY, rememberMe);
            }
        }
    },

    /*
   * Remove authentication tokens
   */
    logout: function() {
        console.log('Logging out');
        //tell the server about the logout (invalidate token and destroy the session)
		//auth service
        var url = KG.get('serverHost') + 'api_auth/public/logout';
        $.ajax({
            type: 'POST',
            url: url,
            async: YES
        });
		//sandbox service
		url = KG.get('serverHost') + 'api_sandbox/public/logout';
        $.ajax({
            type: 'POST',
            url: url,
            async: YES
        });
		//data service
		url = KG.get('serverHost') + 'api_data/public/logout';
        $.ajax({
            type: 'POST',
            url: url,
            async: YES
        });
		//map service
		url = KG.get('serverHost') + 'api_map/public/logout';
        $.ajax({
            type: 'POST',
            url: url,
            async: YES
        });
        // Remove token from local store
        localStorage.removeItem(KG.AUTHENTICATION_TOKEN_LOCAL_STORE_KEY);

        // Clear cached token
        this.set('authenticationToken', null);
        this.set('activeUser', null);
        return;
    },

    createAjaxRequestHeaders: function() {
        var headers = {};
        headers[KG.AUTHENTICATION_HEADER_NAME] = this.get('authenticationToken');
        return headers;
    }
});


/**
* Localize the login page.
**/
var fr = { 
	"_loginTitle": "Se connecter à Kloudgis",
	"_email" : "Courriel:",
	"_pwd": "Mot de passe:",
	"_login": "Connecter",
	"_signupTitle": "Pas encore membre ?",
	"_signup": "Créer un compte",
	"_rememberMe": "Rester connecter",
    "_serverError": "Erreur du serveur.",
	"_serverDown" : "Le serveur n'est pas disponible.",
	"_unexpectedError": "Erreur interne.",
	"_unauthorized": "Le courriel ou le mot de passe est incorrect.",
	"_UsernameHint": "Votre courriel",
	"_PasswordHint": "Mot de passe",
	"_UsernameRequired": "Le courriel est obligatoire.",
	"_PasswordRequired": "Le mot de passe est obligatoire."
};

var en = {
	"_loginTitle": "Login to Kloudgis",
	"_email" : "Email:",
	"_pwd": "Password:",
	"_login": "Sign in",
	"_signupTitle": "Not yet member ?",
	"_signup": "Create an account",
	"_rememberMe": "Stay signed in",
	"_serverError": "Server error.",
	"_serverDown" : "The server is offline.",
	"_unexpectedError": "Internal error.",
	"_unauthorized": "The email or password you entered is incorrect.",
	"_UsernameHint": "Your Email",
	"_PasswordHint": "Mot de passe",
	"_UsernameRequired": "The email is required.",
	"_PasswordRequired": "The password is required."
};

if(KG.lang === 'fr'){
	jQuery.extend(Ember.STRINGS, fr);
}else{
	jQuery.extend(Ember.STRINGS, en);
}


/**
* Core functions for the login page.
**/
KG.core_login = SC.Object.create({
    isBusy: NO,
    errorMessage: '',
	rememberMe: NO,
	rememberMeLabel: '_rememberMe'.loc(),

    focusUserField: function() {
        $('#user-field').focus();
    },

    focusPwdField: function() {
        $('#pwd-field').focus();
    },

    /**
	   Start async login process
	*/
    login: function() {
        try {
            console.log('Login attempt');
            // Get our data from the properties using the SC 'get' methods
            // Need to do this because these properties have been bound/observed.
            var username = KG.credential.get('user');
            if (username == null || username == '') {
                this.focusUserField();
                throw new Error('_UsernameRequired'.loc());
            }

            var password = KG.credential.get('pwd');
            if (password == null || password == '') {
                this.focusPwdField();
                throw new Error('_PasswordRequired'.loc());
            }

            this.set('isBusy', YES);

            // We know the username and password are not null at this point, so attempt to login
            var hashedPassword = SHA256(password);
            KG.core_auth.login(username, hashedPassword, this.get('rememberMe'), this, this.endLogin, {});   
			return YES;       
        }
        catch(e) { // If there was an error, catch and handle it
            // Set Error
            this.set('errorMessage', e.message.loc());
            // Finish login processing
            this.set('isBusy', NO);
            // Authentication was not sucessful!
            // Send the event authenticationFailed to the statechart 
            KG.statechart.sendAction('authenticationFailed', this);
            return NO;
        }
		
    },

    /**
	   Callback from beginLogin() after we get a response from the server to process
	   the returned login info.

	   @param {SC.Response} response The HTTP response
	   @param {String}  if the call is using the auth token
	   */
    endLogin: function(params, error) {
        try {
            // Check status
            if (!SC.none(error)) {
                throw error;
            }          
            // Authentication was sucessful!
            this.set('isBusy', NO);
            // Send the event authenticationSucceeded to our statechart
            KG.statechart.sendAction('authenticationSucceeded', this);
        }
        catch(e) {
            // Authentication was not sucessful!
			var mess = e.message || '?';
            this.set('errorMessage', mess.loc());
            this.focusUserField();
            KG.statechart.sendAction('authenticationFailed', this);
            this.set('isBusy', NO);
			return YES;
        }
        this.set('errorMessage', '');
		return YES;
    },

    tryLoginAuto: function() {
        KG.core_auth.load(this, this.tryLoginAutoCallback, YES);		
    },

	tryLoginAutoCallback: function(message){
		console.log('auto cb with: ' + message);
		if(message === "_success"){
			KG.statechart.sendAction('authenticationSucceeded', this);
		}else{
			KG.statechart.sendAction('authenticationFailed', this);
		}
	}
});

KG.credential = SC.Object.create({
	user: undefined,
	pwd: undefined
});


$(document).ready(function() {
    KG.statechart.initStatechart();
});


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
            query_url = KG.get('serverHost') + 'api_data/protected/features/search?category=%@&search_string=%@&sandbox=%@&start=%@'.fmt(query.category, query.search, KG.get('activeSandboxKey'), query.start || 0);
        } else if (query === KG.SANDBOX_QUERY) {
            query_url = KG.get('serverHost') + 'api_sandbox/protected/sandboxes';
        }
		var version = query.get('version');
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
                    if (!SC.none(data) && query.blockRequestCb && data.blockData) {
                        query.blockRequestCb.call(query.blockRequestTarget, data.blockData, version);
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
        } else if (rtype === KG.Sandbox) {
            url = KG.get('serverHost') + 'api_sandbox/protected/sandboxes';
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
            } else if (rtype === KG.Sandbox) {
                url = KG.get('serverHost') + 'api_sandbox/protected/sandboxes/%@'.fmt(id);
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
    }.property('date_create'),


	formattedDescription: function(){
		return "_bookmarkDescription".loc(this.get('user_descriptor'), this.get('formattedDate'));
	}.property('formattedDate', 'ownerDescriptor')
});

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

/**
*  Generic Comment
**/
KG.Comment = KG.Record.extend({
	
	comment: SC.Record.attr(String),
	author: SC.Record.attr(Number),
	author_descriptor: SC.Record.attr(String)
});

KG.FeatureComment = KG.Comment.extend({
	
	feature: SC.Record.toOne('KG.Feature', {inverse: 'comments', isMaster: YES})
});

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


KG.NoteComment = KG.Comment.extend({
		note: SC.Record.toOne('KG.Note', {inverse: 'comments', isMaster: YES})
});



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

/**
* Sandbox record class.
**/
KG.Sandbox = KG.Record.extend({

	//id is the sandbox KEY
	name: SC.Record.attr(String),	
	owner: SC.Record.attr(Number),
	ownerDescriptor: SC.Record.attr(String),
	
	lat: SC.Record.attr(Number),
	lon: SC.Record.attr(Number),
	zoom: SC.Record.attr(Number),
	
	
	formattedDescription: function(){
		return "_sandboxDescription".loc(this.get('ownerDescriptor'), this.get('formattedDate'));
	}.property('formattedDate', 'ownerDescriptor')
});

/**
* Search count result. Category with result count.
**/
KG.SearchCategory = KG.Record.extend({

    categoryLabel: SC.Record.attr(String),
    count: SC.Record.attr(Number),
    search: SC.Record.attr(String),

    title: function() {
        var cat = this.get('categoryLabel');
        if (!SC.none(cat)) {
            if (cat.charAt(0) === '_') {
                return cat.loc();
            } else {
                return cat;
            }
        }
    }.property('categoryLabel'),

    records: function() {
        return this.findRecords(0);
    }.property(),

    findRecords: function(start) {
        var query = KG.SEARCH_RESULT_FEATURE_QUERY;
        if (this.get('categoryLabel') === '_notes_') {
            query = KG.SEARCH_RESULT_NOTE_QUERY;
        }
        query.start = start || 0;
        query.category = this.get('id');
        query.search = this.get('search');
        query.blockRequestCb = this.blockReceivedCallback;
        query.blockRequestTarget = this;
        query.incrementProperty('version');
        return KG.store.find(query);
    },

    queryBlock: null,

    blockReceivedCallback: function(block, version) {
        if (version === KG.SEARCH_RESULT_FEATURE_QUERY.get('version')) {
            this.set('queryBlock', Ember.Object.create({
                start: block.start,
                max: block.max,
                resultSize: block.resultSize
            }));
        }
    }
});


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


KG.localStorageLeafletCacheKey = 'leaflet-wms-cache-count';
/**
* CLASS - Core functions to manage the map (leaflet framework)
**/
KG.MapLeaflet = SC.Object.extend({

    map: null,

    //private variables
    _popupInfo: null,
    _popupMarker: null,

    //icons
    _icons: [],
	_added : NO,
	
    baseLayer: 'Bing',

    //	layerControl: new L.Control.Layers(),
    addToDocument: function(lon, lat, zoom, element) {
		if(this._added){
			return;
		}else{
			this._added = YES;
		}

        //patch to make the popup hide on Safari Mac.
          if ($.browser.safari && navigator.platform.indexOf('Mac') == 0) {
            L.Popup.prototype._close = function() {
                if (this._opened) {
                    this._map.removeLayer(this);
                    var element = $(".leaflet-popup-pane")[0];
                    if (element.style.width == '1px') {
                        element.style.width = '0px';
                    } else {
                        element.style.width = '1px';
                    }
                }
            };
        }

        var baseLayer;
		if(this.get('baseLayer') === 'OSM'){
			var osmURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
			var at = 'OSM';
			baseLayer = new L.TileLayer(osmURL, {
			    maxZoom: 20,
			    attribution: at
			});
		}else{
        	var key = 'Anvn3DMhTFsggcirvNz1TNQrxCzksEg-b47gtD7AO1iOzZicEiF2mFZoleYMkX8z';
        	baseLayer = new L.BingLayer(key);
		}
		element = element || 'map';
        // initialize the map on the "map" div
        var map = new L.Map(element, {});
        //default QUEBEC
        lon = lon || -72;
        lat = lat || 46;
        zoom = zoom || 5;
        map.setView(new L.LatLng(lat, lon), zoom).addLayer(baseLayer);
        //this.layerControl.addBaseLayer(layer, "Base");
        this.map = map;
        this.map.on('zoomend', this.onZoom, this);
        this.map.on('moveend', this.onMove, this);
        this.map.on('click', this.onClick, this);
        this.map.on('layeradd', this.onLayerAdd, this);
        this.map.on('layerremove', this.onLayerRemove, this);
        //2 reasons:
        //- If touch, no need to track the "mouse" position, there is no mouse.
        //- On mobile safari (4.3.2), the input textfield in a popup cannot take the focus is the mouseMove event is set in the map.
        if (!L.Browser.touch) {
            this.map.on('mousemove', this.onMouseMove, this);
        }

        this._popupInfo = new L.Popup({
            closeButton: false
        });
        this._popupMarker = new L.Popup({
            closeButton: true,
            offset: new L.Point(0, -33),
        });
        //disable interaction with the map over the popup
        this._popupInfo._initLayout();
        if (L.Browser.touch) {
            L.DomEvent.addListener(this._popupInfo._wrapper, L.Draggable.START, KG.core_leaflet.stopPropagation);
            L.DomEvent.addListener(this._popupInfo._wrapper, L.Draggable.END, KG.core_leaflet.stopPropagation);
            L.DomEvent.addListener(this._popupInfo._wrapper, L.Draggable.MOVE, KG.core_leaflet.stopPropagation);
        }
        L.DomEvent.addListener(this._popupInfo._wrapper, 'mousewheel', L.DomEvent.stopPropagation);

        this._popupMarker._initLayout();
        if (L.Browser.touch) {
            L.DomEvent.addListener(this._popupMarker._wrapper, L.Draggable.START, KG.core_leaflet.stopPropagation);
            L.DomEvent.addListener(this._popupMarker._wrapper, L.Draggable.END, KG.core_leaflet.stopPropagation);
            L.DomEvent.addListener(this._popupMarker._wrapper, L.Draggable.MOVE, KG.core_leaflet.stopPropagation);
        }
        L.DomEvent.addListener(this._popupMarker._wrapper, 'mousewheel', KG.core_leaflet.stopPropagation);
        L.DomEvent.addListener(this.map._container, 'mousedown', this._onMouseDown, this);
        L.DomEvent.addListener(this.map._container, 'mouseup', this._onMouseUp, this);
        L.DomEvent.addListener(this.map._container, 'click', this._onMouseClick, this);
    },

    /** store the shift down status to bypass the next click event and therefore do not make a selection on shift drag  zoom **/
    _shiftDown: NO,

    _onMouseDown: function(e) {
        if (!e.shiftKey || ((e.which != 1) && (e.button != 1))) {
            return false;
        }
        this._shiftDown = YES;
    },

    _onMouseUp: function(e) {
        setTimeout(function() {
            KG.core_leaflet._shiftDown = NO;
        },
        300);
    },

    _onMouseClick: function(e) {
        this._shiftDown = NO;
    },

    stopPropagation: function(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
    },

    onZoom: function(e) {
        KG.statechart.sendAction('mapZoomedAction', this.getCenter(), this.getZoom());
    },

    onMove: function(e) {
        KG.statechart.sendAction('mapMovedAction', this.getCenter(), this.getZoom());
    },

    onClick: function(e) {
        if (this._shiftDown) {
            return NO;
        }
        KG.statechart.sendAction('clickOnMapAction', KG.LonLat.create({
            lon: e.latlng.lng,
            lat: e.latlng.lat
        }));
    },

    onMouseMove: function(e) {
        KG.statechart.sendAction('mousePositionChanged', KG.LonLat.create({
            lon: e.latlng.lng,
            lat: e.latlng.lat
        }));
    },

    onLayerAdd: function(e) {
        if (e.layer === this._popupInfo) {
            $(this._popupInfo._container).addClass('info-popup');
        }
    },

    onLayerRemove: function(e) {
        try {
            var self = KG.core_leaflet;
            if (self._popupMarker && self._popupMarker === e.layer) {
                console.log('popup closed');
                //popup closed
                KG.statechart.sendAction('hideMarkerPopupAction', self);
                e.layer.off('click', e.layer.openPopup, e.layer);
            } else if (self._popupInfo && self._popupInfo === e.layer) {
                //popup closed
                KG.statechart.sendAction('hideInfoPopupAction', self);
            }
        } catch(e) {}
    },

    pixelsToWorld: function(pixels) {
        var center = this.getCenter();
        var centerOff = this.getCenterOffsetPixels(pixels);
        var dLat = centerOff.lat - center.lat;
        var dLon = centerOff.lon - center.lon;
        return Math.sqrt(dLat * dLat + dLon * dLon);
    },

    getCenter: function() {
        var center = this.map.getCenter();
        return KG.LonLat.create({
            lon: center.lng,
            lat: center.lat
        });
    },

    getCenterOffsetPixels: function(pixels) {
        var viewHalf = this.map.getSize().divideBy(2);
        var centerPoint = this.map._getTopLeftPoint().add(viewHalf);
        var pointOff = centerPoint.add(new L.Point(pixels, pixels));
        var offcenter = this.map.unproject(pointOff);
        return KG.LonLat.create({
            lon: offcenter.lng,
            lat: offcenter.lat
        });
    },

    getZoom: function() {
        return this.map.getZoom();
    },

    getFatBounds: function() {
        return this._getBounds(this.pixelsToWorld(this.map.getSize().divideBy(6).x));
    },

    getBounds: function() {
        return this._getBounds(0);
    },

    getBoundsA: function() {
        var lbounds = this.map.getBounds();
        var lcenter = this.map.getCenter();
        var sw = lbounds._southWest;
        var ne = lbounds._northEast;
        var b = [];
        if (!lbounds.contains(lcenter)) {
            b[0] = KG.Bounds.create({
                sw: KG.LonLat.create({
                    lon: -179.9999,
                    lat: sw.lat
                }),
                ne: KG.LonLat.create({
                    lon: sw.lng,
                    lat: ne.lat
                })
            });
            b[1] = KG.Bounds.create({
                sw: KG.LonLat.create({
                    lon: ne.lng,
                    lat: sw.lat
                }),
                ne: KG.LonLat.create({
                    lon: 179.9999,
                    lat: ne.lat
                })
            });
        } else {
            b[0] = KG.Bounds.create({
                sw: KG.LonLat.create({
                    lon: sw.lng,
                    lat: sw.lat
                }),
                ne: KG.LonLat.create({
                    lon: ne.lng,
                    lat: ne.lat
                })
            });
        }
        return b;
    },

    _getBounds: function(fat) {
        var lbounds = this.map.getBounds();
        var lsw = lbounds._southWest;
        var lne = lbounds._northEast;
        var sw = {};
        var ne = {};
        sw.lat = Math.max(lsw.lat - fat, -90);
        sw.lon = Math.max(lsw.lng - fat, -179.9999);
        ne.lat = Math.min(lne.lat + fat, 90);
        ne.lon = Math.min(lne.lng + fat, 179.9999);
        return KG.Bounds.create({
            sw: KG.LonLat.create({
                lon: sw.lon,
                lat: sw.lat
            }),
            ne: KG.LonLat.create({
                lon: ne.lon,
                lat: ne.lat
            })
        });
    },

    setCenter: function(center, zoom) {
        if (!center) {
            return NO;
        }
        if (!zoom) {
            zoom = this.map.getZoom();
        }
        this.map.setView(new L.LatLng(center.get('lat'), center.get('lon')), zoom);
        return YES;
    },

    addMarker: function(marker, lon, lat, options) {
        var title, animated, iconPath, draggable, popupContent, openPopup, clickTarget, clickCb, dragendTarget, dragendCb, injectGetNativePositionFunction;
        if (options) {
            title = options.title;
            animated = options.animated;
            iconPath = options.iconPath;
            draggable = options.draggable;
            popupContent = options.popupContent;
            openPopup = options.openPopup;
            clickTarget = options.clickTarget;
            clickCb = options.clickCb;
            dragendTarget = options.dragendTarget;
            dragendCb = options.dragendCb;
            injectGetNativePositionFunction = options.injectGetNativePositionFunction;
        }
        var key = iconPath + animated;
        var icon = this._icons[key];
        if (!icon) {
            icon = new L.Icon(iconPath);
            if (animated) {
                icon.createIcon = function() {
                    var img = this._createIcon('icon');
                    img.className = img.className + " " + "animated-marker";
                    return img;
                };
            }
            this._icons[key] = icon;
        }
        var lmarkerLocation = new L.LatLng(lat, lon);
        var lmarker = new L.Marker(lmarkerLocation, {
            draggable: draggable,
            title: title,
            icon: icon
        });
        this.map.addLayer(lmarker);
        if (clickCb) {
            lmarker.on('click',
            function() {
                clickCb.call(clickTarget, marker, lmarker._latlng.lng, lmarker._latlng.lat);
            });
        }
        if (dragendCb) {
            lmarker.on('dragend',
            function() {
                dragendCb.call(dragendTarget, marker, lmarker._latlng.lng, lmarker._latlng.lat);
            });
        }
        if (!SC.none(marker._native_marker)) {
            var map = this.map;
            var old_native = marker._native_marker;
            //differred to avoid flickering
            setTimeout(function() {
                map.removeLayer(old_native);
            },
            250);
        }
        if (!SC.none(popupContent)) {
            lmarker.bindPopup(popupContent);
            if (!SC.none(openPopup)) {
                setTimeout(function() {
                    if (lmarker && lmarker._popup && lmarker._map) {
                        lmarker.openPopup();
                    }
                },
                animated ? 1000 : 1);
            }
        }
        marker._native_marker = lmarker;
        if (injectGetNativePositionFunction) {
            marker.getNativePosition = function() {
                return KG.LonLat.create({
                    lon: lmarker._latlng.lng,
                    lat: lmarker._latlng.lat
                });
            }
        }
        if (animated) {
            //animate marker
            setTimeout(function() {
                $('.animated-marker').addClass('animated-marker-ready');
            },
            50);
        }
        return marker;
    },

    reAddMarker: function(marker) {
        if (marker._native_marker) {
            this.map.removeLayer(marker._native_marker);
            this.map.addLayer(marker._native_marker);
        }
    },

    removeMarker: function(marker) {
        if (marker._native_marker) {
            this.map.removeLayer(marker._native_marker);
            marker._native_marker = null;
        }
    },

    enableDraggableMarker: function(marker) {
        if (marker && marker._native_marker) {
            var nativ = marker._native_marker;
            nativ.options.draggable = true;
            if (nativ.dragging) {
                nativ.dragging.enable();
            }
        }
    },

    disableDraggableMarker: function(marker) {
        if (marker && marker._native_marker) {
            var nativ = marker._native_marker;
            nativ.options.draggable = false;
            if (nativ.dragging) {
                nativ.dragging.disable();
            }
        }
    },

    addWMSLayer: function(layer) {
        var wms = new L.TileLayer.WMS(layer.get('url'), {
            layers: layer.get('name'),
            transparent: YES,
            format: 'image/png',
            tiled: YES,
            tilesorigin: '0,0',
            //set to YES to by pass geowebcache
            no_gwc: NO,
            kg_layer: layer.get('id'),
            kg_sandbox: KG.get('activeSandboxKey'),
            auth_token: KG.core_auth.get('authenticationToken'),
            counter: this._counter++
        });
        layer._native_layer = wms;
        localStorage.setItem(KG.localStorageLeafletCacheKey, this._counter);
        this.map.addLayer(wms);
    },

	removeLayer: function(layer) {
		if (layer._native_layer) {
			this.map.removeLayer(layer._native_layer);
		}
	},
	
    //increment counter to include in the wms url to force refresh (not from cache)
    _counter: localStorage.getItem(KG.localStorageLeafletCacheKey) || 1,

    refreshWMSLayer: function(layer) {
        if (layer._native_layer) {
            var actual = layer._native_layer;
            this.addWMSLayer(layer);
            var self = this;
			//remove the old one after a delay to avoid flash effect
            setTimeout(function() {
                self.map.removeLayer(actual);
            },
            500);
        }
    },

    mapSizeDidChange: function(center) {
        this.map.invalidateSize();
        if (center) {
            this.map.setView(new L.LatLng(center.get('lat'), center.get('lon')), this.map.getZoom());
        }
    },

    showPopupMarker: function(marker, content) {
        var popup = this._popupMarker;
        this.updatePopupMarkerPosition(marker.get('lon'), marker.get('lat'));
        popup.setContent(content);
        if (!popup._opened) {
            this.map.openPopup(popup);
        }
        setTimeout(function() {
            popup._update();
            //to secure the update, re-do it even later
            setTimeout(function() {
                popup._update()
            },
            100);
        },
        1);
    },

    updatePopupMarkerPosition: function(lon, lat) {
        var popup = this._popupMarker;
        popup.setLatLng(new L.LatLng(lat, lon));
    },

    closePopup: function() {
        this.map.closePopup();
    },

    showPopupInfo: function(latLon, content) {
        var popup = this._popupInfo;
        popup.setLatLng(new L.LatLng(latLon.get('lat'), latLon.get('lon')));
        popup.setContent(content);
        this.map.openPopup(popup);
        setTimeout(function() {
            popup._update();
            //to secure the update, re-do it even later
            setTimeout(function() {
                popup._update()
            },
            100);
        },
        1);
    },

    updatePopupInfo: function() {
        if (this._popupInfo) {
            this._popupInfo._updateLayout();
            this._popupInfo._updatePosition();
            this._popupInfo._adjustPan();
        }
    },

    addHighlight: function(geo) {
        if (!geo) {
            return NO;
        }
        var coords = geo.coords;
        var geo_type = geo.geo_type;
        var options = {
            color: '#0033ff',
            weight: 5,
            opacity: 0.5,
            fillColor: null,
            //same as color by default
            fillOpacity: 0.2,
            clickable: false
        };
        var layer = this.createLayerFromCoordinates(coords, geo_type, options);
        this.map.addLayer(layer);
        return SC.Object.create({
            coords: coords,
            geo_type: geo_type,
            _native_hl: layer
        });
    },

    removeHighlight: function(hl) {
        if (hl && hl._native_hl) {
            this.map.removeLayer(hl._native_hl);
            return YES;
        }
        return NO;
    },

    createLayerFromCoordinates: function(coordinates, geo_type, options) {
        var layer;
        if (geo_type) {
            geo_type = geo_type.toLowerCase();
        } else {
            geo_type = 'point';
        }
        //TODO Better support for multigeo
        if (geo_type === 'point' || geo_type === 'multipoint') {
            var circleLocation = new L.LatLng(coordinates[0].y, coordinates[0].x);
            //8 pixels radius circle
            options.radius = 7;
            options.weight = 2;
            options.fill = YES;
            layer = new L.CircleMarker(circleLocation, options);
        } else if (geo_type === 'linestring' || geo_type === 'multilinestring') {
            var latlngs = [];
            coordinates.forEach(function(c) {
                var coord = new L.LatLng(c.y, c.x);
                latlngs.push(coord);
            });
            layer = new L.Polyline(latlngs, options);
        } else if (geo_type === 'polygon' || geo_type === 'multipolygon') {
            var latlngs = [];
            coordinates.forEach(function(c) {
                var coord = new L.LatLng(c.y, c.x);
                latlngs.push(coord);
            });
            layer = new L.Polygon(latlngs, options);
        }
        return layer;
    },

    _temp: null,
    _temp2: null,
    printBoundsA: function() {
        if (!SC.none(this._temp)) {
            this.map.removeLayer(this._temp);
        }
        if (!SC.none(this._temp2)) {
            this.map.removeLayer(this._temp2);
        }
        console.log(this.map.getBounds());
        var bounds = this.getBoundsA()[0];
        var sw = bounds.sw;
        var ne = bounds.ne;
        var p1 = new L.LatLng(sw.lat, sw.lon);
        var p2 = new L.LatLng(ne.lat, sw.lon);
        var p3 = new L.LatLng(ne.lat, ne.lon);
        var p4 = new L.LatLng(sw.lat, ne.lon);
        var pts = [p1, p2, p3, p4];
        this._temp = new L.Polygon(pts);
        this.map.addLayer(this._temp);
        bounds = this.getBoundsA()[1];
        if (bounds) {
            sw = bounds.sw;
            ne = bounds.ne;
            p1 = new L.LatLng(sw.lat, sw.lon);
            p2 = new L.LatLng(ne.lat, sw.lon);
            p3 = new L.LatLng(ne.lat, ne.lon);
            p4 = new L.LatLng(sw.lat, ne.lon);
            pts = [p1, p2, p3, p4];
            this._temp2 = new L.Polygon(pts, {
                color: 'red'
            });
            this.map.addLayer(this._temp2);
        }
        return this.getBoundsA();
    },

    printBounds: function() {
        if (!SC.none(this._temp)) {
            this.map.removeLayer(this._temp);
        }
        var bounds = this.getBounds();
        var sw = bounds.sw;
        var ne = bounds.ne;
        var p1 = new L.LatLng(sw.lat, sw.lon);
        var p2 = new L.LatLng(ne.lat, sw.lon);
        var p3 = new L.LatLng(ne.lat, ne.lon);
        var p4 = new L.LatLng(sw.lat, ne.lon);
        var pts = [p1, p2, p3, p4];
        this._temp = new L.Polygon(pts);
        this.map.addLayer(this._temp);
        return bounds;
    },

    removeShadow: function(marker) {
        if (marker._native_marker && marker._native_marker._shadow) {
            marker._native_marker._map._panes.shadowPane.removeChild(marker._native_marker._shadow);
            marker._native_marker._shadow = undefined;
        }
    }
});

//***********************************
// From a pull request not yet integrated
// https://github.com/CloudMade/Leaflet/pull/291
// to remove when included in Leaflet
L.BingLayer = L.TileLayer.extend({
    options: {
        subdomains: [0, 1, 2, 3],
        attribution: 'Bing',
    },

    initialize: function(key, options) {
        L.Util.setOptions(this, options);

        this._key = key;
        this._url = null;
        this.meta = {};
        this._update_tile = this._update;
        this._update = function() {
            if (this._url == null) return;
            this._update_attribution();
            this._update_tile();
        };
        this.loadMetadata();
    },

    tile2quad: function(x, y, z) {
        var quad = '';
        for (var i = z; i > 0; i--) {
            var digit = 0;
            var mask = 1 << (i - 1);
            if ((x & mask) != 0) digit += 1;
            if ((y & mask) != 0) digit += 2;
            quad = quad + digit;
        }
        return quad;
    },

    getTileUrl: function(p, z) {
        var subdomains = this.options.subdomains,
        s = this.options.subdomains[(p.x + p.y) % subdomains.length];
        return this._url.replace('{subdomain}', s).replace('{quadkey}', this.tile2quad(p.x, p.y, z)).replace('{culture}', '');
    },

    loadMetadata: function() {
        var _this = this;
        var cbid = '_bing_metadata';
        window[cbid] = function(meta) {
            _this.meta = meta;
            window[cbid] = undefined;
            var e = document.getElementById(cbid);
            e.parentNode.removeChild(e);
            if (meta.errorDetails) {
                alert("Got metadata" + meta.errorDetails);
                return;
            }
            _this.initMetadata();
        };
        //AerialWithLabels,Aerial or Road
        var url = "http://dev.virtualearth.net/REST/v1/Imagery/Metadata/Road?include=ImageryProviders&jsonp=" + cbid + "&key=" + this._key;
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.id = cbid;
        document.getElementsByTagName("head")[0].appendChild(script);
    },

    initMetadata: function() {
        var r = this.meta.resourceSets[0].resources[0];
        this.options.subdomains = r.imageUrlSubdomains;
        this._url = r.imageUrl;
        this._providers = [];
        for (var i = 0; i < r.imageryProviders.length; i++) {
            var p = r.imageryProviders[i];
            for (var j = 0; j < p.coverageAreas.length; j++) {
                var c = p.coverageAreas[j];
                var coverage = {
                    zoomMin: c.zoomMin,
                    zoomMax: c.zoomMax,
                    active: false
                };
                var bounds = new L.LatLngBounds(
                new L.LatLng(c.bbox[0] + 0.01, c.bbox[1] + 0.01), new L.LatLng(c.bbox[2] - 0.01, c.bbox[3] - 0.01));
                coverage.bounds = bounds;
                coverage.attrib = p.attribution;
                this._providers.push(coverage);
            }
        }
        this._update();
    },

    _update_attribution: function() {
        var bounds = this._map.getBounds();
        var zoom = this._map.getZoom();
        for (var i = 0; i < this._providers.length; i++) {
            var p = this._providers[i];
            if ((zoom <= p.zoomMax && zoom >= p.zoomMin) && this._intersects(bounds, p.bounds)) {
                if (!p.active) this._map.attributionControl.addAttribution(p.attrib);
                p.active = true;
            } else {
                if (p.active) this._map.attributionControl.removeAttribution(p.attrib);
                p.active = false;
            }
        }
    },

    _intersects: function(obj1, obj2)
    /*-> Boolean*/
    {
        var sw = obj1.getSouthWest(),
        ne = obj1.getNorthEast(),
        sw2 = obj2.getSouthWest(),
        ne2 = obj2.getNorthEast();

        return (sw2.lat <= ne.lat) && (sw2.lng <= ne.lng) && (sw.lat <= ne2.lat) && (sw.lng <= ne2.lng);
    }
});


     /*        var osmURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		var at = 'OSM';
		baseLayer = new L.TileLayer(osmURL, {
		    maxZoom: 20,
		    attribution: at
		});
		*/

     /*	var key = '8ccaf9c293f247d6b18a30fce375e298';
     var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/' + key + '/997/256/{z}/{x}/{y}.png',
     cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
     baseLayer = new L.TileLayer(cloudmadeUrl, {
         maxZoom: 18,
         attribution: cloudmadeAttribution
     });
*?
     /*var mapquestUrl = 'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
     mapquestAttribution = "Data CC-By-SA by <a href='http://openstreetmap.org/' target='_blank'>OpenStreetMap</a>, Tiles Courtesy of <a href='http://open.mapquest.com' target='_blank'>MapQuest</a>",
     baseLayer = new L.TileLayer(mapquestUrl, {
         maxZoom: 18,
         attribution: mapquestAttribution,
         subdomains: ['1', '2', '3', '4']
     });*/


/**
* Core functions to manage the map (leaflet framework)
*  Default Object Instance
**/
KG.core_leaflet = KG.MapLeaflet.create({
});


/**
* Core functions to perform highlights
* 
**/
KG.core_highlight = SC.Object.create({

	//use map leaflet default object.
	map: KG.core_leaflet,

    clearHighlight: function(hl) {
        if (hl) {
            this.map.removeHighlight(hl);
        }
    },

    highlightFeature: function(feature) {
        if (!feature) {
            return NO;
        }
        try {
            return this.map.addHighlight(feature.get('geo'));
        } catch(e) {
            return null;
        }
    },

    clearHighlightMarker: function(hlMarker) {
        if (hlMarker) {
            this.map.removeMarker(hlMarker);
        }
    },

    addHighlightMarker: function(lonLat) {
        if (!lonLat) {
            return NO;
        }
        try {
            var options = {
                title: null,
                animated: NO,
                iconPath: 'css/images/highlight.png',
                draggable: NO,
                dragendTarget: this,
                dragendCb: this.markerDragged,
                injectGetNativePositionFunction: YES
            };
            var marker = Ember.Object.create({
                lon: function() {
                    return this.getNativePosition().get('lon');
                }.property(),
                lat: function() {
                    return this.getNativePosition().get('lat');
                }.property()
            });
            return this.map.addMarker(marker, lonLat.get('lon'), lonLat.get('lat'), options);
        } catch(e) {
            return NO;
        }
    },

    markerDragged: function(marker, lon, lat) {
        KG.statechart.sendAction('markerDragEnded', lon, lat);
    }
})


/**
* Localize the page
**/
var fr = { 
	"_logout": "Déconnection",
	"_sandboxesListOne": "Votre projet:",
	"_sandboxesList": "Vos %@ projets:",
	"_sandboxesNothing": "Vous n'avez pas de projet.",
	"_errorLoading": "Erreur lors du chargement des projets.",
	"_welcomeUser": "Bienvenue %@",
	"_wrong-membership": "Vous n'être pas membre de ce projet.",
	"_sbDateFormat": "%@/%@/%@",
	"_by" : "Par",
	"_createSandboxTitle": "Créer un nouveau projet",
	"_add" : "Ajouter",
	"_cancelTooltip": "Annuler",
	"_commitTooltip": "Sauvegarder",
	"_sandboxName": "Le nom du projet",
	"_nameAlreadyTaken" : "Vous avez déjà un projet de ce nom.",
	"_position" : "Emplacement de départ",
	"_requestError": "Erreur, le nom du projet semble invalide.",
	"_serverError": "Erreur du serveur, veuillez réessayer plus tard.",
	"_delete": "Supprimer",
	"_sandboxDescription": "Par %@ à %@",
	"_leave": "Quitter",
	"_cancel": "Annuler"
};

var en = {
	"_logout": "Logout",
	"_sandboxesListOne": "Your projet:",
	"_sandboxesList": "Your %@ projets:",
	"_sandboxesNothing": "You don't have any project.",
	"_errorLoading": "Cannot load the projects.",
	"_welcomeUser": "Welcome %@",
	"_wrong-membership": "You are not a member of this project.",
	"_sbDateFormat": "%@/%@/%@",
	"_by" : "By",
	"_createSandboxTitle": "Create a new sandbox",
	"_add" : "Add",
	"_cancelTooltip": "Cancel",
	"_commitTooltip": "Save",
	"_sandboxName": "The Sandbox Name",
	"_nameAlreadyTaken" : "You already have a sandbox with that name",
	"_position" : "Start Position",
	"_requestError": "Error, the sandbox's name might be invalid.",
	"_serverError": "Server error, please try again later.",
	"_delete": "Delete",
	"_sandboxDescription": "By %@ at %@",
	"_leave": "Leave",
	"_cancel": "Cancel"
};

if(KG.lang === 'fr'){
	jQuery.extend(Ember.STRINGS, fr);
}else{
	jQuery.extend(Ember.STRINGS, en);
}


/**
* Core functions for the home page
**/
KG.core_home = SC.Object.create({

    createSandboxTitle: "_createSandboxTitle".loc(),

    //map for Home usage
    map: KG.MapLeaflet.create({ baseLayer: 'OSM'}),

    connectedUserLabel: function() {
        var user = KG.core_auth.get('activeUser');
        if (user) {
            return "_welcomeUser".loc(user.name);
        } else {
            return '';
        }
    }.property('KG.core_auth.activeUser'),

    loadSandboxList: function() {
		if(KG.sandboxesController.get('content')){
			KG.sandboxesController.get('content').destroy();
		}
		KG.store.unloadRecords(KG.Sandbox);
		KG.sandboxesController.set('recordsReady', NO);
        var records;
        records = KG.store.find(KG.SANDBOX_QUERY);
        KG.sandboxesController.set('content', records);
        records.onReady(this, this._onListReady);
        records.onError(this, this._onListError);
    },

    _onListReady: function(records) {
        KG.sandboxesController.set('recordsReady', YES);
        records.offError();
    },

    _onListError: function(records) {
        KG.homePanelController.set(errorMessage, '_errorLoading'.loc());
    }
});


KG.sandboxesController = Ember.ArrayController.create({
	content: null,
	recordsReady:  NO,
	title: '',
		
	recordsReadyChange: function(){
		var val;
		if (this.get('recordsReady')) {
	        var count = this.get('length');
	        if (count > 0) {
				if(count === 1){
					val = "_sandboxesListOne".loc();
				}else{
	            	val = "_sandboxesList".loc(count);
				}
	        } else {
	            val = "_sandboxesNothing".loc();
	        }
	    }else{
			val =  '';
		}
		this.set('title', val);
	}.observes('recordsReady', 'content.length')
	
});

KG.addSandboxController = Ember.Object.create({
	name: '',
	
	cancelCreateTooltip: '_cancelTooltip'.loc(),
	
	commitCreateTooltip: '_commitTooltip'.loc(),
});

KG.deleteController = Ember.ArrayController.create({
	
	content: []
});

KG.homePanelController = Ember.Object.create({

    listSandboxHidden: NO,
    listSandboxPushed: NO,

    addSandboxHidden: YES,
    addSandboxPushed: YES,

    deleteMode: NO,

	createSandboxButtonDisabled: NO,

    addTitle: '_createSandboxTitle'.loc(),

    errorMessage: '',

    listTitle: function() {
        return KG.sandboxesController.get('title');
    }.property('KG.sandboxesController.title'),

    setListSandboxActive: function() {
        clearTimeout(this._timeout);
        var self = this;
        this.set('listSandboxHidden', NO);
        this.set('listSandboxPushed', NO);
        this.set('addSandboxPushed', YES);
        this._timeout = setTimeout(function() {
            self.set('addSandboxHidden', YES);
        },
        700);
    },

    setAddSandboxActive: function() {
        clearTimeout(this._timeout);
        var self = this;
        this.set('addSandboxHidden', NO);
        this.set('addSandboxPushed', NO);
        this.set('listSandboxPushed', YES);
        this._timeout = setTimeout(function() {
            self.set('listSandboxHidden', YES);
			KG.core_home.map.setCenter(KG.LonLat.create({lon: -72, lat:46}), 6);
            KG.core_home.map.mapSizeDidChange();			
        },
        700);
    }

});


KG.AddSandboxView = Ember.View.extend({
	classNameBindings: ['hidden', 'pushed'],
	hiddenBinding: 'KG.homePanelController.addSandboxHidden',
	pushedBinding: 'KG.homePanelController.addSandboxPushed',
})

KG.DeleteCheckboxView = KG.Button.extend({
	
	classNameBindings:['KG.homePanelController.deleteMode:is-visible'],
	
	isChecked: NO,
	
	isOwner: function(){
		var content = this.getPath('itemView.content');
		if(content && KG.core_auth.get('activeUser') && content.get('owner') === KG.core_auth.get('activeUser').id){
			return YES;
		}
		return NO;
	}.property('itemView.content'),
	
	deleteListDidChange: function(){
		var content = this.getPath('itemView.content');
		if(KG.deleteController.indexOf(content) > -1){
			this.set('isChecked', YES);
		}else{
			this.set('isChecked', NO);
		}		
	}.observes('itemView.content', 'KG.deleteController.length')
});

KG.SandboxListView = Ember.View.extend({
	classNameBindings: ['hidden', 'pushed'],
	hiddenBinding: 'KG.homePanelController.listSandboxHidden',
	pushedBinding: 'KG.homePanelController.listSandboxPushed'
})

//super view to show the sandbox properties
KG.SandboxView = KG.Button.extend({

    triggerAction: function() {
		console.log('open!!');
        KG.statechart.sendAction('openSandboxAction', this.getPath('itemView.content.guid'));
    }
});


/**
* View to render the sandbox list title.
**/
KG.TitleView = SC.View.extend({

    titleStringBinding: 'KG.homePanelController.listTitle'

});


Ember.TEMPLATES["sandbox-list"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n	");
  stack1 = depth0;
  stack2 = "titleString";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n");
  return buffer;}

function program3(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n");
  stack1 = {};
  stack2 = "KG.sandboxesController";
  stack1['contentBinding'] = stack2;
  stack2 = "sandbox-list";
  stack1['class'] = stack2;
  stack2 = helpers.collection || depth0.collection;
  tmp1 = self.program(4, program4, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	\n");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "create-sandbox-button";
  stack3['id'] = stack4;
  stack4 = "white-button";
  stack3['class'] = stack4;
  stack4 = "createSandboxAction";
  stack3['sc_action'] = stack4;
  stack4 = "KG.core_home.createSandboxTitle";
  stack3['titleBinding'] = stack4;
  stack4 = "KG.sandboxesController.recordsReady";
  stack3['isVisibleBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(10, program10, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "delete-mode-button";
  stack3['id'] = stack4;
  stack4 = "white-button";
  stack3['class'] = stack4;
  stack4 = "toggleDeleteSandboxModeAction";
  stack3['sc_action'] = stack4;
  stack4 = "KG.core_home.deleteSandboxTitle";
  stack3['titleBinding'] = stack4;
  stack4 = "KG.sandboxesController.recordsReady";
  stack3['isVisibleBinding'] = stack4;
  stack4 = "KG.homePanelController.deleteMode";
  stack3['classBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(12, program12, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("	\n");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "delete-sandbox-button";
  stack3['id'] = stack4;
  stack4 = "red-button";
  stack3['class'] = stack4;
  stack4 = "deleteSandboxAction";
  stack3['sc_action'] = stack4;
  stack4 = "KG.homePanelController.deleteMode";
  stack3['classBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(14, program14, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;}
function program4(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n		");
  stack1 = depth0;
  stack2 = "KG.SandboxView";
  stack3 = {};
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "sandbox-list-item common-list-button";
  stack3['class'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(5, program5, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;}
function program5(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "KG.DeleteCheckboxView";
  stack3 = {};
  stack4 = "sb-item-check check-delete-button";
  stack3['class'] = stack4;
  stack4 = "checkSandboxAction";
  stack3['sc_action'] = stack4;
  stack4 = "isChecked isOwner";
  stack3['classBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(6, program6, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n			");
  stack1 = {};
  stack2 = "span";
  stack1['tagName'] = stack2;
  stack2 = "sandbox-name";
  stack1['class'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(8, program8, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n			<div class=\"info-line\">\n				");
  stack1 = depth0;
  stack2 = "itemView.content.formattedDescription";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n			</div>\n		");
  return buffer;}
function program6(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n				<span>✓</span> ");
  stack1 = depth0;
  stack2 = "_leave";
  stack3 = {};
  stack4 = "span";
  stack3['tagName'] = stack4;
  stack4 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n			");
  return buffer;}

function program8(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n				");
  stack1 = depth0;
  stack2 = "itemView.content.name";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n			");
  return buffer;}

function program10(depth0,data) {
  
  
  data.buffer.push("\n	<div></div>\n");}

function program12(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n	<div></div>\n	");
  stack1 = depth0;
  stack2 = "_cancel";
  stack3 = {};
  stack4 = "span";
  stack3['tagName'] = stack4;
  stack4 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n");
  return buffer;}

function program14(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n	");
  stack1 = depth0;
  stack2 = "_delete";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "\n");
  return buffer;}

  stack1 = depth0;
  stack2 = "KG.TitleView";
  stack3 = {};
  stack4 = "sandboxes-title";
  stack3['id'] = stack4;
  stack4 = "page-title";
  stack3['class'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  stack1 = helpers.view || depth0.view;
  tmp1 = self.program(3, program3, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("		");
  return buffer;
})

Ember.TEMPLATES["add-sandbox"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n	");
  stack1 = depth0;
  stack2 = "KG.homePanelController.addTitle";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n");
  return buffer;}

function program3(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n	<div>\n		");
  stack1 = depth0;
  stack2 = "KG.TextField";
  stack3 = {};
  stack4 = "_sandboxName";
  stack3['placeholder_not_loc'] = stack4;
  stack4 = "KG.addSandboxController.name";
  stack3['valueBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "view", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "	\n	</div>\n	");
  stack1 = depth0;
  stack2 = "_position";
  stack3 = {};
  stack4 = "field-label";
  stack3['class'] = stack4;
  stack4 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n	<div id=\"add-sandbox-map\"></div>\n	");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "white-button";
  stack3['class'] = stack4;
  stack4 = "cancelCreateAction";
  stack3['sc_action'] = stack4;
  stack4 = "KG.addSandboxController.cancelCreateTooltip";
  stack3['titleBinding'] = stack4;
  stack4 = "KG.homePanelController.createSandboxInProgress";
  stack3['disabledBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(4, program4, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "white-button";
  stack3['class'] = stack4;
  stack4 = "commitCreateAction";
  stack3['sc_action'] = stack4;
  stack4 = "KG.addSandboxController.commitCreateTooltip";
  stack3['titleBinding'] = stack4;
  stack4 = "KG.homePanelController.createSandboxInProgress";
  stack3['disabledBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(6, program6, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;}
function program4(depth0,data) {
  
  
  data.buffer.push("\n		<img src=\"css/images/cancel_30.png\">\n	");}

function program6(depth0,data) {
  
  
  data.buffer.push("\n		<img src=\"css/images/checkmark_30.png\">\n	");}

  stack1 = {};
  stack2 = "add-sandbox-title";
  stack1['id'] = stack2;
  stack2 = "page-title";
  stack1['class'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  stack1 = {};
  stack2 = "inner-add-sandbox-panel";
  stack1['id'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(3, program3, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  return buffer;
})

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

Ember.TEMPLATES["page-header"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var stack1, stack2, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n	");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "active-sandbox-button";
  stack3['id'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "header-button";
  stack3['class'] = stack4;
  stack4 = "yes";
  stack3['disabled'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(2, program2, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	");
  stack1 = {};
  stack2 = "active-user-panel";
  stack1['templateName'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "view", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1) + "\n	");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "palette-button";
  stack3['id'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "header-button header-button-icon";
  stack3['class'] = stack4;
  stack4 = "showPaletteAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(4, program4, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "create-note-button";
  stack3['id'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "header-button header-button-icon";
  stack3['class'] = stack4;
  stack4 = "createNoteAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(6, program6, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	");
  stack1 = {};
  stack2 = "notification-panel";
  stack1['templateName'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "view", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1) + "\n	\n	");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "search-button";
  stack3['id'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "toogleSearchPopopAction";
  stack3['sc_action'] = stack4;
  stack4 = "header-button header-button-icon";
  stack3['class'] = stack4;
  stack4 = "KG.searchController.activePopup";
  stack3['classBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(8, program8, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	\n	");
  stack1 = {};
  stack2 = "bookmark-panel";
  stack1['templateName'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "view", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1) + "\n");
  return buffer;}
function program2(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n		<div class=\"message-label\"><span class=\"label-ellipsis\">");
  stack1 = depth0;
  stack2 = "KG.core_sandbox.sandboxLabel";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "</span></div>\n	");
  return buffer;}

function program4(depth0,data) {
  
  
  data.buffer.push("\n		<img src=\"css/images/palette.png\">\n	");}

function program6(depth0,data) {
  
  
  data.buffer.push("\n		<img src=\"css/images/note.png\">\n	");}

function program8(depth0,data) {
  
  
  data.buffer.push("\n			<span class=\"button-image\"><span>\n	");}

  stack1 = {};
  stack2 = "header";
  stack1['tagName'] = stack2;
  stack2 = "sandbox-header";
  stack1['id'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
})

Ember.TEMPLATES["active-user-panel"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n	<div class=\"message-label\"><span class=\"label-ellipsis\">");
  stack1 = depth0;
  stack2 = "KG.activeUserController.name";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "</span></div>\n	");
  stack1 = {};
  stack2 = "super-active-user-popup";
  stack1['id'] = stack2;
  stack2 = "activePopup";
  stack1['isVisibleBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(2, program2, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;}
function program2(depth0,data) {
  
  var buffer = '', stack1, stack2;
  data.buffer.push("\n			");
  stack1 = {};
  stack2 = "active-user-popup";
  stack1['id'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(3, program3, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	");
  return buffer;}
function program3(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("					\n					");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "backHomeAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(4, program4, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n			");
  return buffer;}
function program4(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n						");
  stack1 = depth0;
  stack2 = "_backHome";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "\n					");
  return buffer;}

  stack1 = depth0;
  stack2 = "KG.UserButtonView";
  stack3 = {};
  stack4 = "active-user-button";
  stack3['id'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "header-button";
  stack3['class'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
})

// javascript:/***%20Core%20functions%20to%20perform%20searches**/KG.core_search%20=%20SC.Object.create({plugins:%20[],searchAsked:%20NO,_view:%20null,addPlugin:%20function(plugin)%20{this.plugins.pushObject(plugin);},searchFeatures:%20function()%20{var%20search%20=%20KG.searchController.get(%27searchValue%27);var%20content%20=%20KG.searchController.get(%27content%27);var%20store%20=%20KG.store;if%20(content%20&&%20content.destroy)%20{content.forEach(function(cat)%20{store.unloadRecord(KG.SearchCategory,%20cat.get(%27id%27),%20cat.get(%27storeKey%27))});content.destroy();}console.log(%27search%20for:%27%20+%20search);KG.SEARCH_QUERY.search%20=%20search;var%20records%20=%20store.find(KG.SEARCH_QUERY);KG.searchController.set(%27content%27,%20records);this.plugins.forEach(function(plugin)%20{plugin.set(%27searchValue%27,%20search);});this.set(%27searchAsked%27,%20YES);},clearSearchFeatures:%20function()%20{KG.searchController.set(%27searchValue%27,%20%27%27);var%20content%20=%20KG.searchController.get(%27content%27);var%20store%20=%20KG.store;if%20(content%20&&%20content.destroy)%20{content.forEach(function(cat)%20{store.unloadRecord(KG.SearchCategory,%20cat.get(%27id%27),%20cat.get(%27storeKey%27))});content.destroy();}KG.searchController.set(%27content%27,%20[]);this.set(%27searchAsked%27,%20NO);},showResults:%20function()%20{var%20actualContent%20=%20KG.searchResultsController.get(%27content%27);if(actualContent%20&&%20actualContent.destroy){actualContent.destroy();}KG.searchResultsController.set(%27listVisible%27,%20YES);var%20cat%20=%20KG.searchResultsController.get(%27category%27);if%20(SC.none(cat))%20{var%20plugin%20=%20KG.searchResultsController.get(%27plugin%27);KG.searchResultsController.set(%27content%27,%20null);if%20(!SC.none(plugin))%20{plugin.loadRecords(null,%20function(records)%20{KG.searchResultsController.set(%27content%27,%20records);});}}%20else%20{var%20records%20=%20cat.findRecords(KG.searchResultsController.get(%27nextBlockStart%27));if(records.onReady){records.onReady(null,%20function(){KG.searchResultsController.set(%27content%27,%20array);});}KG.searchResultsController.set(%27content%27,%20records);}},showMoreResults:%20function(){var%20cat%20=%20KG.searchResultsController.get(%27category%27);if(cat){var%20records%20=%20cat.findRecords(KG.searchResultsController.get(%27nextBlockStart%27));}},hideResults:%20function()%20{KG.searchResultsController.set(%27listVisible%27,%20NO);setTimeout(function()%20{var%20content%20=%20KG.searchResultsController.get(%27content%27);if%20(content%20&&%20content.destroy)%20{content.destroy();}KG.searchResultsController.set(%27category%27,%20null);KG.searchResultsController.set(%27content%27,%20[]);KG.core_search.clearSearchFeatures();},800);}});$(document).ready(function()%20{setTimeout(function()%20{KG.core_search._view%20=%20Ember.View.create({templateName:%20%27search-panel%27});KG.core_search._view.appendTo(%27#main-sandbox-view%27);},1000);});
/**
* Core functions to perform searches
**/
KG.core_search = SC.Object.create({

    plugins: [],
    searchAsked: NO,

    //the search panel view
    _view: null,

    createView: function() {
        if (!this._view) {
			var self = this;
            setTimeout(function() {
                self._view = Ember.View.create({
                    templateName: 'search-panel'
                });
                self._view.appendTo('#main-sandbox-view');
            },
            1000);
        }
    },

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
        if (KG.searchResultsController.get('category')) {
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


Ember.TEMPLATES["search-panel"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var stack1, stack2, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n				");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "x-button search-close-button";
  stack3['class'] = stack4;
  stack4 = "toogleSearchPopopAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "view", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n				");
  stack1 = {};
  stack2 = "search-popup";
  stack1['id'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(2, program2, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;}
function program2(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n					");
  stack1 = depth0;
  stack2 = "KG.SearchField";
  stack3 = {};
  stack4 = "KG.searchController.searchHistorySize";
  stack3['resultsBinding'] = stack4;
  stack4 = "_search";
  stack3['placeholder_not_loc'] = stack4;
  stack4 = "KG.searchController.searchValue";
  stack3['valueBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "view", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n						");
  stack1 = {};
  stack2 = "KG.searchController";
  stack1['contentBinding'] = stack2;
  stack2 = "KG.searchController.hasResults";
  stack1['isVisibleBinding'] = stack2;
  stack2 = "search-cat-list";
  stack1['class'] = stack2;
  stack2 = "KG.RecordsButtonView";
  stack1['itemViewClass'] = stack2;
  stack2 = helpers.collection || depth0.collection;
  tmp1 = self.program(3, program3, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n						");
  stack1 = {};
  stack2 = "KG.core_search.plugins";
  stack1['contentBinding'] = stack2;
  stack2 = "KG.core_search.searchAsked";
  stack1['isVisibleBinding'] = stack2;
  stack2 = "search-cat-list";
  stack1['class'] = stack2;
  stack2 = "KG.PluginRecordsButtonView";
  stack1['itemViewClass'] = stack2;
  stack2 = helpers.collection || depth0.collection;
  tmp1 = self.program(17, program17, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n				");
  return buffer;}
function program3(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("		\n							");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "search-cat-item common-list-button";
  stack3['class'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "selectSearchCategoryAction";
  stack3['sc_action'] = stack4;
  stack4 = "recordsVisible";
  stack3['recordsVisibleBinding'] = stack4;
  stack4 = "recordsVisible";
  stack3['classBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(4, program4, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n							<div class=\"super-result-list\">\n								");
  stack1 = {};
  stack2 = "records";
  stack1['contentBinding'] = stack2;
  stack2 = "search-result-list";
  stack1['class'] = stack2;
  stack2 = "recordsVisible";
  stack1['recordsVisibleBinding'] = stack2;
  stack2 = "recordsVisible";
  stack1['classBinding'] = stack2;
  stack2 = helpers.collection || depth0.collection;
  tmp1 = self.program(9, program9, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n								<div class=\"more-panel\">\n									");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "white-button search-more-result";
  stack3['class'] = stack4;
  stack4 = "hasMoreResult";
  stack3['isVisibleBinding'] = stack4;
  stack4 = "showMoreResultsAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(15, program15, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n								</div>\n							</div>\n						");
  return buffer;}
function program4(depth0,data) {
  
  var buffer = '', stack1, stack2;
  data.buffer.push("\n								");
  stack1 = {};
  stack2 = "cat-title-label label-ellipsis";
  stack1['class'] = stack2;
  stack2 = "itemView.content.title";
  stack1['titleBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(5, program5, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("											\n								");
  stack1 = {};
  stack2 = "cat-size-label label-ellipsis capsule-label";
  stack1['class'] = stack2;
  stack2 = "span";
  stack1['tagName'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(7, program7, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n							");
  return buffer;}
function program5(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n									");
  stack1 = depth0;
  stack2 = "itemView.content.title";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n								");
  return buffer;}

function program7(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n									");
  stack1 = depth0;
  stack2 = "itemView.content.count";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n								");
  return buffer;}

function program9(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n									");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "search-record-item common-list-button";
  stack3['class'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "featureZoomAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(10, program10, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n								");
  return buffer;}
function program10(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n										");
  stack1 = {};
  stack2 = "label-ellipsis";
  stack1['class'] = stack2;
  stack2 = "itemView.content.title";
  stack1['titleBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(11, program11, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n										");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "itemView.content.isSelectable";
  stack3['isVisibleBinding'] = stack4;
  stack4 = "search-select";
  stack3['class'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "selectFeatureInspectorAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(13, program13, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n									");
  return buffer;}
function program11(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n											");
  stack1 = depth0;
  stack2 = "itemView.content.title";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n										");
  return buffer;}

function program13(depth0,data) {
  
  
  data.buffer.push("	\n											<img src=\"css/images/right_arrow_24.png\"/>		\n											");}

function program15(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n										");
  stack1 = depth0;
  stack2 = "_showMore";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "\n									");
  return buffer;}

function program17(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n							");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "search-plugin-item common-list-button";
  stack3['class'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "selectSearchPluginAction";
  stack3['sc_action'] = stack4;
  stack4 = "recordsVisible";
  stack3['recordsVisibleBinding'] = stack4;
  stack4 = "recordsVisible";
  stack3['classBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(18, program18, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n							");
  stack1 = {};
  stack2 = "records";
  stack1['contentBinding'] = stack2;
  stack2 = "search-result-list";
  stack1['class'] = stack2;
  stack2 = "recordsVisible";
  stack1['recordsVisibleBinding'] = stack2;
  stack2 = "recordsVisible";
  stack1['classBinding'] = stack2;
  stack2 = helpers.collection || depth0.collection;
  tmp1 = self.program(21, program21, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n						");
  return buffer;}
function program18(depth0,data) {
  
  var buffer = '', stack1, stack2;
  data.buffer.push("\n								");
  stack1 = {};
  stack2 = "plugin-title-label label-ellipsis";
  stack1['class'] = stack2;
  stack2 = "itemView.content.title";
  stack1['titleBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(19, program19, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n							");
  return buffer;}
function program19(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n									");
  stack1 = depth0;
  stack2 = "itemView.content.title";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n								");
  return buffer;}

function program21(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n								");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "search-record-item common-list-button";
  stack3['class'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "featureZoomAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(22, program22, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n							");
  return buffer;}
function program22(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n									");
  stack1 = {};
  stack2 = "label-ellipsis";
  stack1['class'] = stack2;
  stack2 = "itemView.content.title";
  stack1['titleBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(23, program23, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n									");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "itemView.content.hasCreateNote";
  stack3['isVisibleBinding'] = stack4;
  stack4 = "search-create-note";
  stack3['class'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "createNoteFromFeatureAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(25, program25, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n								");
  return buffer;}
function program23(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n										");
  stack1 = depth0;
  stack2 = "itemView.content.title";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n									");
  return buffer;}

function program25(depth0,data) {
  
  
  data.buffer.push("	\n										<img src=\"css/images/note_black.png\"/>		\n									");}

  stack1 = {};
  stack2 = "super-search-popup";
  stack1['id'] = stack2;
  stack2 = "KG.searchController.activePopup";
  stack1['classBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
})

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

	createView: function(){
		if(!this._view){
			var self = this;
			setTimeout(function() {
		        self._view = Ember.View.create({
		            templateName: 'inspector'
		        });
		        self._view.appendTo('#main-sandbox-view');
		    },
		    1000);
		}
	},

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


/**
* List of Comments for the active feature.
**/
KG.featureCommentsController = KG.CommentsController.create({

	commentsBinding: Ember.Binding.oneWay('KG.inspectorController.feature.comments')
});

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

Ember.TEMPLATES["inspector"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var stack1, stack2, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n	");
  stack1 = {};
  stack2 = "inspector-title";
  stack1['id'] = stack2;
  stack2 = "header";
  stack1['tagName'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(2, program2, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("	\n	<div id=\"inspector-panel\">						\n		");
  stack1 = {};
  stack2 = "KG.inspectorController";
  stack1['contentBinding'] = stack2;
  stack2 = "inspector-attrs-list";
  stack1['class'] = stack2;
  stack2 = helpers.collection || depth0.collection;
  tmp1 = self.program(7, program7, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("	\n		<div id=\"comment-super-panel\">\n		</div>			\n		");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "delete-feature red-button";
  stack3['class'] = stack4;
  stack4 = "deleteFeatureInspectorAction";
  stack3['sc_action'] = stack4;
  stack4 = "KG.inspectorController.deleteTitle";
  stack3['titleBinding'] = stack4;
  stack4 = "KG.inspectorController.isWriteable";
  stack3['isVisibleBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(9, program9, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("													\n	</div>				\n");
  return buffer;}
function program2(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n		");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "ios-button ios-tb-left";
  stack3['class'] = stack4;
  stack4 = "KG.inspectorController.isDirty";
  stack3['isVisibleBinding'] = stack4;
  stack4 = "cancelInspectorAction";
  stack3['sc_action'] = stack4;
  stack4 = "KG.inspectorController.cancelTitle";
  stack3['titleBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(3, program3, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n		<h1 class=\"label-ellipsis\" ");
  stack1 = {};
  stack2 = "KG.inspectorController.title";
  stack1['title'] = stack2;
  stack2 = helpers.bindAttr || depth0.bindAttr;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "bindAttr", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1) + ">");
  stack1 = depth0;
  stack2 = "KG.inspectorController.title";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "</h1>\n		");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "ios-button ios-tb-right";
  stack3['class'] = stack4;
  stack4 = "closeInspectorAction";
  stack3['sc_action'] = stack4;
  stack4 = "KG.inspectorController.saveTitle";
  stack3['titleBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(5, program5, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("			\n	");
  return buffer;}
function program3(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "_cancel";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "\n		");
  return buffer;}

function program5(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "KG.inspectorController.saveLabel";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n		");
  return buffer;}

function program7(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "KG.InspectorAttributeView";
  stack3 = {};
  stack4 = "inspector-list-item";
  stack3['class'] = stack4;
  stack4 = "itemView.content.css_class";
  stack3['classBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "view", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n		");
  return buffer;}

function program9(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "_Delete";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "\n		");
  return buffer;}

  stack1 = {};
  stack2 = "super-inspector";
  stack1['id'] = stack2;
  stack2 = "KG.inspectorController.active";
  stack1['classBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
})

Ember.TEMPLATES["feature-comments"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n	<a href=\"javascript:void(0)\">\n		");
  stack1 = depth0;
  stack2 = "KG.featureCommentsController.commentsLabel";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n	</a>\n");
  return buffer;}

function program3(depth0,data) {
  
  var buffer = '', stack1, stack2;
  data.buffer.push("\n	");
  stack1 = {};
  stack2 = "KG.featureCommentsController.content";
  stack1['contentBinding'] = stack2;
  stack2 = "comment-list";
  stack1['class'] = stack2;
  stack2 = helpers.collection || depth0.collection;
  tmp1 = self.program(4, program4, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("			\n");
  return buffer;}
function program4(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n		");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "toggleDeleteFeatureCommentButtonAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(5, program5, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	");
  return buffer;}
function program5(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n			<table style=\"width:100%\">\n			<tr>\n				<td>\n					");
  stack1 = depth0;
  stack2 = "KG.AuthorView";
  stack3 = {};
  stack4 = "comment-author";
  stack3['class'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(6, program6, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n					");
  stack1 = {};
  stack2 = "comment-content";
  stack1['class'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(8, program8, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n					");
  stack1 = {};
  stack2 = "comment-date";
  stack1['class'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(10, program10, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n				</td>\n				<td style=\"text-align:right;vertical-align:middle\">\n					");
  stack1 = depth0;
  stack2 = "KG.DeleteFeatureCommentView";
  stack3 = {};
  stack4 = "comment-delete red-button";
  stack3['class'] = stack4;
  stack4 = "deleteFeatureCommentButtonAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(12, program12, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n				</td>\n			</tr>\n			</table>\n		");
  return buffer;}
function program6(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n						");
  stack1 = depth0;
  stack2 = "authorLabel";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "																			\n					");
  return buffer;}

function program8(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n						");
  stack1 = depth0;
  stack2 = "itemView.content.comment";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n					");
  return buffer;}

function program10(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n						");
  stack1 = depth0;
  stack2 = "itemView.content.formattedDate";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n					");
  return buffer;}

function program12(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n						");
  stack1 = depth0;
  stack2 = "label";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n					");
  return buffer;}

function program14(depth0,data) {
  
  var buffer = '', stack1, stack2;
  data.buffer.push("\n	<img ");
  stack1 = {};
  stack2 = "loadingImage";
  stack1['src'] = stack2;
  stack2 = helpers.bindAttr || depth0.bindAttr;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "bindAttr", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1) + " alt=\"Loading\"/>\n");
  return buffer;}

  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "span";
  stack3['tagName'] = stack4;
  stack4 = "KG.featureCommentsController.showButtonVisible";
  stack3['isVisibleBinding'] = stack4;
  stack4 = "showFeatureCommentsAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  stack1 = {};
  stack2 = "feature-comments-container";
  stack1['id'] = stack2;
  stack2 = "KG.featureCommentsController.showing";
  stack1['classBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(3, program3, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  stack1 = depth0;
  stack2 = "KG.CommentAreaView";
  stack3 = {};
  stack4 = "feature-new-comment-area";
  stack3['id'] = stack4;
  stack4 = "new-comment-area";
  stack3['class'] = stack4;
  stack4 = "KG.featureCommentsController.showing";
  stack3['isVisibleBinding'] = stack4;
  stack4 = "addFeatureCommentAction";
  stack3['nl_sc_action'] = stack4;
  stack4 = "KG.featureNewCommentController.content";
  stack3['valueBinding'] = stack4;
  stack4 = "_commentPlaceholder";
  stack3['placeholder_not_loc'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "view", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n");
  stack1 = depth0;
  stack2 = "KG.LoadingImageView";
  stack3 = {};
  stack4 = "feature-comment-loading";
  stack3['id'] = stack4;
  stack4 = "comment-loading";
  stack3['class'] = stack4;
  stack4 = "KG.featureCommentsController.isLoading";
  stack3['isVisibleBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(14, program14, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  return buffer;
})

Ember.TEMPLATES["bool-renderer"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


  data.buffer.push("<span class=\"inspector-attr-name\">\n	");
  stack1 = depth0;
  stack2 = "itemView.content.label";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n</span>	\n");
  stack1 = {};
  stack2 = "switch";
  stack1['templateName'] = stack2;
  stack2 = "inspector-attr-value";
  stack1['class'] = stack2;
  stack2 = "itemView.content.value";
  stack1['contentBinding'] = stack2;
  stack2 = "KG.inspectorController.isReadOnly";
  stack1['disabledBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "view", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1));
  return buffer;
})

Ember.TEMPLATES["catalog-renderer"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


  data.buffer.push("<span class=\"inspector-attr-name\">\n	");
  stack1 = depth0;
  stack2 = "itemView.content.label";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n</span>	\n<div class=\"inspector-attr-value\">\n	");
  stack1 = {};
  stack2 = "select";
  stack1['templateName'] = stack2;
  stack2 = "itemView.content.enumValues";
  stack1['contentBinding'] = stack2;
  stack2 = "itemView.content.value";
  stack1['valueBinding'] = stack2;
  stack2 = "KG.inspectorController.isReadOnly";
  stack1['disabledBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "view", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1) + "\n</div>");
  return buffer;
})

Ember.TEMPLATES["catalog-text-renderer"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


  data.buffer.push("<span class=\"inspector-attr-name\">\n	");
  stack1 = depth0;
  stack2 = "itemView.content.label";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n</span>	\n<div class=\"inspector-attr-value\">\n	");
  stack1 = {};
  stack2 = "select-input";
  stack1['templateName'] = stack2;
  stack2 = "itemView.content.enumValuesCustom";
  stack1['contentBinding'] = stack2;
  stack2 = "itemView.content.value";
  stack1['valueBinding'] = stack2;
  stack2 = "KG.inspectorController.isReadOnly";
  stack1['disabledBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "view", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1) + "\n</div>");
  return buffer;
})

Ember.TEMPLATES["img-renderer"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


  data.buffer.push("<span class=\"inspector-attr-name\">\n	");
  stack1 = depth0;
  stack2 = "itemView.content.label";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n</span>	\n\n<div class=\"inspector-attr-value\">\n	<img ");
  stack1 = {};
  stack2 = "itemView.content.imgBase64Value";
  stack1['src'] = stack2;
  stack2 = helpers.bindAttr || depth0.bindAttr;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "bindAttr", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1) + "/>\n</div>");
  return buffer;
})

Ember.TEMPLATES["label-renderer"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


  data.buffer.push("<span class=\"inspector-attr-name\">\n	");
  stack1 = depth0;
  stack2 = "itemView.content.label";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n</span>	\n\n<div class=\"inspector-attr-value\">\n	<span>\n		");
  stack1 = depth0;
  stack2 = "itemView.content.value";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n	</span>\n</div>");
  return buffer;
})

Ember.TEMPLATES["num-range-renderer"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("\n	");}

  data.buffer.push("<span class=\"inspector-attr-name\">\n	");
  stack1 = depth0;
  stack2 = "itemView.content.label";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n</span>	\n<div class=\"inspector-attr-value\">\n	");
  stack1 = depth0;
  stack2 = "KG.NumericTextField";
  stack3 = {};
  stack4 = "itemView.content.value";
  stack3['valueBinding'] = stack4;
  stack4 = "range";
  stack3['type'] = stack4;
  stack4 = "itemView.content.min";
  stack3['minBinding'] = stack4;
  stack4 = "itemView.content.max";
  stack3['maxBinding'] = stack4;
  stack4 = "itemView.content.step";
  stack3['stepBinding'] = stack4;
  stack4 = "KG.inspectorController.isReadOnly";
  stack3['disabledBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</div>");
  return buffer;
})

Ember.TEMPLATES["num-renderer"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("\n	");}

  data.buffer.push("<span class=\"inspector-attr-name\">\n	");
  stack1 = depth0;
  stack2 = "itemView.content.label";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n</span>	\n<div class=\"inspector-attr-value\">\n	");
  stack1 = depth0;
  stack2 = "KG.NumericTextField";
  stack3 = {};
  stack4 = "itemView.content.value";
  stack3['valueBinding'] = stack4;
  stack4 = "number";
  stack3['type'] = stack4;
  stack4 = "itemView.content.min";
  stack3['minBinding'] = stack4;
  stack4 = "itemView.content.max";
  stack3['maxBinding'] = stack4;
  stack4 = "itemView.content.step";
  stack3['stepBinding'] = stack4;
  stack4 = "KG.inspectorController.isReadOnly";
  stack3['disabledBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</div>");
  return buffer;
})

Ember.TEMPLATES["text-renderer"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("\n	");}

  data.buffer.push("<span class=\"inspector-attr-name\">\n	");
  stack1 = depth0;
  stack2 = "itemView.content.label";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n</span>	\n<div class=\"inspector-attr-value\">\n	");
  stack1 = depth0;
  stack2 = "KG.TextField";
  stack3 = {};
  stack4 = "itemView.content.value";
  stack3['valueBinding'] = stack4;
  stack4 = "false";
  stack3['spellcheck'] = stack4;
  stack4 = "off";
  stack3['autocorrect'] = stack4;
  stack4 = "off";
  stack3['autocapitalize'] = stack4;
  stack4 = "KG.inspectorController.isReadOnly";
  stack3['disabledBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</div>");
  return buffer;
})

KG.core_palette = Ember.Object.create({
    //palette view
    _view: null,
    _paletteMarker: null,

    createView: function() {
        if (!this._view) {
			var self = this;
            setTimeout(function() {
                self._view = Ember.View.create({
                    templateName: 'palette'
                });
                self._view.appendTo('#main-sandbox-view');
            },
            1000);
        }
    },

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
            iconPath: 'css/images/palette_marker.png',
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


Ember.TEMPLATES["palette"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var stack1, stack2, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2;
  data.buffer.push("	\n	");
  stack1 = {};
  stack2 = "palette-title";
  stack1['id'] = stack2;
  stack2 = "header";
  stack1['tagName'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(2, program2, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("	\n	<div id=\"palette-panel\">\n			");
  stack1 = {};
  stack2 = "KG.paletteController.content";
  stack1['contentBinding'] = stack2;
  stack2 = "palette-list";
  stack1['class'] = stack2;
  stack2 = helpers.collection || depth0.collection;
  tmp1 = self.program(7, program7, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	</div>\n");
  return buffer;}
function program2(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n		");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "ios-button ios-tb-left";
  stack3['class'] = stack4;
  stack4 = "KG.paletteController.isDirty";
  stack3['isVisibleBinding'] = stack4;
  stack4 = "cancelPaletteAction";
  stack3['sc_action'] = stack4;
  stack4 = "KG.paletteController.cancelTitle";
  stack3['titleBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(3, program3, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n		<h1 class=\"label-ellipsis\" ");
  stack1 = {};
  stack2 = "KG.paletteController.title";
  stack1['title'] = stack2;
  stack2 = helpers.bindAttr || depth0.bindAttr;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "bindAttr", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1) + ">");
  stack1 = depth0;
  stack2 = "_paletteTitle";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "</h1>\n		");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "ios-button ios-tb-right";
  stack3['class'] = stack4;
  stack4 = "closePaletteAction";
  stack3['sc_action'] = stack4;
  stack4 = "KG.paletteController.closeTitle";
  stack3['titleBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(5, program5, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	");
  return buffer;}
function program3(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "_cancel";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "\n		");
  return buffer;}

function program5(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "_close";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "\n		");
  return buffer;}

function program7(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n				");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "white-button";
  stack3['class'] = stack4;
  stack4 = "selectPaletteItemAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(8, program8, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n			");
  return buffer;}
function program8(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n					");
  stack1 = depth0;
  stack2 = "itemView.content.label";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n				");
  return buffer;}

  stack1 = {};
  stack2 = "super-palette";
  stack1['id'] = stack2;
  stack2 = "KG.paletteController.active";
  stack1['classBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
})

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

/**
* Toggle Button to expend/collapse.  
**/
KG.ExpandButtonView = SC.Button.extend({
	
	tagName: 'div',
	
	expanded: NO,
	
	logo: function(){
		if(this.get("expanded")){
			return 'css/images/down_arrow_32.png';
		}else{
			return 'css/images/up_arrow_32.png';
		}
	}.property('expanded'),
	
	mouseUp: function(e){
		this.set('expanded', !this.get('expanded'));
		return NO;
	}
});

Ember.TEMPLATES["info-item"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n		");
  stack1 = depth0;
  stack2 = "parentView.content.title";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n	");
  return buffer;}

function program3(depth0,data) {
  
  
  data.buffer.push("	\n		<img src=\"css/images/right_arrow_32.png\"/>		\n	");}

  data.buffer.push("<div class=\"info-item-row\">\n	");
  stack1 = {};
  stack2 = "label-ellipsis";
  stack1['class'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("			\n	");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "yes";
  stack3['manualMouseDown'] = stack4;
  stack4 = "selectFeatureInspectorAction";
  stack3['sc_action'] = stack4;
  stack4 = "content";
  stack3['contentBinding'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(3, program3, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</div>");
  return buffer;
})

Ember.TEMPLATES["info-popup"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2;
  data.buffer.push("	\n	<img ");
  stack1 = {};
  stack2 = "logo";
  stack1['src'] = stack2;
  stack2 = helpers.bindAttr || depth0.bindAttr;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "bindAttr", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1) + "/>		\n");
  return buffer;}

  stack1 = {};
  stack2 = "KG.infoController.allButFirst";
  stack1['contentBinding'] = stack2;
  stack2 = "KG.infoController.listVisible";
  stack1['isVisibleBinding'] = stack2;
  stack2 = "popup-info-list";
  stack1['class'] = stack2;
  stack2 = "KG.FeatureInfoPopupItemView";
  stack1['itemViewClass'] = stack2;
  stack2 = helpers.collection || depth0.collection;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "collection", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1) + "	\n");
  stack1 = depth0;
  stack2 = "KG.FeatureInfoPopupItemView";
  stack3 = {};
  stack4 = "KG.infoController.firstFeature";
  stack3['contentBinding'] = stack4;
  stack4 = "master-row";
  stack3['class'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "view", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n");
  stack1 = depth0;
  stack2 = "KG.ExpandButtonView";
  stack3 = {};
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "popup-info-expand-button";
  stack3['class'] = stack4;
  stack4 = "KG.infoController.multipleFeatures";
  stack3['isVisibleBinding'] = stack4;
  stack4 = "KG.infoController.listVisible";
  stack3['expandedBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  return buffer;
})

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
            iconPath: 'css/images/new_marker.png',
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
                    iconPath: 'css/images/new_marker.png',
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
                    iconPath = 'css/images/group_marker.png';
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


/**
* List of note markers.
**/
KG.noteMarkersController = Ember.ArrayController.create({
	content: null
});

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


/**
* List of note Comments for the active note.
**/
KG.noteCommentsController = KG.CommentsController.create({
	
	commentsBinding: 'KG.activeNoteController.comments'
});

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

Ember.TEMPLATES["active-note-popup"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var stack1, stack2, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("	\n	");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "yes";
  stack3['manualMouseDown'] = stack4;
  stack4 = "note-zoom-button";
  stack3['class'] = stack4;
  stack4 = "KG.activeNoteController.isOldRecord";
  stack3['isVisibleBinding'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "zoomNoteAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(2, program2, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("	\n	");
  stack1 = {};
  stack2 = "note-date-label";
  stack1['class'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(4, program4, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("			\n	<span>");
  stack1 = depth0;
  stack2 = "KG.activeNoteController.titleLabel";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "</span>\n	");
  stack1 = depth0;
  stack2 = "KG.TextField";
  stack3 = {};
  stack4 = "KG.activeNoteController.titleValue";
  stack3['valueBinding'] = stack4;
  stack4 = "KG.activeNoteController.isDisabled";
  stack3['disabledBinding'] = stack4;
  stack4 = "text";
  stack3['type'] = stack4;
  stack4 = "_noteTitlePlaceholder";
  stack3['placeholder_not_loc'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(6, program6, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	<span>");
  stack1 = depth0;
  stack2 = "KG.activeNoteController.descriptionLabel";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "</span>\n	");
  stack1 = depth0;
  stack2 = "KG.TextArea";
  stack3 = {};
  stack4 = "note-description-area";
  stack3['id'] = stack4;
  stack4 = "KG.activeNoteController.isDisabled";
  stack3['disabledBinding'] = stack4;
  stack4 = "KG.activeNoteController*content.description";
  stack3['valueBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(8, program8, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	");
  stack1 = {};
  stack2 = "active-note-popup-bottom";
  stack1['class'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(10, program10, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	");
  stack1 = {};
  stack2 = "note-comments";
  stack1['templateName'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "view", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1) + "\n");
  return buffer;}
function program2(depth0,data) {
  
  
  data.buffer.push("\n		<a href=\"javascript:void(0)\">zoom</a>\n	");}

function program4(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n		");
  stack1 = depth0;
  stack2 = "KG.activeNoteController.content.formattedDate";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n	");
  return buffer;}

function program6(depth0,data) {
  
  
  data.buffer.push("\n	");}

function program8(depth0,data) {
  
  
  data.buffer.push("\n	");}

function program10(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n		");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "yes";
  stack3['manualMouseDown'] = stack4;
  stack4 = "KG.activeNoteController.isUpdateVisible";
  stack3['isVisibleBinding'] = stack4;
  stack4 = "white-button";
  stack3['class'] = stack4;
  stack4 = "confirmNoteAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(11, program11, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("		\n		");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "yes";
  stack3['manualMouseDown'] = stack4;
  stack4 = "KG.activeNoteController.isDeleteVisible";
  stack3['isVisibleBinding'] = stack4;
  stack4 = "red-button";
  stack3['class'] = stack4;
  stack4 = "deleteNoteAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(13, program13, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n		");
  stack1 = {};
  stack2 = "note-author-label";
  stack1['class'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(15, program15, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	");
  return buffer;}
function program11(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "KG.activeNoteController.confirmLabel";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n		");
  return buffer;}

function program13(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "KG.activeNoteController.deleteLabel";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n		");
  return buffer;}

function program15(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "KG.activeNoteController.content.authorFormatted";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n		");
  return buffer;}

  stack1 = {};
  stack2 = "active-note-popup";
  stack1['class'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
})

Ember.TEMPLATES["note-comments"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n	<a href=\"javascript:void(0)\">\n		");
  stack1 = depth0;
  stack2 = "KG.noteCommentsController.commentsLabel";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n		</a>\n");
  return buffer;}

function program3(depth0,data) {
  
  var buffer = '', stack1, stack2;
  data.buffer.push("\n	");
  stack1 = {};
  stack2 = "KG.noteCommentsController.content";
  stack1['contentBinding'] = stack2;
  stack2 = "comment-list";
  stack1['class'] = stack2;
  stack2 = helpers.collection || depth0.collection;
  tmp1 = self.program(4, program4, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("			\n");
  return buffer;}
function program4(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n		");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "yes";
  stack3['manualMouseDown'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "toggleDeleteNoteCommentButtonAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(5, program5, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	");
  return buffer;}
function program5(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n			<table style=\"width:100%\">\n			<tr>\n				<td>\n					");
  stack1 = depth0;
  stack2 = "KG.AuthorView";
  stack3 = {};
  stack4 = "comment-author";
  stack3['class'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(6, program6, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n					");
  stack1 = {};
  stack2 = "comment-content";
  stack1['class'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(8, program8, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n					");
  stack1 = {};
  stack2 = "comment-date";
  stack1['class'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(10, program10, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n				</td>\n				<td style=\"text-align:right;vertical-align:middle\">\n					");
  stack1 = depth0;
  stack2 = "KG.DeleteNoteCommentView";
  stack3 = {};
  stack4 = "yes";
  stack3['manualMouseDown'] = stack4;
  stack4 = "comment-delete red-button";
  stack3['class'] = stack4;
  stack4 = "deleteNoteCommentButtonAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(12, program12, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n				</td>\n			</tr>\n			</table>\n		");
  return buffer;}
function program6(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n						");
  stack1 = depth0;
  stack2 = "authorLabel";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "																			\n					");
  return buffer;}

function program8(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n						");
  stack1 = depth0;
  stack2 = "itemView.content.comment";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n					");
  return buffer;}

function program10(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n						");
  stack1 = depth0;
  stack2 = "itemView.content.formattedDate";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n					");
  return buffer;}

function program12(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n						");
  stack1 = depth0;
  stack2 = "label";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n					");
  return buffer;}

function program14(depth0,data) {
  
  var buffer = '', stack1, stack2;
  data.buffer.push("\n	<img ");
  stack1 = {};
  stack2 = "loadingImage";
  stack1['src'] = stack2;
  stack2 = helpers.bindAttr || depth0.bindAttr;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "bindAttr", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1) + " alt=\"Loading\"/>\n");
  return buffer;}

  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "yes";
  stack3['manualMouseDown'] = stack4;
  stack4 = "span";
  stack3['tagName'] = stack4;
  stack4 = "KG.noteCommentsController.showButtonVisible";
  stack3['isVisibleBinding'] = stack4;
  stack4 = "showNoteCommentsAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  stack1 = {};
  stack2 = "note-comments-container";
  stack1['id'] = stack2;
  stack2 = "KG.noteCommentsController.showing";
  stack1['classBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(3, program3, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  stack1 = depth0;
  stack2 = "KG.CommentAreaView";
  stack3 = {};
  stack4 = "note-new-comment-area";
  stack3['id'] = stack4;
  stack4 = "new-comment-area";
  stack3['class'] = stack4;
  stack4 = "KG.noteCommentsController.showing";
  stack3['isVisibleBinding'] = stack4;
  stack4 = "KG.noteNewCommentController.content";
  stack3['valueBinding'] = stack4;
  stack4 = "_commentPlaceholder";
  stack3['placeholder_not_loc'] = stack4;
  stack4 = "addNoteCommentAction";
  stack3['nl_sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "view", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n");
  stack1 = depth0;
  stack2 = "KG.LoadingImageView";
  stack3 = {};
  stack4 = "note-comment-loading";
  stack3['id'] = stack4;
  stack4 = "comment-loading";
  stack3['class'] = stack4;
  stack4 = "KG.noteCommentsController.isLoading";
  stack3['isVisibleBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(14, program14, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  return buffer;
})

Ember.TEMPLATES["multiple-notes-popup"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n	");
  stack1 = depth0;
  stack2 = "KG.notesPopupController.popupTitle";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n");
  return buffer;}

function program3(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("			\n	");
  stack1 = depth0;
  stack2 = "KG.NotePopupItemView";
  stack3 = {};
  stack4 = "multiple-notes-item common-list-button";
  stack3['class'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(4, program4, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;}
function program4(depth0,data) {
  
  var buffer = '', stack1, stack2;
  data.buffer.push("\n		<table class=\"multiple-notes-table\">\n		<td>\n		");
  stack1 = {};
  stack2 = "multiple-notes-item-title";
  stack1['class'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(5, program5, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n		</td>\n		<td>\n		");
  stack1 = {};
  stack2 = "note-author-label";
  stack1['class'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(7, program7, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n		</td>\n		</table>\n	");
  return buffer;}
function program5(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "itemView.content.title";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n		");
  return buffer;}

function program7(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "itemView.content.authorFormatted";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n		");
  return buffer;}

  stack1 = {};
  stack2 = "multiple-notes-title";
  stack1['class'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  stack1 = {};
  stack2 = "KG.notesPopupController";
  stack1['contentBinding'] = stack2;
  stack2 = "ul";
  stack1['tagName'] = stack2;
  stack2 = "multiple-notes-list no-style-list";
  stack1['class'] = stack2;
  stack2 = helpers.collection || depth0.collection;
  tmp1 = self.program(3, program3, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  return buffer;
})

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


/**
* List of WMS layers
**/
KG.layersController = Ember.ArrayController.create({
	content: null
});

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

KG.TextNotificationAreaView = KG.TextArea.extend({

    insertNewline: function(event) {
        if (KG.sendNotificationController.get('sendOnEnterValue')) {
            KG.statechart.sendAction('sendNotificationAction');
        }
    },
});


Ember.TEMPLATES["notification-panel"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2;
  data.buffer.push("\n		");
  stack1 = {};
  stack2 = "capsule-label";
  stack1['class'] = stack2;
  stack2 = "KG.notificationsController.hasNotification";
  stack1['isVisibleBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(2, program2, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n		<span class=\"button-image\"><span>\n		");
  stack1 = {};
  stack2 = "super-notification-popup";
  stack1['id'] = stack2;
  stack2 = "KG.notificationsController.activePopup";
  stack1['isVisibleBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(4, program4, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;}
function program2(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "parentView.notificationCount";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n		");
  return buffer;}

function program4(depth0,data) {
  
  var buffer = '', stack1, stack2;
  data.buffer.push("\n						");
  stack1 = {};
  stack2 = "notification-popup";
  stack1['id'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(5, program5, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n		");
  return buffer;}
function program5(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n							");
  stack1 = {};
  stack2 = "notification-label";
  stack1['id'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(6, program6, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n							<div>\n							");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "notification-send-button";
  stack3['id'] = stack4;
  stack4 = "span";
  stack3['tagName'] = stack4;
  stack4 = "white-button unselectable";
  stack3['class'] = stack4;
  stack4 = "KG.notificationsController.hasNotification";
  stack3['classBinding'] = stack4;
  stack4 = "sendTextNotificationAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(8, program8, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n							");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "notification-clear-button";
  stack3['id'] = stack4;
  stack4 = "span";
  stack3['tagName'] = stack4;
  stack4 = "red-button unselectable";
  stack3['class'] = stack4;
  stack4 = "KG.notificationsController.hasNotification";
  stack3['isVisibleBinding'] = stack4;
  stack4 = "clearNotificationAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(10, program10, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("						\n							</div>\n							");
  stack1 = {};
  stack2 = "notification-collection";
  stack1['id'] = stack2;
  stack2 = "KG.notificationsController.content";
  stack1['contentBinding'] = stack2;
  stack2 = helpers.collection || depth0.collection;
  tmp1 = self.program(12, program12, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n						");
  return buffer;}
function program6(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n								");
  stack1 = depth0;
  stack2 = "_notificationTitle";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "\n							");
  return buffer;}

function program8(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n								");
  stack1 = depth0;
  stack2 = "_notificationSendText";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "\n							");
  return buffer;}

function program10(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n								");
  stack1 = depth0;
  stack2 = "_notificationClear";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "\n							");
  return buffer;}

function program12(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("					\n								");
  stack1 = depth0;
  stack2 = "KG.NotificationView";
  stack3 = {};
  stack4 = "notification-item";
  stack3['class'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(13, program13, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n								");
  return buffer;}
function program13(depth0,data) {
  
  var buffer = '', stack1, stack2;
  data.buffer.push("\n									");
  stack1 = {};
  stack2 = "notification-item-title";
  stack1['class'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(14, program14, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n									");
  stack1 = {};
  stack2 = "notification-item-message";
  stack1['class'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(16, program16, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n								");
  return buffer;}
function program14(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n										<a ");
  stack1 = {};
  stack2 = "parentView.authorMailTo";
  stack1['href'] = stack2;
  stack2 = helpers.bindAttr || depth0.bindAttr;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "bindAttr", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1) + "> ");
  stack1 = depth0;
  stack2 = "parentView.authorValue";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "</a>");
  stack1 = depth0;
  stack2 = "parentView.titleValue";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1));
  stack1 = depth0;
  stack2 = "parentView.dateValue";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n									");
  return buffer;}

function program16(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n										<!-- triple brakets to unescape HTML -->\n										");
  stack1 = depth0;
  stack2 = "parentView.messageValue";
  stack3 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack3; }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n									");
  return buffer;}

  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "notification-button";
  stack3['id'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "toggleNotificationPopupAction";
  stack3['sc_action'] = stack4;
  stack4 = "header-button header-button-icon";
  stack3['class'] = stack4;
  stack4 = "KG.notificationsController.activePopup";
  stack3['classBinding'] = stack4;
  stack4 = "KG.notificationsController.length";
  stack3['notificationCountBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("			\n");
  return buffer;
})

KG.core_bookmark = SC.Object.create({

    loadBookmarks: function() {
        var bm = KG.store.find(KG.BOOKMARK_QUERY);
        KG.bookmarksController.set('content', bm);
        bm.onReady(this, this._bmReady);
    },

    refreshBookmarks: function() {
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

    deleteSelectedBookmarks: function() {
        var list = KG.bookmarksController.get('deleteList');
        if (list && list.get('length') > 0) {
            var keys = [];
            list.forEach(function(bookmark) {
                var storeKey = bookmark.get('storeKey');
                keys.push(storeKey);
                bookmark.destroy();
            });
            KG.store.commitRecords(null, null, keys);
        }
    },

    addBookmark: function(label, centerLonLat, zoom) {
        var c = {
            x: centerLonLat.get('lon'),
            y: centerLonLat.get('lat')
        };
        var newBm = KG.store.createRecord(KG.Bookmark, {
            label: label,
            center: c,
            zoom: zoom
        });
        //commit only this record
        KG.store.commitRecords(null, null, [newBm.get('storeKey')]);
    }
});


/**
* List of KG.Bookmark
**/
KG.bookmarksController = Ember.ArrayController.create({
	content: [],
	activePopup: NO,
	editMode: NO,
	deleteList: []		
});

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

KG.BookmarkButtonView = KG.Button.extend({
	bmPath: 'css/images/bookmark.png',
	bmActivePath:  'css/images/bookmark.png',
	
	activatedBinding: "KG.bookmarksController.activePopup",
	
	bookmarkImg: function(){
		if(this.get('activated')){
			return this.get('bmActivePath');
		}else{
			return this.get('bmPath');
		}
	}.property('activated')
});


KG.EditBookmarkButtonView = KG.Button.extend({
	
	postAction: function(){
		this.set('isActive', KG.bookmarksController.get('editMode'));
	},
	
	editModeDidChange: function(){
		this.postAction();
	}.observes('KG.bookmarksController.editMode')
});

KG.BookmarkItemView = KG.Button.extend({
	classNames: ['bookmark-item','common-list-button'],
	tagName:"div"
});

KG.BookmarkDeleteButtonView = KG.Button.extend({
	
	classNameBindings:['isAvailable:is-visible'],
	
	isAvailable: function(){
		var content = this.getPath('itemView.content');
		if(content && KG.bookmarksController.get('editMode')){
			var auth = content.get('user_create');
	        if (!auth || auth === KG.core_auth.get('activeUser').id || KG.core_sandbox.get('isSandboxOwner')) {
	            return YES;
	        }
		}
		return NO;
	}.property('itemView.content', 'KG.bookmarksController.editMode'),
	
	
	isChecked: NO,
	
	
	deleteListDidChange: function(){
		var content = this.getPath('itemView.content');
		if(KG.bookmarksController.get('deleteList').indexOf(content) > -1){
			this.set('isChecked', YES);
		}else{
			this.set('isChecked', NO);
		}		
	}.observes('itemView.content', 'KG.bookmarksController.deleteList.length')
});

Ember.TEMPLATES["bookmark-panel"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2;
  data.buffer.push("\n		<span class=\"button-image\"><span>	\n		");
  stack1 = {};
  stack2 = "super-bookmark-popup";
  stack1['id'] = stack2;
  stack2 = "KG.bookmarksController.activePopup";
  stack1['isVisibleBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(2, program2, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;}
function program2(depth0,data) {
  
  var buffer = '', stack1, stack2;
  data.buffer.push("\n					");
  stack1 = {};
  stack2 = "bookmark-popup";
  stack1['id'] = stack2;
  stack2 = "KG.bookmarksController.activePopup";
  stack1['isVisibleBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(3, program3, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n		");
  return buffer;}
function program3(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("						\n						<div id=\"bookmark-top-bar\">\n							");
  stack1 = depth0;
  stack2 = "_bookmarkTitle";
  stack3 = {};
  stack4 = "bookmark-label";
  stack3['id'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n							");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "bookmark-add-button";
  stack3['id'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "white-button unselectable";
  stack3['class'] = stack4;
  stack4 = "addBookmarkAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(4, program4, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n							");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "bookmark-delete-button";
  stack3['id'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "red-button unselectable";
  stack3['class'] = stack4;
  stack4 = "deleteBookmarkAction";
  stack3['sc_action'] = stack4;
  stack4 = "KG.bookmarksController.editMode";
  stack3['classBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(6, program6, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n							");
  stack1 = depth0;
  stack2 = "KG.EditBookmarkButtonView";
  stack3 = {};
  stack4 = "bookmark-edit-button";
  stack3['id'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "white-button unselectable";
  stack3['class'] = stack4;
  stack4 = "editBookmarkAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(8, program8, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("											\n						</div>\n						<div id=\"bookmark-collection\">\n						");
  stack1 = {};
  stack2 = "bookmark-list";
  stack1['id'] = stack2;
  stack2 = "KG.bookmarksController.content";
  stack1['contentBinding'] = stack2;
  stack2 = "KG.BookmarkItemView";
  stack1['itemViewClass'] = stack2;
  stack2 = "KG.bookmarksController.editMode";
  stack1['classBinding'] = stack2;
  stack2 = helpers.collection || depth0.collection;
  tmp1 = self.program(10, program10, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n						</div>\n					");
  return buffer;}
function program4(depth0,data) {
  
  
  data.buffer.push("\n								<div></div>\n							");}

function program6(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n								");
  stack1 = depth0;
  stack2 = "_delete";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "\n							");
  return buffer;}

function program8(depth0,data) {
  
  
  data.buffer.push("\n								<div></div>\n							");}

function program10(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("	\n								");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "bookmark-item-label";
  stack3['class'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "selectBookmarkAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(11, program11, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("								\n								");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "bookmark-item-author";
  stack3['class'] = stack4;
  stack4 = "span";
  stack3['tagName'] = stack4;
  stack4 = "selectBookmarkAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(13, program13, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n								");
  stack1 = depth0;
  stack2 = "KG.BookmarkDeleteButtonView";
  stack3 = {};
  stack4 = "bookmark-delete check-delete-button unselectable";
  stack3['class'] = stack4;
  stack4 = "isChecked";
  stack3['classBinding'] = stack4;
  stack4 = "checkBookmarkAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(15, program15, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n						");
  return buffer;}
function program11(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n									");
  stack1 = depth0;
  stack2 = "itemView.content.label";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n								");
  return buffer;}

function program13(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n									");
  stack1 = depth0;
  stack2 = "itemView.content.formattedDescription";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n								");
  return buffer;}

function program15(depth0,data) {
  
  
  data.buffer.push("\n									<span>✓</span>\n								");}

  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "bookmark-button";
  stack3['id'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "toggleBookmarkPopupAction";
  stack3['sc_action'] = stack4;
  stack4 = "header-button header-button-icon";
  stack3['class'] = stack4;
  stack4 = "KG.bookmarksController.activePopup";
  stack3['classBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
})

Ember.TEMPLATES["add-bookmark"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n		");
  stack1 = depth0;
  stack2 = "KG.addBookmarkController.addLabel";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n	");
  return buffer;}

  data.buffer.push("<div id=\"add-bookmark-panel\">\n	");
  stack1 = depth0;
  stack2 = "KG.addBookmarkController.addBookmarkLabel";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n	");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "x-button bookmark-close-button";
  stack3['class'] = stack4;
  stack4 = "closeAddBookmarkAction";
  stack3['sc_action'] = stack4;
  stack4 = "KG.addBookmarkController.closeTitle";
  stack3['titleBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "view", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n	");
  stack1 = depth0;
  stack2 = "KG.TextField";
  stack3 = {};
  stack4 = "KG.addBookmarkController.content";
  stack3['valueBinding'] = stack4;
  stack4 = "addBookmarkAction";
  stack3['nl_sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "view", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n	");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "white-button add-bookmark-button";
  stack3['class'] = stack4;
  stack4 = "addBookmarkAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("		\n</div>");
  return buffer;
})

