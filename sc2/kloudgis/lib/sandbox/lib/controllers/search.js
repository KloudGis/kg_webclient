KG.searchController = SC.ArrayProxy.create({
	content: [],
	searchValue: null,
	searchHistorySize: 5,
	closeLabel: "_closeSearch".loc(),
	
	listTitle: function(){
		return "_searchResult".loc(this.getPath('content.length'));
	}.property('content.length')
});