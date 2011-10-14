KG.CommentAreaView = KG.TextArea.extend({

    insertNewline: function(event) {		
		KG.statechart.sendAction('addCommentAction');
		this.set('value', '');		
    },

    cancel: function() {
        this.set('value', '');
        this.$().blur();
    }

});
