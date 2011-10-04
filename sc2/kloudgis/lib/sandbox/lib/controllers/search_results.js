KG.searchResultsController = SC.ArrayProxy.create({
	content: [],
	closeLabel: "_closeSearch".loc(),
	listVisible: NO,
	
	listTitle: function(){
		if(SC.none(this.get('content'))){
			return '';
		}else{
			return "_searchResult".loc(this.getPath('content.length'));
		}
	}.property('content.length'),
	
	hasResults: function(){
		return this.getPath('content.length') > 0;
	}.property('content.length')
})