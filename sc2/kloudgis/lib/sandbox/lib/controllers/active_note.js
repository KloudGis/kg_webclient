KG.activeNoteController = SC.Object.create({
	content: null,
	
	titleLabel: function(){
		return "_noteTitle".loc();
	}.property(),
	
	descriptionLabel: function(){
		return "_noteDescription".loc();
	}.property(),
	
	confirmLabel: function(){
		return "_noteConfirm".loc();
	}.property(),
});