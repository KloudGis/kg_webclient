sc_require('models/project')
sc_require('models/feed')
sc_require('models/layer')
SC.mixin(CoreKG, {
	//admin 
	PROJECT_QUERY: SC.Query.local(CoreKG.Project),
	FEED_QUERY: SC.Query.remote(CoreKG.Feed,{rangeWindowSize: 50}),
	
	//sandbox specific (uses CoreKG.active_sandbox)
	LAYER_QUERY: SC.Query.local(CoreKG.Layer),
	
});