KG.core_home = SC.Object.create({
	
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
	
	logout: function(){
		KG.core_auth.logout();
		window.location.href="index.html";
	}	
});

KG.store = SC.Store.create({ 
  commitRecordsAutomatically: NO
}).from('KG.Store'),

$(document).ready(function() {
    KG.statechart.initStatechart();
});


