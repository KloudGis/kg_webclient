//predefined queries
KG.SANDBOX_QUERY = SC.Query.local(KG.Sandbox, {query_url: '/api_sandbox/protected/sandboxes', orderBy: 'date DESC'});

/**
* Core functions for the home page
**/
KG.core_home = SC.Object.create({
	
	connectedUserLabel: function(){
		var user = KG.core_auth.get('activeUser');
		if(user){
			return "_welcomeUser".loc(user.name);
		}
	}.property('KG.core_auth.activeUser'),
	
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
	},
	
	loadSandboxList: function(){
		var records = KG.store.find(KG.SANDBOX_QUERY);
		KG.sandboxesController.set('content', records);
		records.onReady(this, this._onListReady);
		records.onError(this, this._onListError);
	},
	
	_onListReady: function(records){
		$('#if-spinner').fadeOut();					
		KG.sandboxesController.set('recordsReady', YES);
		records.offError();
	},
	
	_onListError: function(records){
		$('#if-spinner').fadeOut();					
		console.log('records error!');
		var label = $('#sandboxes-title');
		label.text('_errorLoading'.loc());
		label.css('color', 'red');
	}
});

$(document).ready(function() {
    KG.statechart.initStatechart();
	 if ($.browser.isIphone) {
		setTimeout(function() { window.scrollTo(0, 1) }, 1000);
	 }
});


