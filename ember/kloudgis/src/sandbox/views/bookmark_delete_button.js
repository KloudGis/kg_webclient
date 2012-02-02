KG.BookmarkDeleteButtonView = KG.Button.extend({
	
	classNameBindings:['isAvailable:is-visible'],
	
	isAvailable: function(){
		var content = this.getPath('itemView.content');
		if(content && KG.bookmarksController.get('editMode')){
			var auth = content.get('user_create');
	        if (!auth || auth === KG.core_auth.get('activeUser').id || KG.core_sandbox.get('isSandboxOwner')) {
	            return YES;
	        }
		}
		return NO;
	}.property('itemView.content', 'KG.bookmarksController.editMode'),
	
	
	isChecked: NO,
	
	
	deleteListDidChange: function(){
		var content = this.getPath('itemView.content');
		if(KG.bookmarksController.get('deleteList').indexOf(content) > -1){
			this.set('isChecked', YES);
		}else{
			this.set('isChecked', NO);
		}		
	}.observes('itemView.content', 'KG.bookmarksController.deleteList.length')
});