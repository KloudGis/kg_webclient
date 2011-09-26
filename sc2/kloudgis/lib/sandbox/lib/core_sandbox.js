KG.core_sandbox = SC.Object.create({
	
	sandboxMeta: {},
	membership: null,
	isSandboxOwner: NO,
	
	mousePosition: null,
	
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
	
	membershipCheck:function(){
		$.ajax({
            type: 'GET',
            url: '/api_data/protected/members/logged_member?sandbox=%@'.fmt(KG.get('activeSandboxKey')),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
			headers: KG.core_auth.createAjaxRequestHeaders(),
            context: this,
            error: function(jqXHR, textStatus, errorThrown) {
                SC.Logger.error('Membership error: HTTP error status code: ' + jqXHR.status);
				KG.statechart.sendAction('membershipFailed', this);
            },
            success: function(data, textStatus, jqXHR) {
				console.log('SB Meta success.');
				this.set('membership', data);
               	KG.statechart.sendAction('membershipSucceeded', this);
            },
            async: YES
        });
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
		$('#active-sandbox-label span').text(this.get('sandboxMeta').name);
		this.set('isSandboxOwner', KG.core_auth.get('activeUser').id === this.get('sandboxMeta').owner)
	}.observes('sandboxMeta'),
	   
	addMap: function(){
		KG.core_leaflet.addToDocument();
	},
	
	createNote: function(){
		KG.statechart.sendAction('createNoteAction');
	},
	
	latitudeLabel: function(){
		var pos = this.get('mousePosition');
		if(pos){
			return 'Lat: %@'.fmt(pos.get('lat').toFixed(4));
		}else{
			return 'Lat: ?';
		}
	}.property('mousePosition'),
	
	longitudeLabel: function(){
		var pos = this.get('mousePosition');
		if(pos){
			return 'Lon: %@'.fmt(pos.get('lon').toFixed(4));
		}else{
			return 'Lon: ?';
		}
	}.property('mousePosition')
	
});


$(document).ready(function() {
    KG.statechart.initStatechart();
});
