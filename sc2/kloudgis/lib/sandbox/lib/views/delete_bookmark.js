/**
* Button to delete a bookmark.  
**/
KG.DeleteBookmarkView = KG.Button.extend({
	/*
	isVisible: function(){
		var content = this.getPath('itemView.content');
		if(content === KG.deleteCommentController.get('content')){
			var auth = content.get('author');
	        if (!auth || auth === KG.core_auth.get('activeUser').id || KG.core_sandbox.get('isSandboxOwner')) {
	            return YES;
	        }
		}
		return NO;
	}.property('itemView.content', 'KG.deleteCommentController.content')
	*/
});