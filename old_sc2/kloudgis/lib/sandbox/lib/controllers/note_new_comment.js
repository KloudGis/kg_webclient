/**
* Wrap the comment being created.
**/
KG.noteNewCommentController = SC.Object.create({
    content: null,

	showingDidChange: function(){
		//cleanup new comment if the comment section is closed
		if(!KG.noteCommentsController.get('showing')){
			this.set('content', null);
		}
	}.observes('KG.noteCommentsController.showing')
});