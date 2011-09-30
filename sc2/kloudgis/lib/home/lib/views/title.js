KG.TitleView = SC.View.extend({

    recordsReadyBinding: 'KG.sandboxesController.recordsReady',

    titleString: function() {

        if (this.get('recordsReady')) {
            var count = KG.sandboxesController.get('length');
            if (count > 0) {
                return "_sandboxesList".loc(count);
            } else {
                return "_sandboxesNothing".loc();
            }
        }else{
			return '';
		}
    }.property('recordsReady')

});
