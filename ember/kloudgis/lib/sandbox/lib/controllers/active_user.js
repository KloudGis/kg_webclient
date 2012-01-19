KG.activeUserController = Ember.Object.create({
	//user name
	name: null,
	
	activePopup: NO,

	activeUserDidChange: function(){
		this.set('name', KG.core_auth.get('activeUser').name);
	}.observes('KG.core_auth.activeUser')
});