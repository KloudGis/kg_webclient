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

            runningState: SC.State.extend({

                substatesAreConcurrent: YES,

                enterState: function() {
                    KG.core_layer.loadLayers();
                },

                /**Concurrent state for INSPECTOR*/
                inspectorState: SC.State.extend({
                    initialSubstate: 'inspectorHiddenState',

                    inspectorHiddenState: SC.State.extend({

                        selectFeatureInspectorAction: function(feature) {
                            if (feature) {
                                KG.core_inspector.selectFeature(feature);
                                this.gotoState('inspectorVisibleState');
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
                            if (feature) {
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

                        noteSelectedAction: function(note, marker) {
                            KG.core_note.activateNote(note, marker);
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
						
                        enterState: function() {
                            KG.core_search.showResults();
                        },

                        exitState: function() {
                            KG.core_search.hideResults();
							KG.core_highlight.clearHighlight(this._highlight);
							this._highlight = null;
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

						featureZoomAction: function(feature){
							KG.core_highlight.clearHighlight(this._highlight);
							this._highlight = KG.core_highlight.highlightFeature(feature);
							KG.core_leaflet.setCenter(feature.get('center'));
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
                            KG.core_leaflet.closeActivePopup();
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
							
							enterState: function(){
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

                            noteSelectedAction: function(note, marker) {
                                KG.core_note.activateNote(note, marker);
                                this.gotoState('editNoteState');
                            }
                        }),

                        editNoteState: SC.State.extend({

                            enterState: function() {
                                console.log('enter editNoteState');
                                KG.core_note.beginModifications();
                            },

                            exitState: function() {
                                console.log('exit editNoteState');
                                KG.core_note.rollbackModifications();
                                KG.activeNoteController.set('content', null);
                            },

                            showCommentsAction: function() {
                                //show comment section
                            },

                            hideCommentsAction: function() {
                                //hide comment section
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
