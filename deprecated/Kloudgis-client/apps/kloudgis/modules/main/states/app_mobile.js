KG.MobileAppState = SC.State.extend({

    enterState: function() {
        KG._appIsReady = NO;
        SC.Module.loadModule('kloudgis/m_app', this, this.moduleLoaded);
    },

    moduleLoaded: function() {
        KG._appIsReady = YES;
        KG.statechart.sendEvent('appReadyEvent', this);
    },

    initialSubstate: 'idleState',

 	idleState: SC.State.design({
		
		appReadyEvent: function(){
			this.gotoState('mobileOpenProject');
		}
		
	}),

    mobileOpenProject: SC.State.design({

        enterState: function() {
            KG.getPath('mobileAppPage.mainPane').append();
        },

        exitState: function() {
            var pane = KG.getPath('mobileAppPage.mainPane');
            if (pane) {
                pane.remove();
            }
        }
    })

});
