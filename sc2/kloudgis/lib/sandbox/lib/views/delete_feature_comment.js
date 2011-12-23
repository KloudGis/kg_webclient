/**
* Button to delete a feature comment.  
**/
KG.DeleteFeatureCommentView = KG.Button.extend({
	
	isVisible: function(){
		var content = this.getPath('itemView.content');
		if(content === KG.featureDeleteCommentController.get('content')){
	       	var auth = content.get('author');
	        if (!auth || auth === KG.core_auth.get('activeUser').id || KG.core_sandbox.get('isSandboxOwner')) {
	            return YES;
	        }
		}
		return NO;
	}.property('itemView.content', 'KG.featureDeleteCommentController.content'),
	
	label: function(){
		return "_Delete".loc()
	}.property()
});