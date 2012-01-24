//the global statechart
SC.mixin(KG, {
    //global state chart
    statechart: SC.Statechart.create({
        //log trace
        trace: NO,

        rootState: SC.State.extend({

            initialSubstate: 'tryLoginAutoState',

            //-----------------------
            // Transient: Auto Login with Cache
            //-----------------------
            tryLoginAutoState: SC.State.extend({
                enterState: function() {
                    KG.core_init.loadLoginCore();
                    console.log('try auto login state');
                    var user = $.getQueryString('user');
                    if (SC.none(user)) {
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
            loggedOutState: SC.State.extend({

                enterState: function() {
                    KG.pageController.setLoginActive();
                    var user = $.getQueryString('user');
                    if (!SC.none(user)) {
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
            loggedInState: SC.State.extend({

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
                homeState: SC.State.extend({

                    initialSubstate: 'tranHomeState',
					
                    //-----------------------
                    // Transient - create Home Page 
                    // and anim transition
                    //-----------------------
                    tranHomeState: SC.State.extend({

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
                    openHomeState: SC.State.plugin('KG.HomeState'),
                }),

                //-----------------------
                // Sandbox Page State
                //-----------------------
                sandboxState: SC.State.extend({

                    initialSubstate: 'transSandboxState',

                    //-----------------------
                    // Transient - create Sandbox Page 
                    // and anim transition
                    //-----------------------
                    transSandboxState: SC.State.extend({

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
                    openSandboxState: SC.State.plugin('KG.SandboxState')

                }),
            }),

            //different page for signup (an other app)
            signupAction: function(sender) {
                window.location.href = "signup.html";
            },
        })
    })
});
