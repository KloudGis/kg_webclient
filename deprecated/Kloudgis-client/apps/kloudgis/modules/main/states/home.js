KG.HomeState = SC.State.extend({

    enterState: function() {
        SC.Module.loadModule('kloudgis/home', this, this.moduleLoaded);
    },

    moduleLoaded: function() {
        KG.getPath('homePage.mainPane').append();
		KG.core_home.loadData();
    },

    exitState: function() {
        var pane = KG.getPath('homePage.mainPane');
        if (pane) {
            pane.remove();
        }
		if(KG.core_home){
			KG.core_home.cleanUp();
		}
    },

    initialSubstate: 'homeCheckUserState',

    homeCheckUserState: SC.State.design({

        enterState: function() {
            KG.checkLogin();
        },

        userLoggedInEvent: function(sender) {
            this.gotoState('noProjectSelectedState');
        },

        userLoggedOutEvent: function(sender) {
            this.gotoState('loginState');
        },

        serverErrorEvent: function(sender, message) {
            this.gotoState('homeServerErrorState');
        },

        serverTimeoutErrorEvent: function(sender) {
            this.gotoState('homeServerTimeoutErrorState');
        }
    }),

	homeErrorState: SC.State.design({

        initialSubstate: 'homeServerErrorState',

        homeServerErrorState: SC.State.plugin('KG.ServerErrorState'),

        homeServerTimeoutErrorState: SC.State.plugin('KG.TimeoutErrorState'),

        serverErrorTryAgainEvent: function(sender) {
            this.gotoState('homeCheckUserState');
        },

        serverErrorQuitEvent: function(sender) {
            this.gotoState('homeCheckUserState');
        }
    }),

    noProjectSelectedState: SC.State.design({

        enterState: function() {},

        projectSelectedEvent: function(sender) {
            this.gotoState('projectSelectedState');
        },

    }),

    projectSelectedState: SC.State.design({

        enterState: function() {},

        projectSelectedEvent: function(sender) {
			//do something ?
		},
		
		noProjectSelectedEvent: function(sender) {
            this.gotoState('noProjectSelectedState');
        },

        openProjectEvent: function(sender) {		
			KG.core_home.setActiveProject();
            //if(SC.browser.isiOS){
		//		this.gotoState('mobileProjectState');
		//	}else{
            	this.gotoState('projectState');				
		//	}
        },

        browseProjectDataEvent: function(sender) {
			KG.core_home.setActiveProject();
        },

        configProjectEvent: function(sender) {
			KG.core_home.setActiveProject();
            this.get('statechart').sendEvent('gotoConfigProjectEvent');
        }
    })
});

