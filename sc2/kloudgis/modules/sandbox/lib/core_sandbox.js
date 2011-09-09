KG.core_sandbox = SC.Object.create({
	
	authenticate: function(){		
		KG.core_auth.load(this, this.authenticateCallback);
	},
	
	authenticateCallback: function(message){
		if(message === "_success"){
			KG.statechart.sendAction('authenticationSucceeded', this);
		}else{
			KG.statechart.sendAction('authenficationFailed', this);
		}
	},
	   
	addMap: function(){
		KG.core_leaflet.addToDocument();
	}
	
});


$(document).ready(function() {
    KG.statechart.initStatechart();
});
