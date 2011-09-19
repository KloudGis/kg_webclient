KG.core_sandbox = SC.Object.create({
	
	authenticate: function(){		
		return KG.core_auth.load(this, this.authenticateCallback);		
	},
	
	authenticateCallback: function(message){
		if(message === "_success"){
			//write a cookie for wms service.  Expires in 1 days
			$.cookie('C-Kloudgis-Authentication', KG.core_auth.get('authenticationToken'), {expires: 1, path: '/'});
			//clear cookie on page leave
			window.onbeforeunload=function(){
				$.cookie('C-Kloudgis-Authentication', null, {expires: 1, path: '/'});
			};
			KG.statechart.sendAction('authenticationSucceeded', this);
		}else{
			KG.statechart.sendAction('authenficationFailed', this);
		}
	},
	   
	addMap: function(){
		KG.core_leaflet.addToDocument();
	},
	
	createNote: function(){
		KG.statechart.sendAction('createNoteAction');
	}
	
});


$(document).ready(function() {
    KG.statechart.initStatechart();
});
