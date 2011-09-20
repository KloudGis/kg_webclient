KG.NotePopupItemView = SC.View.extend({
	
	classNames: 'note-popup-item'.w(),
	
	title: function(){
		return this.getPath('itemView.content.title');
	}.property('itemView.content.title'),
	
	mouseUp: function(e){
		console.log('click note!' + this.get('title') );
		KG.statechart.sendAction('noteSelectedAction', this.getPath('itemView.content'), KG.notePopupController.get('marker'));
		return NO;
	}
});
