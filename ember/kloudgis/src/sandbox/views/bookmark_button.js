KG.BookmarkButtonView = KG.Button.extend({
	bmPath: 'css/images/bookmark.png',
	bmActivePath:  'css/images/bookmark.png',
	
	activatedBinding: "KG.bookmarksController.activePopup",
	
	bookmarkImg: function(){
		if(this.get('activated')){
			return this.get('bmActivePath');
		}else{
			return this.get('bmPath');
		}
	}.property('activated')
});
