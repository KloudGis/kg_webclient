KG.UserButtonView = KG.Button.extend({
	activePopup: NO,
	
	activePopupBinding: 'KG.activeUserController.activePopup',
	
	activePopupDidChange: function(){
		this.set('isActive', this.get('activePopup'));
	}.observes('activePopup'),
	
	isActiveDidChange:function(){
		if(this.get('activePopup')){
			this.set('isActive', YES);
		}
	}.observes('isActive'),
	
	triggerAction: function() {
		KG.statechart.sendAction('toggleUserOptionsPopupAction');
	}
});