KG.pageController = Ember.Object.create({

	listSandboxHidden: NO,
	
	addSandboxHidden: YES,
	
	deleteMode: NO,
	
	addTitle: '_createSandboxTitle'.loc(),
	
	errorMessage: '',
	
	listTitle: function(){
		return KG.sandboxesController.get('title');
	}.property( 'KG.sandboxesController.title')
	
	
});