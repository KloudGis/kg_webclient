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
                    this.gotoState('loggedOutState');
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
                    this.gotoState('loggedInState');
                },

                membershipFailed: function() {
                    window.location.href = "home.html?message=_wrong-membership";
                }
            }),

            loggedOutState: SC.State.extend({

                enterState: function() {
                    window.location.href = "index.html";
                }
            }),

            loggedInState: SC.State.extend({

                initialSubstate: 'navigationState',

                enterState: function() {
                    console.log('hi!');
                    KG.core_layer.loadLayers();
                },

				closeInspectorAction: function(){
					KG.core_inspector.cleanSelectFeature();
				},

                navigationState: SC.State.extend({

					_ignoreMouseClicked: YES,
					
                    enterState: function() {
                        console.log('navigation!');
                        KG.core_note.refreshMarkers();
						var self = this;
						setTimeout(function(){self._ignoreMouseClicked = NO},100);
                    },

					exitState: function(){
						this._ignoreMouseClicked = YES;
					},

                    createNoteAction: function() {
                        this.gotoState('createNoteState');
                    },

                    noteSelectedAction: function(note, marker) {
                        if (KG.core_note.activateNote(note, marker)) {
                            var self = this;
							//delay for pending statechart action to happen in THIS state, not in "editNoteState"
                            setTimeout(function() {
								SC.run.begin();
								if(self.get('statechart').get('currentStates')[0] === self){
                                	self.gotoState('editNoteState');
								}
								SC.run.end();
                            },
                            100);
                        }
                    },

					mouseClickedOnMap: function(lonlat){
						if(!this._ignoreMouseClicked){
							KG.core_sandbox.set('mousePosition', lonlat);
							KG.core_info.findFeaturesAt(lonlat);
						}
					},
					
					featureInfoReady: function(){
						this.gotoState("infoPopupState");
					}
                }),

                mapZoomed: function(sender) {
                    KG.core_note.refreshMarkers();
                },

                mapMoved: function(sender) {
                    KG.core_note.refreshMarkers();
                },

				//feature info popup
				infoPopupState: SC.State.extend({
					
					enterState: function(){
						console.log('enter info popup!');
						KG.core_info.showInfoPopup();
					},
					
					exitState: function(){
						console.log('exit info popup!');
						KG.core_info.hideInfoPopup();
					},
					
					infoPopupClosed: function() {
						console.log('info popup closed.');
						this.gotoState('navigationState');						
					},
					
					selectFeatureAction: function(feature){
						KG.core_inspector.selectFeature(feature);
						this.gotoState('navigationState');
					},
					
					featureInfoMouseUpAction:function(feature){
						KG.core_highlight.clearHighlightFeature();
						KG.core_highlight.highlightFeature(feature);
					},
					
					featureInfoMouseEnterAction:function(feature){
						KG.core_highlight.clearHighlightFeature();
						KG.core_highlight.highlightFeature(feature);
					},
					
					featureInfoMouseLeaveAction:function(feature){
						KG.core_highlight.clearHighlightFeature();
					}				
				}),

				//edit note popup
                editNoteState: SC.State.extend({

                    notePopupClosed: function() {
                        KG.core_note.revertUpdateNote();
                        this.gotoState('navigationState');
                    },

                    confirmNoteAction: function() {
                        KG.core_note.confirmUpdateNote();
                        this.gotoState('navigationState');
                    },

                    deleteNoteAction: function() {
                        KG.core_note.deleteActiveNote();
                        this.gotoState('navigationState');
                    },

                    mapZoomed: function(sender) {},

                    mapMoved: function(sender) {},

					zoomNoteAction: function(){
						KG.core_note.zoom();
					}
                }),

				//create note popup
                createNoteState: SC.State.extend({

                    initialSubstate: 'locateNoteState',

                    enterState: function() {
                        console.log('creating a note!');
                    },

                    locateNoteState: SC.State.extend({

                        enterState: function() {
                            console.log('Lets locate it first');
                            KG.core_note.locateNote();
                        },

                        notePositionSet: function() {
                            this.gotoState('confirmNoteState');
                        },

                        notePopupClosed: function() {}

                    }),

                    confirmNoteState: SC.State.extend({

                        enterState: function() {
                            console.log('Confirm it now.');
                            if (!KG.core_note.createNote()) {
                                this.gotoState('createNoteState');
                            }
                        },

                        mapZoomed: function(sender) {},

                        mapMoved: function(sender) {},

                        notePopupClosed: function() {
                            KG.core_note.revertCreateNote();
                            this.gotoState('navigationState');
                        },

                        confirmNoteAction: function() {
                            KG.core_note.confirmCreateNote();
                            this.gotoState('navigationState');
                        },

						zoomNoteAction: function(){
							KG.core_note.zoom();
						}
                    })
                })
            })
        })
    })
});
