var get = SC.get;
KG.Button = SC.Button.extend({

    mouseUp: function(event) {     
        if (get(this, 'isActive')) {
            var action = get(this, 'sc_action')
            if (action && KG.statechart) {
                KG.statechart.sendAction(action, this);
            }
        }
		this._super();
    },
});
