SC.mixin(KG, {
    //global state chart
    statechart: SC.Statechart.create({
        //log trace
        trace: NO,

        rootState: SC.State.extend({

            initialSubstate: 'tryAuthenticate',

            tryAuthenticate: SC.State.extend({
                enterState: function() {
					var sb = $.getQueryString('sandbox');
                    KG.set('activeSandboxKey', sb);
                    if (!KG.core_sandbox.authenticate()) {
                        this.gotoState('loggedOutState');
                    }
                },

                authenticationSucceeded: function() {
                    this.gotoState('loggedInState');
                },

                authenficationFailed: function() {
                    this.gotoState('loggedOutState');
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
                    KG.core_sandbox.addMap();
                    $('#if-spinner').fadeOut();                 
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
                        KG.core_note.activateNote(note, marker);
                        var self = this;
                        setTimeout(function() {
                            self.gotoState('editNoteState');
                        },
                        25);
                    }
                }),

				mapZoomed: function(sender) {
                    KG.core_note.refreshMarkers();
                },

                mapMoved: function(sender) {
					KG.core_note.refreshMarkers();
                },

                editNoteState: SC.State.extend({

                    activePopupClosed: function() {
                        KG.core_note.revertUpdateNote();
                        this.gotoState('navigationState');
                    },

                    confirmNoteAction: function() {
                        KG.core_note.confirmUpdateNote();
                        this.gotoState('navigationState');
                    },

					deleteNoteAction: function(){
						KG.core_note.deleteActiveNote();
                        this.gotoState('navigationState');
					},

                    mapZoomed: function(sender) {
                    },

                    mapMoved: function(sender) {
                    },
                }),

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
                        }

                    }),

                    confirmNoteState: SC.State.extend({

                        enterState: function() {
                            console.log('Confirm it now.');
                            if (!KG.core_note.createNote()) {
                                this.gotoState('createNoteState');
                            }
                        },

						mapZoomed: function(sender) {
	                    },

	                    mapMoved: function(sender) {
	                    },

                        activePopupClosed: function() {
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
