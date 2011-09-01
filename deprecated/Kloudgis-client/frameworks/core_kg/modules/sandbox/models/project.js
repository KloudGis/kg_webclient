CoreKG.Project = SC.Record.extend(
/** @scope CoreKG.Project.prototype */ {
		
	name: SC.Record.attr(String),
	
	homeLonLatCenter: SC.Record.attr(String),
	homeZoomLevel:	SC.Record.attr(Number),	
	
	layers: function(){
		return CoreKG.store.find(CoreKG.LAYER_QUERY);
	}.property(),
	
	featuretypes: function(){
		return CoreKG.store.find(CoreKG.FEATURETYPE_QUERY);
	}.property(),
	
	/*members: function(){
		return CoreKG.store.find(CoreKG.MEMBER_QUERY);
	}.property(),
	 */
});
