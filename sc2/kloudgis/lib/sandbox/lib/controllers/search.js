/**
* List of Search categories upon search request.
**/
KG.searchController = SC.ArrayProxy.create({
	content: [],
	searchHistorySize: 5,
	searchValue: null,
	
	hasResults: function(){
		return this.getPath('content.length') > 0;
	}.property('content.length'),
	
});