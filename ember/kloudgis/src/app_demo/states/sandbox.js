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
