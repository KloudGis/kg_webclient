/**
* List of KG.Message
**/
KG.notificationsController = Ember.ArrayController.create({
	content: [],
	
	activePopup: NO,
	
	hasNotification: function(){
		return this.get('length') > 0;
	}.property('length')
});