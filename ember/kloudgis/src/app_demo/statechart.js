//the global statechart
Ember.mixin(KG, {
    //global state chart
    statechart: Ember.Statechart.create({
        //log trace
        trace: NO,

        rootState: Ember.State.extend({

            initialSubstate: 'tryLoginAutoState',

            //-----------------------
            // Transient: Auto Login with Cache
            //-----------------------
            tryLoginAutoState: Ember.State.extend({
                enterState: function() {
                    KG.core_init.loadLoginCore();
                    console.log('try auto login state');
                    var user = $.getQueryString('user');
                    if (Ember.none(user)) {
                        setTimeout(function() {
                            KG.core_login.tryLoginAuto();
                        },
                        1);
                    } else {
                        this.gotoState('loggedOutState');
                    }
                },

				exitState:function(){
					$('#loading').hide();
				},

                authenticationSucceeded: function(sender) {
                    console.log('auto auth success');
                    this.gotoState('loggedInState');
                },

                authenticationFailed: function(sender) {
                    console.log('auto auth failed');
                    this.gotoState('loggedOutState');
                }
            }),

            //-----------------------
            // Logout state: Show the login Page
            //-----------------------
            loggedOutState: Ember.State.extend({

                enterState: function() {
                    KG.pageController.setLoginActive();
                    var user = $.getQueryString('user');
                    if (!Ember.none(user)) {
                        KG.credential.set('user', user);
                    }
                    KG.core_init.loadLoginPage();
                },

                exitState: function() {},

                loginAction: function(sender) {
                    KG.core_login.login();
                },

                authenticationSucceeded: function() {
                    KG.credential.set('pwd', null);
                    KG.core_login.focusUserField();
                    this.gotoState('loggedInState');
                },

                authenticationFailed: function() {}

            }),

            //-----------------------
            // Login Successful State
            //-----------------------
            loggedInState: Ember.State.extend({

                initialSubstate: 'homeState',

                enterState: function() {
                    console.log('login successful');
                },

                logoutAction: function() {
                    KG.core_auth.logout();
                    this.gotoState('loggedOutState');
                },

                //-----------------------
                // Home Page State
                //-----------------------
                homeState: Ember.State.extend({

                    initialSubstate: 'tranHomeState',
					
                    //-----------------------
                    // Transient - create Home Page 
                    // and anim transition
                    //-----------------------
                    tranHomeState: Ember.State.extend({

                        _timeout: null,

                        enterState: function() {
                            KG.core_init.loadHomePage();
                            var self = this;
                            this._timeout = setTimeout(function() {
                                KG.pageController.setHomeActive();
                                self.gotoState('openHomeState');
                            },
                            100);
                        },

                        exitState: function() {
                            clearTimeout(this._timeout);
                        }
                    }),

					//-----------------------
                    // Open HOME Page State
                    //-----------------------
                    openHomeState: Ember.State.plugin('KG.HomeState'),
                }),

                //-----------------------
                // Sandbox Page State
                //-----------------------
                sandboxState: Ember.State.extend({

                    initialSubstate: 'transSandboxState',

                    //-----------------------
                    // Transient - create Sandbox Page 
                    // and anim transition
                    //-----------------------
                    transSandboxState: Ember.State.extend({

                        _timeout: null,

                        enterState: function() {
                            KG.core_init.loadSandboxPage();
                            var self = this;
                            this._timeout = setTimeout(function() {
                                KG.pageController.setSandboxActive();
                                self.gotoState('openSandboxState');
                            },
                            100);
                        },

                        exitState: function() {
                            clearTimeout(this._timeout);
                        }
                    }),

                    //-----------------------
                    // Open Sandbox Page State
                    //-----------------------
                    openSandboxState: Ember.State.plugin('KG.SandboxState')

                }),
            }),

            //different page for signup (an other app)
            signupAction: function(sender) {
                window.location.href = "/signup";
            },
        })
    })
});
