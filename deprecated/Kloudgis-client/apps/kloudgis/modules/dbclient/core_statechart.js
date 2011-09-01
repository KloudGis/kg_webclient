SC.mixin(KG, {
    dbclient: SC.Statechart.create({

        //log trace
        trace: YES,
        rootState: SC.State.design({

            initialSubstate: 'featureTypeUnselected',

			enterState: function(){
				KG.getPath('dbclientPage.mainPane').append();
			},
			
			leavePageEvent: function(sender) {
                SC.Logger.debug('Dbclient module exit!');
                KG.core_dbclient.cleanUp();
               // this.gotoState('dbclientIdleState');
            },

            //ft not selected
            featureTypeUnselected: SC.State.design({

                enterState: function() {
                    SC.Logger.debug('Enter FeatureTypeUnselected state');
                },

                exitState: function() {},

                featuretypeSelected: function(sender, ft) {
                    SC.Logger.debug('enter featuretypeSelected');
                    //enable add att type button
                    if (ft) {
                        KG.loadFeatures(ft);
                    } else {
                        //Modeladmin.schemaController.set('content', null);
                    }
                    this.gotoState('featureTypeSelected');
                },

            }),

            //featuretype selected
            featureTypeSelected: SC.State.design({

                //substatesAreConcurrent: YES,
                enterState: function() {
                    SC.Logger.debug('Enter featureTypeSelected state')
                },

                exitState: function() {},

                attrtypeSelected: function(sender) {
                    //SC.Logger.warn('click button2!!');
                    //alert("Attr type selected IN");
                    this.gotoState('state22');
                },

                featuretypeSelected: function(sender, ft) {
                    //alert('FeatureType Selected IN state 2');
                    //enable add att type button
                    //this.gotoState('state21');
                    if (ft) {
                        Dbclient.loadFeatures(ft);
                    } else {
                        //Dbclient.featuresController.set('content', null);
                    }
                    this.gotoState('featureUnselected');
                },

                //attrtype deselected
                featureUnselected: SC.State.design({

                    enterState: function() {
                        SC.Logger.warn('2-1');

                    },

                    exitState: function() {},

                    gotoFeatureTypeUnselected: function(sender) {

},

                }),

                //attrtype selected
                featureSelected: SC.State.design({

                    enterState: function() {
                        SC.Logger.warn('2-2');
                    },

                    exitState: function() {},

                    gotoState2: function(sender) {
                        SC.Logger.warn('2-2 click button2!!');
                    }
                })
            })
        })
    })
});
