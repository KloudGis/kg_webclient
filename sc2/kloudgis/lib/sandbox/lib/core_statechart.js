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
                    KG.core_sandbox.authenticate();
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
                        if (KG.core_note.activateNote(note, marker)) {
                            var self = this;
                            setTimeout(function() {
                                self.gotoState('editNoteState');
                            },
                            25);
                        }
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

                    deleteNoteAction: function() {
                        KG.core_note.deleteActiveNote();
                        this.gotoState('navigationState');
                    },

                    mapZoomed: function(sender) {},

                    mapMoved: function(sender) {},
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
                        },

                        activePopupClosed: function() {}

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
