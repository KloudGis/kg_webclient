/**
* View (TextArea) to add comment.
**/
KG.CommentAreaView = KG.TextArea.extend({

    insertNewline: function(event) {
        KG.statechart.sendAction('addCommentAction');
        var self = this;
        setTimeout(function() {
			self.$().data('AutoResizer').check()
        },
        205);
    },

    cancel: function() {
        this.set('value', '');
        this.$().blur();
    }

});
