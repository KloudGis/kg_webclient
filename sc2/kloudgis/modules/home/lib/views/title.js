KG.TitleView = SC.View.extend({

    countBinding: 'KG.sandboxesController.length',

    titleString: function() {
        var count = this.get('count');
        if (count > 0) {
            return "_sandboxesList".loc();
        } else {
            return "_sandboxesNothing".loc();
        }
    }.property('count')

});
