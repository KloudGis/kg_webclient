/**
* List of Search categories upon search request.
**/
KG.searchController = Ember.ArrayController.create({
	content: [],
	searchHistorySize: 5,
	searchValue: null,
	
	hasResults: function(){
		return this.getPath('content.length') > 0;
	}.property('content.length'),
	
});