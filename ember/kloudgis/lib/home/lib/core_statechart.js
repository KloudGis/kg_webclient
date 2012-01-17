/**
* Statechart for the home page
**/
SC.mixin(KG, {
    //global state chart
    statechart: SC.Statechart.create({
        //log trace
        trace: NO,

        rootState: SC.State.extend({

            initialSubstate: 'tryAuthenticate',

            tryAuthenticate: SC.State.extend({
                enterState: function() {
                    console.log('try');
                    setTimeout(function() {
                        KG.core_home.authenticate();
                    },
                    1);
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
                    console.log('I dont know you!!');
                    console.log(KG.core_auth.get('authenticationToken'));
                    window.location.href = "index.html";
                }
            }),

            loggedInState: SC.State.extend({

                initialSubstate: 'listSandboxState',

                enterState: function() {
                    console.log('hi!');
                    KG.core_home.loadSandboxList();
                    var mess = $.getQueryString('message');
                    if (mess) {
                        KG.pageController.set('errorMessage', mess.loc());
                    }
                },

                listSandboxState: SC.State.extend({

                    initialSubstate: 'selectSandboxState',

                    enterState: function() {
                        KG.pageController.set('listSandboxHidden', NO);
                    },

                    exitState: function() {
                        KG.pageController.set('listSandboxHidden', YES);
                    },

                    createSandboxAction: function() {
                        this.gotoState('createSandboxState');
                    },

                    selectSandboxState: SC.State.extend({

                        enterState: function() {},

                        exitState: function() {},

	                    openSandboxAction: function(sbKey) {
	                        window.location.href = "sandbox.html?sandbox=" + sbKey
	                    },

                        toggleDeleteSandboxModeAction: function() {
                            this.gotoState('deleteSandboxState');
                        }
                    }),

                    deleteSandboxState: SC.State.extend({

                        enterState: function() {
                            KG.pageController.set('deleteMode', YES);
                        },

                        exitState: function() {
                            KG.pageController.set('deleteMode', NO);
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
                        KG.pageController.set('errorMessage', '');
                        KG.pageController.set('addSandboxHidden', NO);
                    },

                    exitState: function() {
                        console.log('Exit create sandbox state!');
                        //to close mobile keyboard
                        $('#add-sandbox-panel input').blur();
                        KG.pageController.set('addSandboxHidden', YES);
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
                                KG.pageController.set('errorMessage', '_nameAlreadyTaken'.loc());
                            } else {
                                var center = KG.core_leaflet.getCenter();
                                var rec = KG.store.createRecord(KG.Sandbox, {
                                    name: name,
                                    lon: center.get('lon'),
                                    lat: center.get('lat'),
                                    zoom: KG.core_leaflet.getZoom()
                                });
                                KG.store.commitRecords();
                                rec.onReady(null,
                                function() {
                                    KG.statechart.sendAction('sandboxCreateSuccess');
                                });
                                rec.onError(null,
                                function() {
                                    rec.destroy();
                                    KG.statechart.sendAction('sandboxCreateError');
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
                            KG.pageController.set('errorMessage', '_requestError'.loc());
                        } else {
                            KG.pageController.set('errorMessage', '_serverError'.loc());
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

            })
        })
    })
});
