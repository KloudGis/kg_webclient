SC.mixin(KG, {
    //sandbox page state chart
    statechart: SC.Statechart.create({
        //log trace
        trace: NO,

        rootState: SC.State.extend({

            initialSubstate: 'tryAuthenticateState',

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

            mapLoginSucceeded: function() {
                KG.core_layer.loadLayers();
            },

            runningState: SC.State.extend({

                substatesAreConcurrent: YES,

                /**Concurrent state for INSPECTOR*/
                inspectorState: SC.State.extend({
                    initialSubstate: 'inspectorHiddenState',

                    inspectorHiddenState: SC.State.extend({

                        selectFeatureInspectorAction: function(feature) {
                            if (feature && feature.get('isSelectable') && feature.get('isInspectorSelectable')) {
                                this.gotoState('inspectorVisibleState');
                                KG.core_inspector.selectFeature(feature);
                            }
                        }
                    }),

                    inspectorVisibleState: SC.State.extend({

                        enterState: function() {
                            var panel = $('#left-side-panel');
                            panel.addClass('active');
                        },

                        exitState: function() {
                            var panel = $('#left-side-panel');
                            panel.removeClass('active');
                            KG.core_inspector.cleanSelectFeature();
                        },

                        selectFeatureInspectorAction: function(feature) {
                            if (feature && feature.get('isSelectable') && feature.get('isInspectorSelectable')) {
                                KG.core_inspector.selectFeature(feature);
                            }
                        },

                        closeInspectorAction: function() {
                            this.gotoState('inspectorHiddenState');
                        }
                    })
                }),

                /**Concurrent state for Map Interaction*/
                mapInteractionState: SC.State.extend({

                    initialSubstate: 'navigationState',

                    mapMovedAction: function() {
                        KG.core_note.refreshMarkers();
                    },

                    mapZoomedAction: function() {
                        KG.core_note.refreshMarkers();
                    },

                    searchAction: function() {
                        KG.core_search.searchFeatures();
                    },

                    selectSearchCategoryAction: function(cat) {
                        KG.searchResultsController.set('category', cat);
                        this.gotoState('searchResultsState');
                    },

                    clickMarkerAction: function(marker) {
                        this.gotoState('navigationState');
                        KG.core_note.continueMarkerClicked(marker);
                    },

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
                                KG.core_note.activateNote(feature, marker);
                                this.gotoState('editNoteState');
                            }
                        }
                    }),

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

                    popupNoteState: SC.State.extend({

                        initialSubstate: 'locateNoteState',

                        exitState: function() {
                            KG.core_leaflet.closePopup();
                        },

                        mapMovedAction: function() {
                            //override map interaction action
                        },

                        mapZoomedAction: function() {
                            //override map interaction action
                        },

                        hideMarkerPopupAction: function() {
                            this.gotoState('navigationState');
                        },

                        locateNoteState: SC.State.extend({

                            enterState: function() {
                                KG.core_note.locateNote();
                                KG.core_note.set('createNoteLabel', "_cancelCreateNote".loc());
                                KG.core_note.set('createNoteImg', KG.get('cancelCreateNoteImagePath'));
                            },

                            exitState: function() {
                                KG.core_note.set('createNoteLabel', "_createNote".loc());
                                KG.core_note.set('createNoteImg', KG.get('createNoteImagePath'));
                            },

                            hideMarkerPopupAction: function() {},

                            notePositionSetAction: function() {
                                this.gotoState('createNoteState');
                            },

                            createNoteAction: function() {
                                //cancel
                                KG.core_note.cancelLocateNote();
                                this.gotoState('navigationState');
                            }
                        }),

                        createNoteState: SC.State.extend({

                            enterState: function() {
                                KG.core_note.createNote();
                            },

                            exitState: function() {
                                console.log('exit createNoteState');
                                KG.core_note.rollbackModifications();
                                KG.activeNoteController.set('content', null);
                                KG.core_note.clearCreateNote();
                            },

                            confirmNoteAction: function() {
                                var note = KG.activeNoteController.get('content');
                                KG.core_note.commitModifications();
                                KG.core_note.confirmCreateNote();
                                this.gotoState('navigationState');
                            },

                            deleteNoteAction: function() {
                                this.gotoState('navigationState');
                            },
                        }),

                        multipleNotesState: SC.State.extend({

                            exitState: function() {
                                KG.notesPopupController.set('marker', null);
                                KG.notesPopupController.set('content', []);
                            },

                            noteSelectedAction: function(note, params) {
                                KG.core_note.activateNote(note, params);
                                this.gotoState('editNoteState');
                            }
                        }),

                        editNoteState: SC.State.extend({

                            enterState: function() {
                                console.log('enter editNoteState');
                                KG.core_note.beginModifications();
                                KG.newCommentController.set('content', '');
                                KG.activeCommentsController.set('showComments', YES);
                                KG.activeCommentsController.set('showing', NO);
                                KG.core_leaflet.disableMouseWheelHandler();
                                setTimeout(function() {
                                    $("#note-description-area").autoResize({
                                        extraSpace: 20
                                    });
                                },
                                100);
                            },

                            exitState: function() {
                                console.log('exit editNoteState');
                                KG.core_note.postEdition();
                                KG.activeNoteController.set('content', null);
                                KG.activeCommentsController.set('content', null);
                                KG.activeCommentsController.set('showComments', NO);
                                KG.activeCommentsController.set('showing', NO);
                                KG.core_leaflet.enableMouseWheelHandler();
                            },

                            showCommentsAction: function() {
                                //show comment section
                                if (KG.activeCommentsController.get('length') === 0) {
                                    KG.core_note.fetchComments();
                                }
                                KG.activeCommentsController.set('showing', YES);
                                setTimeout(function() {
                                    $("#note-new-comment-area").autoResize({
                                        extraSpace: 20
                                    });
                                },
                                1);
                            },

                            hideCommentsAction: function() {
                                //hide comment section
                                KG.activeCommentsController.set('showing', NO);
                            },

                            addCommentAction: function() {
                                var comment = KG.newCommentController.get('content');
                                KG.core_note.addCommentToActiveNote(comment);
                            },

                            commentsReadyEvent: function() {
                                setTimeout(function() {
                                    console.log('scroll to bottom');
                                    var container = $('.note-comments-container');
                                    if (container[0]) {
                                        container.scrollTop(container[0].scrollHeight);
                                    }
                                },
                                1);
                            },

                            confirmNoteAction: function() {
                                var note = KG.activeNoteController.get('content');
                                console.log('status is' + note.get('status'));
                                KG.core_note.commitModifications();
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
                            }
                        }),
                    })
                })
            })
        })
    })
});
