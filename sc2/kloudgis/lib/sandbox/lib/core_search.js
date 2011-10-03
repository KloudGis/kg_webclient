KG.core_search = SC.Object.create({
	
	searchFeatures: function(){
		var search = KG.searchController.get('searchValue');
		KG.searchController.set('searchValue', '');
		console.log('search for:'  +search);
	}
});