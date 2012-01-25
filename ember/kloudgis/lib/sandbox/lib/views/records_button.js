KG.RecordsButtonView = KG.Button.extend({
	
	recordsVisible: NO,
	
	tagName:'div',
	
	activeCategoryDidChange: function(){
		var cat = this.get('content');
		if(cat === KG.searchResultsController.get('category')){
			this.set('recordsVisible', YES);
		}else{
			this.set('recordsVisible', NO);
		}
	}.observes('KG.searchResultsController.category'),
	
	records:function(){
		if(this.get('recordsVisible')){
			return KG.searchResultsController.get('content');
		}else{
			return null;
		}
	}.property('recordsVisible', 'KG.searchResultsController.content')
	
	
});