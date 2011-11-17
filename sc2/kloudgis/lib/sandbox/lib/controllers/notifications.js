/**
* List of KG.Message
**/
KG.notificationsController = SC.ArrayProxy.create({
	content: [],
	
	activePopup: NO,
	
	hasNotification: function(){
		return this.get('length') > 0;
	}.property('length'),
});