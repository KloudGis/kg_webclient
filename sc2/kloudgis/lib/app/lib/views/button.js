var get = SC.get;
KG.Button = SC.Button.extend({
	
	label_loc: function(){
		return this.get('label').loc();
	}.property('label'),

    mouseUp: function(event) {
        if (get(this, 'isActive')) {
            var action = get(this, 'sc_action')
            if (action && KG.statechart) {
                KG.statechart.sendAction(action, this);
            }
        }
        this._super();
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
