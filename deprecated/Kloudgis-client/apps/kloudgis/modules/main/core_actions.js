SC.mixin(KG, {

    //destroy the auth cookie and go to login page
    logoutAction: function() {
        var authCookie = SC.Cookie.find(CoreKG._authCookieName);
        if (authCookie != null) {
            authCookie.destroy(); // Remove our cookie to logout
        }
        CoreKG._authToken = null;
        //tell the server about the logout to clean the session
        SC.Request.getUrl("%@/public/logout".fmt(CoreKG.context_server)).json().notify(this, this.didLogout).send();
    },

    didLogout: function(response) {
        KG.statechart.sendEvent('gotoLoginEvent', this);
        if (SC.ok(response)) {} else {
            SC.Logger.warn('error logging out:' + response);
        }
        //clean up
        KG.loggedUserController.set('content', null);
        //wipe projects
        var storeK = CoreKG.store.storeKeysFor(CoreKG.Project);
        CoreKG.store.unloadRecords(CoreKG.Project, null, storeK);
        //wipe feeds
        storeK = CoreKG.store.storeKeysFor(CoreKG.Feed);
        CoreKG.store.unloadRecords(CoreKG.Feed, null, storeK);
    }

});
