KG.UserButtonView = KG.Button.extend({
	activePopup: NO,
	
	activePopupBinding: 'KG.activeUserController.activePopup',
	
	triggerAction: function() {
		this.set('activePopup', !this.get('activePopup'));
	}
});