KG.PluginRecordsButtonView = KG.Button.extend({
	
	recordsVisible: NO,
	
	tagName:'div',
	
	activePluginDidChange: function(){
		var cat = this.get('content');
		if(cat === KG.searchResultsController.get('plugin')){
			this.set('recordsVisible', YES);
		}else{
			this.set('recordsVisible', NO);
		}
	}.observes('KG.searchResultsController.plugin'),
	
	records:function(){
		if(this.get('recordsVisible')){
			return KG.searchResultsController.get('content');
		}
	}.property('recordsVisible', 'KG.searchResultsController.content')
	
	
});