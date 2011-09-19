KG.NotePopupItemView = SC.View.extend({
	
	classNames: 'note-popup-item'.w(),
	
	title: function(){
		return this.getPath('itemView.content.title');
	}.property('itemView.content.title'),
	
	mouseUp: function(e){
		console.log('click note!' + this.get('title') );
		return NO;
	}
});
