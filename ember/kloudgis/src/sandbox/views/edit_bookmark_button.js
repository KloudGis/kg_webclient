KG.EditBookmarkButtonView = KG.Button.extend({
	
	postAction: function(){
		this.set('isActive', KG.bookmarksController.get('editMode'));
	},
	
	editModeDidChange: function(){
		this.postAction();
	}.observes('KG.bookmarksController.editMode')
});