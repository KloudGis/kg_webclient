/**
*  One Feature in the featureinfo popup.
**/
KG.FeatureInfoPopupItemView = KG.Button.extend({
	
	classNames: 'info-popup-item'.w(),
	
	templateName:'info-item',
	
	content: null,
	
	tagName: 'div',
	
	sc_action: 'featureInfoMouseUpAction',
	
	manualMouseDown: YES,

	mouseEnter: function(e){
		var content = this.get('content');
		KG.statechart.sendAction('featureInfoMouseEnterAction', content);
		return NO;
	},
	
	mouseLeave: function(e){
		var content = this.get('content');
		KG.statechart.sendAction('featureInfoMouseLeaveAction', content);
		return NO;
	}
});