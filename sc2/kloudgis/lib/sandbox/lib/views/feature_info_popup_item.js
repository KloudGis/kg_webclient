KG.FeatureInfoPopupItemView = SC.Button.extend({
	
	classNames: 'info-popup-item'.w(),
	
	tagName: 'div',
	
	isVisible: function(){
		if(this.get('ignoreIfFirst')){
			if(this.getPath('itemView.content') === KG.infoController.getPath('content.firstObject')){
				return NO;
			}
		}
		return YES;
	}.property('ignoreIfFirst'),

	
	mouseUp: function(e){
		console.log('******click FeatureInfoPopupItemView' );
		//KG.statechart.sendAction('noteSelectedAction', this.getPath('itemView.content'), KG.notesPopupController.get('marker'));
		return NO;
	}
});