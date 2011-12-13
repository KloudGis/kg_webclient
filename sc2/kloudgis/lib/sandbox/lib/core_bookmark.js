KG.core_bookmark = SC.Object.create({

    loadBookmarks: function() {
        var bm = KG.store.find(KG.BOOKMARK_QUERY);
        KG.bookmarksController.set('content', bm);
        bm.onReady(this, this._bmReady);
    },

    _bmReady: function(bookmarks) {
        //?
    },

    gotoBookmark: function(bm) {
        if (bm) {
            var c = bm.get('center');
            var zoom = bm.get('zoom');
            if (c) {
                var lonLat = KG.LonLat.create({
                    lon: c.x,
                    lat: c.y
                });
                KG.core_leaflet.setCenter(lonLat, zoom);
            }
        }
    },

    deleteBookmark: function(bookmark) {
        if (bookmark) {
            var storeKey = bookmark.get('storeKey');
            bookmark.destroy();
            KG.store.commitRecords(null, null, [storeKey]);
        }
    },

	addBookmark: function(label, centerLonLat, zoom){
		var c = {x: centerLonLat.get('lon'), y: centerLonLat.get('lat')};
		var newBm = KG.store.createRecord(KG.Bookmark, {label: label, center: c, zoom: zoom});
		//commit only this record
        KG.store.commitRecords(null, null, [newBm.get('storeKey')]);
	}
});
