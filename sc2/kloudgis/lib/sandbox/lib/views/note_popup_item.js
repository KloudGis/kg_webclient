KG.NotePopupItemView = SC.Button.extend({
	
	classNames: 'note-popup-item'.w(),
	
	tagName: 'div',
	
	title: function(){
		return this.getPath('itemView.content.title');
	}.property('itemView.content.title'),
	
	mouseUp: function(e){
		console.log('click note!' + this.get('title') );
		KG.statechart.sendAction('noteSelectedAction', this.getPath('itemView.content'), KG.notesPopupController.get('marker'));
		return NO;
	}
});
