/**
* Extend the SC.Button to add more attributes and send Statechart action
**/
var get = SC.get;
KG.Button = SC.Button.extend({

    attributeBindings: ['type', 'disabled', 'title'],

    label_loc: function() {
        return this.get('label').loc();
    }.property('label'),

	mouseLeave: function() {
		this.cleanDown();
		return this._super();
	},

    triggerAction: function() {
		console.log('trigger ac: ' + this.get('isActive'));
        this._super();
        var action = get(this, 'sc_action')
        if (action && KG.statechart) {
            KG.statechart.sendAction(action, this.get('content') || this.getPath('itemView.content'));
            if (this.postAction) {
                this.postAction();
            }
        }
		console.log('trigger ac2: ' + this.get('isActive'));
    },

    keyUp: function(e) {
        if (e.keyCode == 13) {
            if (get(this, 'isActive')) {

                // Actually invoke the button's target and action.
                // This method comes from the Ember.TargetActionSupport mixin.
                this.triggerAction();
                set(this, 'isActive', false);
            }
        }
        return get(this, 'propagateEvents');
    },

    touchStart: function(touch) {
        return YES; //bubble to allow default (mouseEvent)
    },

    touchEnd: function(touch) {
        return YES; //bubble
    },

	cleanDown:function(){
		this._mouseDown = false;
		this.set('isActive', false);
	}
});
