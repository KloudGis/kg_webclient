KG.BookmarkButtonView = KG.Button.extend({
	bmPath: 'resources/images/bookmark.png',
	bmActivePath:  'resources/images/bookmark_active.png',
	
	activatedBinding: "KG.bookmarksController.activePopup",
	
	bookmarkImg: function(){
		if(this.get('activated')){
			return this.get('bmActivePath');
		}else{
			return this.get('bmPath');
		}
	}.property('activated')
});
