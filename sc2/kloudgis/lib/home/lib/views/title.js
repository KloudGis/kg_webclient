KG.TitleView = SC.View.extend({

    countBinding: 'KG.sandboxesController.length',

    recordsReadyBinding: 'KG.sandboxesController.recordsReady',

    titleString: function() {

        if (this.get('recordsReady')) {
            var count = this.get('count');
            if (count > 0) {
                return "_sandboxesList".loc();
            } else {
                return "_sandboxesNothing".loc();
            }
        }else{
			return '';
		}
    }.property('count', 'recordsReady')

});
