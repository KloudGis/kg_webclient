/**
* Extend the SC.Button to add more attributes and send Statechart action
**/
var get = SC.get;
KG.Button = SC.Button.extend({

    attributeBindings: ['type', 'disabled', 'title'],

	manualMouseDown: NO,

    label_loc: function() {
        return this.get('label').loc();
    }.property('label'),

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
    },

	//manual mouseDown Event Handling

	_mouseDownListener: null,
	_element: null,

    didInsertElement: function() {
        if (this.get('manualMouseDown')) {
            this._element = this.get('element');
            var self = this;
			this._mouseDownListener = function(e) {
                self.mouseDown(e);
				if (e.stopPropagation) {
					e.stopPropagation();
				} else {
					e.cancelBubble = true;
				}
            };
            this._element.addEventListener('mousedown', this._mouseDownListener, false);
        }
    },

	destroy:function(){
		if (get(this, 'isDestroyed')) { return; }
		if (this.get('manualMouseDown') && this._element) {
			this._element.removeEventListener('mousedown', this._mouseDownListener, false);
			this._element = null;
		}  
		this._super();
	}
});
