KG.CommentAreaView = KG.TextArea.extend({

    insertNewline: function(event) {		
		KG.statechart.sendAction('addCommentAction');
		this.set('value', '');
		var area = $("#note-new-comment-area");
		area.css('max-height', '28px');
		setTimeout(function(){			
			area.blur();
			area.css('height', 28);
			area.css('max-height', '');
			},200);
    },

    cancel: function() {
        this.set('value', '');
        this.$().blur();
    }

});
