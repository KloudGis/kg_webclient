/**
* View (TextArea) to add comment.
**/
KG.CommentAreaView = KG.TextArea.extend({

    insertNewline: function(event) {
        KG.statechart.sendAction(this.get('nl_sc_action'));
        var self = this;
        setTimeout(function() {
			var resizer = self.$().data('AutoResizer');
			if(resizer){
				resizer.check();
			}
        },
        205);
    },

    cancel: function() {
        this.set('value', '');
        this.$().blur();
    }

});
