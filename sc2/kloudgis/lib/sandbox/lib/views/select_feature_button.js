KG.SelectFeatureButtonView = SC.Button.extend({
	
	tagName: 'div',
	
	mouseUp: function(e){
		var content = this.get('content') || this.getPath('itemView.content');
		KG.statechart.sendAction('selectFeatureAction', content);
		return NO;
	}
});