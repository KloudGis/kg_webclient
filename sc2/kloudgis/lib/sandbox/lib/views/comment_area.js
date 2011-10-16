KG.CommentAreaView = KG.TextArea.extend({

    insertNewline: function(event) {		
		KG.statechart.sendAction('addCommentAction');	
    },

    cancel: function() {
        this.set('value', '');
        this.$().blur();
    }

});
