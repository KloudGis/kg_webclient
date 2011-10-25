/**
* View to renderer a feature in the search result list.
**/
KG.SearchResultLabelView = KG.Button.extend({
	
	tagName:'div',
	
	mouseUp: function(e){
		KG.statechart.sendAction('featureZoomAction', this.getPath('itemView.content'));
		return NO;
	}
});