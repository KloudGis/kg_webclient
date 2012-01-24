KG.activeUserController = Ember.Object.create({
	//user name
	name: null,
	
	activePopup: NO,

	activeUserDidChange: function(){
		if(KG.core_auth.get('activeUser')){
			this.set('name', KG.core_auth.get('activeUser').name);
		}else{
			this.set('name','');
		}
	}.observes('KG.core_auth.activeUser')
});