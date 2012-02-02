KG.homePanelController = Ember.Object.create({

    listSandboxHidden: NO,
    listSandboxPushed: NO,

    addSandboxHidden: YES,
    addSandboxPushed: YES,

    deleteMode: NO,

	createSandboxButtonDisabled: NO,

    addTitle: '_createSandboxTitle'.loc(),

    errorMessage: '',

    listTitle: function() {
        return KG.sandboxesController.get('title');
    }.property('KG.sandboxesController.title'),

    setListSandboxActive: function() {
        clearTimeout(this._timeout);
        var self = this;
        this.set('listSandboxHidden', NO);
        this.set('listSandboxPushed', NO);
        this.set('addSandboxPushed', YES);
        this._timeout = setTimeout(function() {
            self.set('addSandboxHidden', YES);
        },
        700);
    },

    setAddSandboxActive: function() {
        clearTimeout(this._timeout);
        var self = this;
        this.set('addSandboxHidden', NO);
        this.set('addSandboxPushed', NO);
        this.set('listSandboxPushed', YES);
        this._timeout = setTimeout(function() {
            self.set('listSandboxHidden', YES);
			KG.core_home.map.setCenter(KG.LonLat.create({lon: -72, lat:46}), 6);
            KG.core_home.map.mapSizeDidChange();			
        },
        700);
    }

});
