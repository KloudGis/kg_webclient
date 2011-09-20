var get = SC.get;
KG.Button = SC.Button.extend({

	attributeBindings: ['type', 'disabled'],

    label_loc: function() {
        return this.get('label').loc();
    }.property('label'),

    mouseUp: function(event) {
		this._super();
        var action = get(this, 'sc_action')
        if (action && KG.statechart) {
            KG.statechart.sendAction(action, this);
        }
    },

    keyUp: function(e) {
        if (e.keyCode == 13) {
            var action = get(this, 'sc_action')
            if (action && KG.statechart) {
                KG.statechart.sendAction(action, this);
            }
        }
    }
});
