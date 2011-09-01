
CoreKG = SC.Object.create({
	context_server: '/kg_server',
	_authCookieName: 'security-Kloudgis.org',
	_authToken: null,
	store: SC.Store.create({ 
	  commitRecordsAutomatically: NO
	}).from('CoreKG.Store'),
	//the active sandbox id (project)
	active_sandbox: null
});

