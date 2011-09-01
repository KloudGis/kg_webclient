SC.mixin(KG, {
    //global state chart
    statechart: SC.Statechart.create({
        //log trace
        trace: NO,

        rootState: SC.State.extend({
	
            initialSubstate: 'tryLoginAutoState',

            tryLoginAutoState: SC.State.extend({
                enterState: function() {
					console.log('try auto login state');
		            KG.core_login.tryLoginAuto();
		        },

				authenticationSucceeded: function(sender){
					this.gotoState('loggedInState');
				},

		        authenticationFailed: function(sender) {
		            this.gotoState('loggedOutState');
		        }
            }),

            loggedOutState: SC.State.extend({
	
		        enterState: function() {
					console.log('Logged out state');
					KG.loginController.set('content', KG.Credential.create({}));
		        },

		        loginAction: function(sender) {
		            KG.core_login.login();
		        },

		        signupAction: function() {
		            KG.core_login.signup();
		        },

		        authenticationSucceeded: function() {
		            this.gotoState('loggedInState');				
		        },

		        authenticationFailed: function() {
		        }
		
		    }),
		
			loggedInState: SC.State.extend({
				
					enterState:function(){
						console.log('login successful');
						KG.loginController.get('content').destroy();
						KG.loginController.set('content', null);
						KG.core_login.loginCompleted();
					}
			})
        })
    })
});
