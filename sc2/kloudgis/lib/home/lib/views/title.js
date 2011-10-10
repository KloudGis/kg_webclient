KG.TitleView = SC.View.extend({

    recordsReadyBinding: 'KG.sandboxesController.recordsReady',

    titleString: function() {

        if (this.get('recordsReady')) {
            var count = KG.sandboxesController.get('length');
            if (count > 0) {
				if(count === 1){
					return "_sandboxesListOne".loc();
				}else{
                	return "_sandboxesList".loc(count);
				}
            } else {
                return "_sandboxesNothing".loc();
            }
        }else{
			return '';
		}
    }.property('recordsReady')

});
