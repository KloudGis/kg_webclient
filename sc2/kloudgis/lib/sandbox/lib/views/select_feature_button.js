KG.SelectFeatureButtonView = SC.Button.extend({
	
	tagName: 'div',
	
	mouseUp: function(e){
		console.log('click SELECT!!!' );
	//	KG.statechart.sendAction('noteSelectedAction', this.getPath('itemView.content'), KG.notesPopupController.get('marker'));
		return NO;
	}
});