/**
* Button to delete a note comment.  
**/
KG.DeleteNoteCommentView = KG.Button.extend({
	
	isVisible: function(){
		var content = this.getPath('itemView.content');
		if(content === KG.noteDeleteCommentController.get('content')){
			var auth = content.get('author');
	        if (!auth || auth === KG.core_auth.get('activeUser').id || KG.core_sandbox.get('isSandboxOwner')) {
	            return YES;
	        }
		}
		return NO;
	}.property('itemView.content', 'KG.noteDeleteCommentController.content'),
	
	label: function(){
		return "_Delete".loc()
	}.property()
});