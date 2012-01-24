KG.DeleteCheckboxView = KG.Button.extend({
	
	isChecked: NO,
	
	isOwner: function(){
		var content = this.getPath('itemView.content');
		if(content && KG.core_auth.get('activeUser') && content.get('owner') === KG.core_auth.get('activeUser').id){
			return YES;
		}
		return NO;
	}.property('itemView.content'),
	
	deleteListDidChange: function(){
		var content = this.getPath('itemView.content');
		if(KG.deleteController.indexOf(content) > -1){
			this.set('isChecked', YES);
		}else{
			this.set('isChecked', NO);
		}		
	}.observes('itemView.content', 'KG.deleteController.length')
});