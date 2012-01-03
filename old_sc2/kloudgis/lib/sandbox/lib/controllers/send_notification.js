KG.sendNotificationController = SC.Object.create({
	
	showing: NO,
	content: '',
	sendOnEnterValue: YES,
	feedbackMessage: '',
	
	pendingNotification: null,
	
	notificationLabel: function(){
		return '_notificationSendText'.loc();
	}.property(),
	
	sendLabel: function(){
		return '_notificationSendButton'.loc();
	}.property(),
	
	sendOnEnterTooltip: function(){
		return '_sendOnEnterTooltip'.loc();
	}.property(),
	
	hasNotificationPending: function(){
		return !SC.none(this.get('pendingNotification'));
	}.property('pendingNotification')
	
});