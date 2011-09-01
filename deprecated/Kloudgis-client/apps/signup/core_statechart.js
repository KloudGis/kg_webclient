SC.mixin(Signup, {
    statechart: SC.Statechart.create({
        //log trace
        //   trace: YES,
        initialState: 'transientTestServerState',

        transientTestServerState: SC.State.design({

            enterState: function() {
                Signup.pingServer();
                this.timer = SC.Timer.schedule({
                    target: this,
                    action: 'timerFired',
                    interval: 10000,
                    repeats: NO
                });
            },

            exitState: function() {
                this.timer.invalidate();
                this.timer = undefined;
            },

            timerFired: function() {
                this.gotoState('errorState');
            },

            serverErrorEvent: function(sender) {
                this.gotoState('errorState');
            },

            pingSucessEvent: function(sender) {
                this.gotoState('showSignupPage');
            }
        }),

        errorState: SC.State.design({
            alertController: null,

            enterState: function() {
                this.alertController = SC.Object.create({

                    parentState: this,

                    alertPaneDidDismiss: function(pane, status) {
                        switch (status) {
                        case SC.BUTTON1_STATUS:
                            Signup.statechart.sendEvent('tryAgain');
                            break;

                        case SC.BUTTON2_STATUS:
                            Signup.statechart.sendEvent('quit');
                            break;
                        }
                    }
                });

                SC.AlertPane.warn("Erreur de connexion", "La connexion au serveur est impossible.", "Réessayez dans quelques minutes.", "Réessayer", "Quitter", this.alertController);
            },

            exitState: function() {
                this.alertController = undefined;
            },

            tryAgain: function() {
                this.gotoState('transientTestServerState');
            },

            quit: function() {
                Signup.gotoLoginPage();
            }
        }),

        showSignupPage: SC.State.design({

            enterState: function() {
                Signup.signupController.set('content', Signup.store.createRecord(Signup.User, {}));
                Signup.getPath('mainPage.mainPane').append();
            },

            exitState: function() {
                Signup.getPath('mainPage.mainPane').remove();
            },

            createAccount: function() {
                //logout first - make sure the login window will show up
                Signup.signupController.set('didClickCreate', YES);
                if (Signup.signupController.get('isCreateAccount') === NO) {
                    Signup.signupController.set('isCreateAccount', YES);
                    Signup.logout();
                }
            },

            didLogout: function() {
                //then create the account
                Signup.testAndCreate();
            },

            createSuccessEvent: function() {
                //goto sucess page
                this.gotoState('showSuccessPage');
            },

            createErrorEvent: function(sender, message) {
                SC.AlertPane.warn("Opération impossible", "Le compte n' pas été créé.", message);
                Signup.signupController.set('isCreateAccount', NO);
            },

            serverErrorEvent: function() {
                SC.AlertPane.warn("Erreur du serveur", "Le serveur ne répond pas.", 'Veuillez ré-essayer plus tard.');
                Signup.signupController.set('isCreateAccount', NO);
            }

        }),

        showSuccessPage: SC.State.design({

            enterState: function() {
                Signup.getPath('successPage.mainPane').append();
            },

            exitState: function() {
                Signup.getPath('successPage.mainPane').remove();
            },

            gotoLogin: function(sender) {
                if (SC.buildMode === 'debug') {
                    ref = 'http://localhost:4020/kloudgis'.fmt(Signup.context);
                } else {
                    ref = '/'.fmt(Signup.context);
                }
				window.location.href = ref;
            }
        }),
    })
});
