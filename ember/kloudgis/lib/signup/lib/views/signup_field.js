/**
* View for one of the signup field.  The actual textfield will forward the events to this parent view.
**/
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
		return NO;
	},
	
	keyDown: function(e){	
		return YES;
	},
	
	keyUp: function(e){		
		if(e.keyCode == 13){
			KG.statechart.sendAction('newLineEvent', this, e);
		}
		return NO;
	},
	
});
