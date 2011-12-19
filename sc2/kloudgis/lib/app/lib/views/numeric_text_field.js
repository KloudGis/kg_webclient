/**
* Extend the SC.TextArea to add more attributes and localize the placeholder
**/
KG.NumericTextField = KG.TextField.extend({

    attributeBindings: ['type', 'placeholder', 'value', 'autofocus', 'min', 'max', 'step']
});