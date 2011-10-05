KG.searchResultsController = SC.ArrayProxy.create({
	content: [],
	closeLabel: "_closeSearch".loc(),
	listVisible: NO,
	category: null,
	
	listTitle: function(){
		if(SC.none(this.get('content'))){
			return '';
		}else{
			var cat = this.get('category');
			if(SC.none(cat)){
				return '';
			}else{
				return "_searchResult".loc(this.getPath('content.length'), cat.get('search'), cat.get('title'));
			}
		}
	}.property('content.length'),
	
	hasResults: function(){
		return this.getPath('content.length') > 0;
	}.property('content.length')
})