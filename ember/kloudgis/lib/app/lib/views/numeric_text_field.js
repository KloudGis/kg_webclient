/**
* Extend the Ember.TextField to add more attributes and localize the placeholder
**/
KG.NumericTextField = Ember.TextField.extend({

    attributeBindings: ['type', 'placeholder', 'value', 'autofocus', 'min', 'max', 'step']
});