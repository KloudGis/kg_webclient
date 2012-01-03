/**
* textfield to forward the event to the parent view
**/
KG.ForwardTextField = SC.TextField.extend({
  
  attributeBindings: ['type', 'placeholder', 'value', 'autocapitalize', 'autocorrect'],

  focusOut: function(event) {
	this._super(event);
    return true;
  },

  change: function(event) {
	this._super(event);
    return true;
  },

  keyUp: function(event) {
    this._super(event);
    return true;
  },
});