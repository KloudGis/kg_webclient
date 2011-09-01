KG.LoginState = SC.State.extend({

    enterState: function() {},

    exitState: function() {},

    initialSubstate: 'trySigninWithCookieState',

    trySigninWithCookieState: SC.State.design({

        enterState: function() {
            KG.core_login.trySigninWithCookie();
        },

		authenticationSucceeded: function(sender){
			this.gotoState('runningState');
		},

        authenticationFailed: function(sender) {
            this.gotoState('loggedOutState');
        }
    }),

    loggedOutState: SC.State.design({
        enterState: function() {
            SC.Module.loadModule('kloudgis/login_ui', this, this.uiLoaded);
        },

        uiLoaded: function() {
			KG.loginController.set('content', KG.Credential.create({}));
            KG.getPath('loginPage.mainPane').append();
            this.invokeLater(function(){
				KG.core_login.focusUserField();
			}, 200);
        },

        exitState: function() {
            var pane = KG.getPath('loginPage.mainPane');
            if (pane) {
                pane.remove();
            }
        },

        loginAction: function(sender) {
            KG.core_login.signin();
        },

        signupAction: function() {
            KG.core_login.signup();
        },

        authenticationSucceeded: function() {
            this.gotoState('runningState');
			KG.loginController.set('user', '');
            KG.loginController.set('pwd', '');
        },

        authenticationFailed: function() {
        }
    })
});

