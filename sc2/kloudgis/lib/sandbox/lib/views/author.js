KG.AuthorView = SC.View.extend({

	authorLabel: function(){
		var content = this.getPath('itemView.content');
		if(SC.none(content)){
			return '';
		}
		if (content.get('author') === KG.core_auth.activeUser.id){
			return '_me'.loc();
		}else{
			return content.get('author_descriptor');
		}
	}.property('itemView.content')
});