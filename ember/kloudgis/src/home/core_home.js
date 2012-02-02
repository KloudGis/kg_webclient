/**
* Core functions for the home page
**/
KG.core_home = SC.Object.create({

    createSandboxTitle: "_createSandboxTitle".loc(),

    //map for Home usage
    map: KG.MapLeaflet.create({ baseLayer: 'OSM'}),

    connectedUserLabel: function() {
        var user = KG.core_auth.get('activeUser');
        if (user) {
            return "_welcomeUser".loc(user.name);
        } else {
            return '';
        }
    }.property('KG.core_auth.activeUser'),

    loadSandboxList: function() {
		if(KG.sandboxesController.get('content')){
			KG.sandboxesController.get('content').destroy();
		}
		KG.store.unloadRecords(KG.Sandbox);
		KG.sandboxesController.set('recordsReady', NO);
        var records;
        records = KG.store.find(KG.SANDBOX_QUERY);
        KG.sandboxesController.set('content', records);
        records.onReady(this, this._onListReady);
        records.onError(this, this._onListError);
    },

    _onListReady: function(records) {
        KG.sandboxesController.set('recordsReady', YES);
        records.offError();
    },

    _onListError: function(records) {
        KG.homePanelController.set(errorMessage, '_errorLoading'.loc());
    }
});
