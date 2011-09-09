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
					var user = $.getQueryString('user');				
					if(SC.none(user)){
		            	KG.core_login.tryLoginAuto();
					}else{
						this.gotoState('loggedOutState');
					}
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
					KG.core_login.set('showLogin', YES);
					jQuery('#if-spinner').fadeOut();				
					var user = $.getQueryString('user');
					if(!SC.none(user)){
						KG.credential.set('user', user);
					}
		        },

		        loginAction: function(sender) {
		            KG.core_login.login();
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
						window.location.href = "home.html";						
					}
			}),
			
			signupAction: function(sender) {
	            window.location.href = "signup.html";
	        },
        })
    })
});
