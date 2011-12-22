/**
* Button to delete a feature comment.  
**/
KG.DeleteFeatureCommentView = KG.Button.extend({
	
	isVisible: function(){
		var content = this.getPath('itemView.content');
		if(content === KG.featureDeleteCommentController.get('content')){
	        if (KG.core_sandbox.hasWriteAccess()) {
	            return YES;
	        }
		}
		return NO;
	}.property('itemView.content', 'KG.featureDeleteCommentController.content'),
	
	label: function(){
		return "_Delete".loc()
	}.property()
});