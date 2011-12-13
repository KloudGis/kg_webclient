KG.NotificationButtonView = KG.Button.extend({
	notificationPath: 'resources/images/notification.png',
	notificationActivePath:  'resources/images/notification.png',
	
	activatedBinding: "KG.notificationsController.activePopup",
	
	notificationCountBinding: "KG.notificationsController.length",
	
	notificationImg: function(){
		if(this.get('activated')){
			return this.get('notificationActivePath');
		}else{
			return this.get('notificationPath');
		}
	}.property('activated')
	
	
});