SC.mixin(KG, {
    //global state chart
    statechart: SC.Statechart.create({
        //log trace
        trace: NO,

        rootState: SC.State.extend({
	
            initialSubstate: 'tryAuthenticate',

            tryAuthenticate: SC.State.extend({
                enterState: function() {
					if(!KG.core_sandbox.authenticate()){
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
						var sb = $.getQueryString('sandbox');
						KG.set('active_sandbox', sb);					
						KG.core_sandbox.addMap();
						$('#if-spinner').fadeOut();	
						KG.core_note.refreshMarkers();				
						KG.core_layer.loadLayers();
					},
					
					mapZoomed: function(sender){
							KG.core_note.refreshMarkers(YES);	
					},
					
					mapMoved: function(sender){
						KG.core_note.refreshMarkers();	
					}
		
			})
			
        })
    })
});
