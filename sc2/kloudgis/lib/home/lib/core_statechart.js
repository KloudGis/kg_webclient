SC.mixin(KG, {
    //global state chart
    statechart: SC.Statechart.create({
        //log trace
        trace: NO,

        rootState: SC.State.extend({
	
            initialSubstate: 'tryAuthenticate',

            tryAuthenticate: SC.State.extend({
                enterState: function() {
					if(!KG.core_home.authenticate()){
						this.gotoState('loggedOutState');
					}					
		        },
		
				authenticationSucceeded: function(){
					this.gotoState('loggedInState');
				},
				
				
				authenficationFailed: function(){
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
				
					enterState:function(){
						console.log('hi!');
						KG.core_home.loadSandboxList();				
						var mess = $.getQueryString('message');
						if(mess){
							var tag = $('#query-message');
							tag.text(mess.loc());
							tag.css('visibility', 'visible');
						}
					}
			})
			
        })
    })
});
