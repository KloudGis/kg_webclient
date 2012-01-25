KG.HomeState = SC.State.extend({

    initialSubstate: 'listSandboxState',

    enterState: function() {
        console.log('home!');
        KG.core_home.loadSandboxList();		
    },

	exitState: function() {
	},

    listSandboxState: SC.State.extend({

        initialSubstate: 'selectSandboxState',

        enterState: function() {
            KG.homePanelController.setListSandboxActive();
        },

        createSandboxAction: function() {
            this.gotoState('createSandboxState');
        },

        selectSandboxState: SC.State.extend({

            enterState: function() {},

            exitState: function() {},

            openSandboxAction: function(sbKey) {
				KG.set('activeSandboxKey', sbKey);            
				this.gotoState('sandboxState');
            },

            toggleDeleteSandboxModeAction: function() {
                this.gotoState('deleteSandboxState');
            }
        }),

        deleteSandboxState: SC.State.extend({

            enterState: function() {
                KG.homePanelController.set('deleteMode', YES);
            },

            exitState: function() {
                KG.homePanelController.set('deleteMode', NO);
				KG.deleteController.set('content', []);
            },

            toggleDeleteSandboxModeAction: function() {
                this.gotoState('selectSandboxState');
            },

			deleteSandboxAction:function(){
				console.log('delete selected sandboxes');
				var select = KG.deleteController.get('content');
				select.forEach(function(sandbox){
					sandbox.destroy();
				});
				KG.store.commitRecords();
				this.gotoState('selectSandboxState');
			},

			checkSandboxAction: function(content){
				console.log('add to delete sandbox');
				if(content){
					if(KG.deleteController.indexOf(content) > -1){
						KG.deleteController.removeObject(content);
					}else{
						KG.deleteController.pushObject(content);
					}
				}
			}
        }),

    }),

    createSandboxState: SC.State.extend({

        enterState: function() {
            console.log('Enter create sandbox state!');
			KG.homePanelController.set('createSandboxInProgress', NO);
      		KG.core_home.get('map').addToDocument(null,null,null,'add-sandbox-map')
            KG.homePanelController.set('errorMessage', '');
			KG.homePanelController.setAddSandboxActive();
        },

        exitState: function() {
            KG.homePanelController.set('errorMessage', '');
            //to close mobile keyboard
            $('#add-sandbox-panel input').blur();
            KG.addSandboxController.set('name', '');
        },

        commitCreateAction: function() {
            var name = KG.getPath('addSandboxController.name');
            if (!Ember.none(name) && name.length > 0) {
                var qUnique = SC.Query.local(KG.Sandbox, {
                    conditions: "name='%@'".fmt(name)
                });
                var res = KG.store.find(qUnique);
                if (res.get('length') > 0) {
                    console.log('sb name already in use');
                    KG.homePanelController.set('errorMessage', '_nameAlreadyTaken'.loc());
                } else {
					KG.homePanelController.set('createSandboxInProgress', YES);
                    var center = KG.core_home.get('map').getCenter();
                    var rec = KG.store.createRecord(KG.Sandbox, {
                        name: name,
                        lon: center.get('lon'),
                        lat: center.get('lat'),
                        zoom: KG.core_home.get('map').getZoom()
                    });
                    KG.store.commitRecords();
                    rec.onReady(null,
                    function() {
                        KG.statechart.sendAction('sandboxCreateSuccess');
						KG.homePanelController.set('createSandboxInProgress', NO);
                    });
                    rec.onError(null,
                    function() {
                        rec.destroy();
                        KG.statechart.sendAction('sandboxCreateError');
						KG.homePanelController.set('createSandboxInProgress', NO);
                    });
                }
            } else {
                console.log('empty sb name');
            }
        },

        sandboxCreateSuccess: function() {
            this.gotoState('selectSandboxState');
        },

        sandboxCreateError: function() {
            console.log('error while commit');

        },

        httpError: function(status) {
            if (status == 400) {
                KG.homePanelController.set('errorMessage', '_requestError'.loc());
            } else {
                KG.homePanelController.set('errorMessage', '_serverError'.loc());
            }
        },

        cancelCreateAction: function() {
            var rec = KG.addSandboxController.get('content');
            if (rec) {
                rec.destroy();
            }
            this.gotoState('selectSandboxState');
        }
    })

});