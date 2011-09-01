//Actions from the security states
SC.mixin(KG, {
	
	//look for the current user logged in.
    checkLogin: function(statechart) {
        SC.Request.postUrl("%@/public/logged_user".fmt(CoreKG.context_server)).json().notify(this, this.didCheckLogin, statechart).send(CoreKG._authToken);
    },

    didCheckLogin: function(response, statechart) {
        if (SC.ok(response)) {
            var body = response.get('body');
            if (SC.kindOf(body, SC.Error)) {
                //not logged in
				KG.loggedUserController.set('content', null);
                KG.statechart.sendEvent('userLoggedOutEvent', this);
            } else {
                if (SC.none(body) || body == '0' || body === '') {
                    //not logged in
					KG.loggedUserController.set('content', null);
                    KG.statechart.sendEvent('userLoggedOutEvent', this);
                } else {
                    var storeKey = CoreKG.store.loadRecord(CoreKG.User, response.get('body'));
					var user = CoreKG.store.materializeRecord(storeKey);
                    //logged in
					KG.loggedUserController.set('content', user);
                    KG.statechart.sendEvent('userLoggedInEvent', this);
                }
            }
        } else {
			KG.loggedUserController.set('content', null);
            KG.statechart.sendEvent('serverErrorEvent', this);
        }
    }

});
