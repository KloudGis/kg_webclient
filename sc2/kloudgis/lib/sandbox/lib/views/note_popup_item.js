//multiple note popup item
KG.NotePopupItemView = SC.Button.extend({
	
	classNames: 'popup-note-item'.w(),
	
	tagName: 'div',
	
	mouseUp: function(e){
		this._super(e);
		KG.statechart.sendAction('noteSelectedAction', this.getPath('itemView.content'), {marker: KG.notesPopupController.get('marker')});
		return NO;
	}
});
