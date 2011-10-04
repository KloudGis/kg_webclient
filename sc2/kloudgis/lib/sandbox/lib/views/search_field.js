KG.SearchField = KG.TextField.extend({
    type: "search",

    insertNewline: function() {
		KG.statechart.sendAction('searchAction');
	},
	
	cancel: function(){
		this.set('value', '');
		this.$().blur();
	},
	
	valueDidChange: function(){
		if(this.get('value') === ''){
			KG.statechart.sendAction('clearSearchAction');
		}
	}.observes('value')
});
