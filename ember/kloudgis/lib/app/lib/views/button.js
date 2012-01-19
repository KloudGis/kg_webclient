/**
* Extend the SC.Button to add more attributes and send Statechart action
**/
var get = SC.get;
KG.Button = SC.Button.extend({

    attributeBindings: ['type', 'disabled', 'title'],

    triggerAction: function() {
        this._super();
        var action = get(this, 'sc_action');
        if (action && KG.statechart) {
            KG.statechart.sendAction(action, this.get('content') || this.getPath('itemView.content'));
            if (this.postAction) {
                this.postAction();
            }
        }
    },

	//manual mouseDown Event Handling
	manualMouseDown: NO,

	_mouseDownListener: null,
	_element: null,

    didInsertElement: function() {
        if (this.get('manualMouseDown')) {
            this._element = this.get('element');
            var self = this;
			this._mouseDownListener = function(e) {
                return self.mouseDown(e);
            };
			this._clickListener = function(e) {
                return self.click(e);
            };
            this._element.addEventListener('mousedown', this._mouseDownListener, false);
			this._element.addEventListener('click', this._clickListener, false);
        }
    },

	destroy:function(){
		if (get(this, 'isDestroyed')) { return; }
		if (this.get('manualMouseDown') && this._element) {
			this._element.removeEventListener('mousedown', this._mouseDownListener, false);
			this._element.removeEventListener('click', this._clickListener, false);
			this._element = null;
		}  
		this._super();
	}
});
