KG.core_sandbox = SC.Object.create({
	
	sandboxMeta: {},
	
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
			this.fetchSandboxMeta();
		}else{
			KG.statechart.sendAction('authenficationFailed', this);
		}
	},
	
	fetchSandboxMeta: function(){
		$.ajax({
            type: 'GET',
            url: '/api_sandbox/protected/sandboxes/%@/meta'.fmt(KG.get('activeSandboxKey')),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
			headers: KG.core_auth.createAjaxRequestHeaders(),
            context: this,
            error: function(jqXHR, textStatus, errorThrown) {
                SC.Logger.error('SB Meta error: HTTP error status code: ' + jqXHR.status);
            },
            success: function(data, textStatus, jqXHR) {
				console.log('SB Meta success.');
               	this.set('sandboxMeta', data);
            },
            async: YES
        });
	},
	
	metaDidChange: function(){
		console.log('Meta changed.');
		$('#active-sandbox-label').text(this.get('sandboxMeta').name);
	}.observes('sandboxMeta'),
	   
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
