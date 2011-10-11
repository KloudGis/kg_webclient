KG.CommentAreaView = KG.TextArea.extend({

    insertNewline: function(event) {		
		KG.statechart.sendAction('addCommentAction');
		var area = $("#note-new-comment-area");
		area.css('max-height', '28px');
		setTimeout(function(){			
			area.blur();
			area.css('height', 28);
			area.css('max-height', '');
			},250);
    },

    cancel: function() {
        this.set('value', '');
        this.$().blur();
    }

});
