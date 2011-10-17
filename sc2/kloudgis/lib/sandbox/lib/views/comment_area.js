KG.CommentAreaView = KG.TextArea.extend({

    insertNewline: function(event) {
        KG.statechart.sendAction('addCommentAction');
        this.set('value', '');
        var area = this.$();
        area.css('max-height', '28px');
        setTimeout(function() {
            area.blur();
            area.css('height', 28);
            area.css('max-height', '');
        },
        205);
    },

    cancel: function() {
        this.set('value', '');
        this.$().blur();
    }

});
