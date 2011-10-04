KG.SearchResultLabelView = KG.Button.extend({
	
	tagName:'div',
	
	mouseUp: function(e){
		KG.statechart.sendAction('featureZoomAction', this.getPath('itemView.content'));
		return NO;
	}
});