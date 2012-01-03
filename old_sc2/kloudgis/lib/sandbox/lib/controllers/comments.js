//super class for comments controllers (note + feature)
KG.CommentsController = SC.ArrayProxy.extend({

    commentsPanelVisible: NO,
    showing: NO,
    isLoading: NO,

    //to bind 
    comments: null,

    content: function() {
        if (this.get('showing') && !this.get('isLoading')) {
            return this.get('comments');
        }
        return null;
    }.property('showing', 'comments', 'isLoading'),

    contentSize: function() {
        return this.getPath('comments.length');
    }.property('comments', 'comments.length'),

    showButtonVisible: function() {
		return this.get('commentsPanelVisible');
    }.property('commentsPanelVisible'),

    commentsLabel: function() {
        var len = this.get('contentSize');
        if (!this.get('showing')) {
            if (len === 0 || !len) {
                return "_0comment".loc();
            } else if (len === 1) {
                return "_1comment".loc();
            } else {
                return "_comments".loc(len);
            }
        } else {
            if (len === 0 || !len) {
                return "_0hideComment".loc();
            } else if (len === 1) {
                return "_1hideComment".loc();
            } else {
                return "_hideComments".loc(len);
            }
        }
    }.property('contentSize', 'showing')

});
