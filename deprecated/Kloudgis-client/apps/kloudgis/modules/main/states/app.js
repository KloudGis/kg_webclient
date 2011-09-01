KG.AppState = SC.State.extend({

    enterState: function() {
        KG._appIsReady = NO;
        SC.Module.loadModule('kloudgis/app', this, this.moduleLoaded);
    },

    moduleLoaded: function() {
        KG._appIsReady = YES;
        KG.statechart.sendEvent('appReadyEvent', this);
    },

    exitState: function() {
        //remove the layer from the OL map		
        //clean controllers and unload records
        KG.cleanUpShareSandbox();
    },

    initialSubstate: 'appCheckUserState',

    appCheckUserState: SC.State.design({

        enterState: function() {
            KG.checkLogin();
        },

        userLoggedInEvent: function(sender) {
            if (KG._appIsReady) {
                this.gotoState('checkProjectAccessState');
            } else {
                this.gotoState('checkProjectAccessWaitState');
            }
        },

        userLoggedOutEvent: function(sender) {
            this.gotoState('loginState');
        },

        serverErrorEvent: function(sender, message) {
            this.gotoState('appServerErrorState');
        },

        serverTimeoutErrorEvent: function(sender) {
            this.gotoState('appServerTimeoutErrorState');
        }
    }),

    checkProjectAccessState: SC.State.design({
        enterState: function() {
            KG.core_app.validateProject();
        },

        projectValidEvent: function(sender) {
            KG.core_app.testMembership();
        },

        projectInvalidEvent: function(sender) {
            this.gotoState('homeState');
        },

        serverErrorEvent: function(sender, message) {
            this.gotoState('appServerErrorState');
        },

        serverTimeoutErrorEvent: function(sender) {
            this.gotoState('appServerTimeoutErrorState');
        },

        memberAuthenticationSucceeded: function(sender) {
            this.gotoState('openProject');
        },

        memberAuthenticationFailed: function(sender) {
            this.gotoState('appMembershipError');
        }
    }),

    checkProjectAccessWaitState: SC.State.design({

        appReadyEvent: function(sender) {
            this.gotoState('checkProjectAccessState');
        }
    }),

    appErrorState: SC.State.design({

        initialSubstate: 'appServerErrorState',

        appServerErrorState: SC.State.plugin('KG.ServerErrorState'),

        appServerTimeoutErrorState: SC.State.plugin('KG.TimeoutErrorState'),

        appMembershipError: SC.State.plugin('KG.PrivilegeErrorState'),

        serverErrorTryAgainEvent: function(sender) {
            this.gotoState('appCheckUserState');
        },

        serverErrorQuitEvent: function(sender) {
            this.get('statechart').sendEvent('logoutEvent');
        },

        okEvent: function(sender) {
            this.gotoState('homeState');
        }
    }),

    openProject: SC.State.design({

        enterState: function() {
            KG.core_app.loadData();
            KG.core_app.gotoHomeLocation();
            KG.getPath('appPage.mainPane').append();		
        },

        exitState: function() {
            if (KG.core_app) {
                KG.core_app.cleanUpViews();
            }
            var pane = KG.getPath('appPage.mainPane');
            if (pane) {
                pane.remove();
            }
            if (KG.core_app) {
                KG.core_app.cleanUpData();
            }
        },

        mapReadyEvent: function(sender) {
            KG.core_app.refreshMarkers();
        },

        zoomChangedEvent: function(sender, zoom) {
            KG.core_app.refreshMarkers();
        },

		moveChangedEvent: function(sender, bounds) {
            KG.core_app.checkMarkers(bounds);
        },

        substatesAreConcurrent: YES,

        modesState: SC.State.design({

            initialSubstate: 'selectModeState',

            selectModeState: SC.State.design({

                enterState: function() {
                    SC.Logger.warn('Select MODE');
                },

                exitState: function() {
                },

                initialSubstate: 'selectNoFeatureSelectedState',

                selectNoFeatureSelectedState: SC.State.design({

                    enterState: function() {
						//SC.Logger.warn('enter NO selectNoFeatureSelectedState');
						var center = KG.mapController.getCenter();
                        KG.appPage.get('mapview').adjust({
								left: 0,
								bottom:0
		                });
                        this.invokeLater(function() {
                            KG.mapController.updateSize(center)
                        },
                        500);
						KG.core_app.clearHighlightSelection();
					},

                    exitState: function() {},

                    featuresSelectedEvent: function(sender) {
						//SC.Logger.warn('event: featuresSelectedEvent');
                        this.gotoState('selectFeatureSelectedState');
                    },
                }),

                selectFeatureSelectedState: SC.State.design({

                    enterState: function() {
					   ///SC.Logger.warn('enter selectFeatureSelectedState');
					   //console.log('active selection is:');
					   //console.log(KG.activeSelectionController.get('content'));
						KG.core_app.highlightSelection();
						KG.core_app.centerMapOnSelection(this, this.reshape);                   					   						
                    },

					reshape: function(){
						var center = KG.mapController.getCenter();
                        KG.appPage.get('mapview').adjust({
								left: 0.5,
								bottom:0.5
		                });
                        this.invokeLater(function() {
                            KG.mapController.updateSize(center);							
                        },
                        500);
					},
					
                    exitState: function() {},

					activeSelectionChangedEvent: function(sender, selection){
						//SC.Logger.warn('Event: active selection changed!');
						KG.core_app.centerMapOnSelection();
						KG.core_app.highlightSelection();
					},

                    featureSelectionClearedEvent: function(sender) {
						//SC.Logger.warn('Event: featureSelectionClearedEvent!');
                        this.gotoState('selectNoFeatureSelectedState');
                    }
                }),

                qFeaturesFoundEvent: function(sender, lonlat) {
					//SC.Logger.warn('Event: qFeaturesFoundEvent!');
                    KG.core_app.showQuickSelectionPopup(lonlat);
                },

                mapDidClickEvent: function(sender, lonlat) {		
					//SC.Logger.warn('Event: mapDidClickEvent!');
                    var features = KG.core_app.findFeaturesAt(lonlat);
                    KG.core_app.quickSelectFeatures(features, lonlat);
                },

            }),

            editModeState: SC.State.design({
                enterState: function() {
                    SC.Logger.warn('Edit MODE');
                }
            })
        }),

        //concurrent state to show and hide modal pane
        modalPanesState: SC.State.design({

            initialSubstate: 'hiddenState',

            //do not forward to parent state the not handled events. It creates duplicate because of the concurrent states.
            tryToHandleEvent: function(event, arg1, arg2) {
                sc_super();
                return YES;
            },

            showOptionsEvent: function(sender) {
                SC.Logger.debug('options requested');
            },

            hiddenState: SC.State.design({

}),

            showOptionsState: SC.State.design({

}),

            showSearchResultState: SC.State.design({

})

        })
    })

});
