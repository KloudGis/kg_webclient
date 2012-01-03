KG.addBookmarkController = SC.Object.create({
	
	showing: NO,
	content: '',
	
	addBookmarkLabel: function(){
		return '_bookmarkDialogTitle'.loc();
	}.property(),	
	
	closeTitle: function(){
		return '_bookmarkCloseDialogTitle'.loc();
	}.property(),
	
	addLabel: function(){
		return '_bookmarkAdd'.loc();
	}.property()
	
});