/**
* Wrap the comment that is marked to Delete. The user may click a button to confirm the delete.
**/
KG.featureDeleteCommentController = SC.Object.create({
	content: null,	
	
	showingDidChange: function(){
		//cleanup delete state if the comment section is closed
		if(!KG.featureCommentsController.get('showing')){
			this.set('content', null);
		}
	}.observes('KG.featureCommentsController.showing')
});