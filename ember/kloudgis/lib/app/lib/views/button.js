/**
* Extend the SC.Button to add more attributes and send Statechart action
**/
var get = SC.get;
KG.Button = SC.Button.extend({

    attributeBindings: ['type', 'disabled', 'title'],

    label_loc: function() {
        return this.get('label').loc();
    }.property('label'),

    //patch --> button not working in leaflet popup???
    mouseUp: function(e) {
        this.set('isActive', true);
        this._super(e);
    },

    triggerAction: function() {
        this._super();
        var action = get(this, 'sc_action');
        console.log('trigger action: ' + action);
        if (action && KG.statechart) {
            KG.statechart.sendAction(action, this.get('content') || this.getPath('itemView.content'));
            if (this.postAction) {
                this.postAction();
            }
        }
    },

    touchStart: function(touch) {
        return YES; //bubble to allow default (mouseEvent)
    },

    touchEnd: function(touch) {
        return YES; //bubble
    }
});
