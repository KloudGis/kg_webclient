/**
* Wrap the comment being created.
**/
KG.featureNewCommentController = SC.Object.create({
    content: null,

	showingDidChange: function(){
		//cleanup new comment if the comment section is closed
		if(!KG.featureCommentsController.get('showing')){
			this.set('content', null);
		}
	}.observes('KG.featureCommentsController.showing')
});