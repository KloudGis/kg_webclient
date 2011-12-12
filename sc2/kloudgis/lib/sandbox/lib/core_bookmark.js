KG.core_bookmark = SC.Object.create({

	loadBookmarks:function(){		
		var bm = KG.store.find(KG.BOOKMARK_QUERY);
		KG.bookmarksController.set('content', bm);
		bm.onReady(this, this._bmReady);
	},
	
	_bmReady: function(bookmarks){
		//?
	},
});