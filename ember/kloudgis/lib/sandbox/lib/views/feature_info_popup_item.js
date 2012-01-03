/**
*  One Feature in the featureinfo popup.
**/
KG.FeatureInfoPopupItemView = SC.Button.extend({
	
	classNames: 'info-popup-item'.w(),
	
	content: null,
	
	tagName: 'div',
	
	isVisible: function(){
		if(this.get('ignoreIfFirst')){
			if(this.getPath('itemView.contentIndex') === 0){
				return NO;
			}
		}
		return YES;
	}.property('ignoreIfFirst'),

	
	mouseUp: function(e){
		var content = this.get('content') || this.getPath('itemView.content');
		KG.statechart.sendAction('featureInfoMouseUpAction', content);
		return NO;
	},
	
	mouseEnter: function(e){
		var content = this.get('content') || this.getPath('itemView.content');
		KG.statechart.sendAction('featureInfoMouseEnterAction', content);
		return NO;
	},
	
	mouseLeave: function(e){
		var content = this.get('content') || this.getPath('itemView.content');
		KG.statechart.sendAction('featureInfoMouseLeaveAction', content);
		return NO;
	}
});