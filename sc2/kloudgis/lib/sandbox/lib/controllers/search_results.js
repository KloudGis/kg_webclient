/**
* Features found on search category selection.
**/
KG.searchResultsController = SC.ArrayProxy.create({
	content: [],
	closeLabel: "_closeSearch".loc(),
	listVisible: NO,
	category: null,
	plugin: null,
	
	listTitle: function(){
		if(SC.none(this.get('content'))){
			return '';
		}else{
			var cat = this.get('category');
			if(SC.none(cat)){
				var plugin = this.get('plugin');
				if(!SC.none(plugin)){
					return "_searchResult".loc(this.getPath('content.length'), plugin.get('searchValue'), plugin.get('pluginName'));
				}
			}else{
				return "_searchResult".loc(this.getPath('content.length'), cat.get('search'), cat.get('title'));
			}
		}
	}.property('content.length'),
	
	hasResults: function(){
		return this.getPath('content.length') > 0;
	}.property('content.length')
})