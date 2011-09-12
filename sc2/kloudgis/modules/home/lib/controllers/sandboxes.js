//predefined queries
KG.SANDBOX_QUERY = SC.Query.local(KG.Sandbox, {query_url: '/api_sandbox/protected/sandboxes'});

KG.sandboxesController = SC.ArrayProxy.create({
	content: [],
	selection: null,
});