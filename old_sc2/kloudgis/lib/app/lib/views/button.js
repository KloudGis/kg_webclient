/**
* Extend the SC.Button to add more attributes and send Statechart action
**/
var get = SC.get;
KG.Button = SC.Button.extend({

    attributeBindings: ['type', 'disabled', 'title'],

    disableTouch: NO,

    label_loc: function() {
        return this.get('label').loc();
    }.property('label'),

    mouseUp: function(e) {
        this._super(e);
        var action = get(this, 'sc_action')
        if (action && KG.statechart) {
            KG.statechart.sendAction(action, this.get('content') || this.getPath('itemView.content'));
			if(this.postAction){
				this.postAction();
			}
        }
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        return NO;
    },

    keyUp: function(e) {
        if (e.keyCode == 13) {
            var action = get(this, 'sc_action')
            if (action && KG.statechart) {
                KG.statechart.sendAction(action, this.get('content') || this.getPath('itemView.content'));
				if(this.postAction){
					this.postAction();
				}
            }
        }
        return NO;
    },

    touchStart: function(touch) {
        this._super(touch);
		return NO;//no bubble
    },

    touchEnd: function(touch) {
        this._super(touch);
		return NO;//no bubble
    }	
});
