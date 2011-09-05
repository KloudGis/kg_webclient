KG.SignupField = SC.View.extend({
	
	classNames: 'signup-field'.w(),
	focus: NO,
	
	focusIn: function(e){
		this.set('focus', YES);
		KG.statechart.sendAction('focusInEvent', this, e);
		return YES;
	},
	
	focusOut: function(e){
		this.set('focus', NO);
		KG.statechart.sendAction('focusOutEvent', this, e);
		return YES;
	},
	
	keyUp: function(e){		
		if(e.keyCode == 13){
			KG.statechart.sendAction('newLineEvent', this, e);
		}
		return YES;
	},
	
});
