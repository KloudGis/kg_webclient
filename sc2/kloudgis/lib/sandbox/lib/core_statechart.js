SC.mixin(KG, {
    //global state chart
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

            tryMembershipState: SC.State.extend({
                enterState: function() {
                    console.log("test membership");
                    //show the map to not slow down the app
                    KG.core_sandbox.addMap();
                    KG.core_sandbox.membershipCheck();
                    KG.core_sandbox.fetchSandboxMeta();
                },

                membershipSucceeded: function() {
                    this.gotoState('loggedInState');
                },

                membershipFailed: function() {
                    console.log("membership test failed");
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

                navigationState: SC.State.extend({

                    enterState: function() {
                        console.log('navigation!');
                        KG.core_note.refreshMarkers();
                    },

                    createNoteAction: function() {
                        this.gotoState('createNoteState');
                    },

                    noteSelectedAction: function(note, marker) {
                        if (KG.core_note.activateNote(note, marker)) {
                            var self = this;
                            setTimeout(function() {
                                self.gotoState('editNoteState');
                            },
                            25);
                        }
                    },

					mouseClickedOnMap: function(lonlat){
						KG.core_sandbox.set('mousePosition', lonlat);
						KG.core_info.findFeaturesAt(lonlat);
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
						var self = this;
						setTimeout(function(){self.gotoState('navigationState');}, 1);						
					},
					
					selectFeatureAction: function(){
						KG.core_info.selectFeature();
						this.gotoState('navigationState');
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
                        }
                    })
                })
            })
        })
    })
});
