sc_require('models/featuretype')
sc_require('models/note_marker')
sc_require('models/quick_feature')
SC.mixin(CoreKG, {
	//sandbox specific (uses CoreKG.active_sandbox)
	FEATURETYPE_QUERY: SC.Query.local(CoreKG.Featuretype, {rangeWindowSize: 50})
});