SC.mixin(KG, {
    //global state chart
    statechart: SC.Statechart.create({
        //log trace
        trace: NO,

        rootState: SC.State.extend({

            initialSubstate: 'tryAuthenticate',

            tryAuthenticate: SC.State.extend({
                enterState: function() {
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
                    var sb = $.getQueryString('sandbox');
                    KG.set('active_sandbox', sb);
                    KG.core_sandbox.addMap();
                    $('#if-spinner').fadeOut();
                    KG.core_note.refreshMarkers();
                    KG.core_layer.loadLayers();
                },

                mapZoomed: function(sender) {
                    KG.core_note.refreshMarkers(YES);
                },

                mapMoved: function(sender) {
                    KG.core_note.refreshMarkers();
                },

                navigationState: SC.State.extend({

                    enterState: function() {
                        console.log('navigation!');
                    },

                    createNoteAction: function() {
                        this.gotoState('createNoteState');
                    },

                }),

                createNoteState: SC.State.extend({
					
					initialSubstate: 'locateNoteState',
					
                    enterState: function() {
                        console.log('creating a note!');
                        KG.core_note.locateNote();
                    },

                    locateNoteState: SC.State.extend({
	
						enterState: function(){
							console.log('Lets locate it first');
							KG.core_note.locateNote();
						},
						
                        notePositionSet: function() {
                            this.gotoState('confirmNoteState');
                        },
                    }),

                    confirmNoteState: SC.State.extend({
						
						enterState: function(){
							console.log('Confirm it now.');
							if(!KG.core_note.createNote()){
								this.gotoState('createNoteState');
							}
						},
						
                        newNotePopupClosed: function() {
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
