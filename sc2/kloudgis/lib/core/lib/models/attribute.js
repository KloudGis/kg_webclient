/*
	Wrapper on a feature with a specific attrtype.
*/
KG.Attribute = SC.Object.extend({

    feature: null,
    attrtype: null,

    label: function() {
        return this.getPath('attrtype.label');
    }.property().cacheable(),

    templateName: function() {
        var type = this.getPath('attrtype.type');
        return type + '-renderer';
    }.property(),

    value: function(key, value) {
        var ref = this.getPath('attrtype.attr_ref');
        var feature = this.get('feature');
        if (value !== undefined) {
            feature.set(ref, value);
        }
        return feature.get(ref);
    }.property(),

    imgBase64Value: function() {

        var val = this.get('value');
        if (SC.none(val)) {
            return '';
        } else {
            var startURL = "data:image/png;base64,";
            return startURL + val;
        }
    }.property('value'),

    css_class: function() {
        return this.getPath('attrtype.css_class') || 'one-column';
    }.property(),

    min: function() {
        return this.getPath('attrtype.min') || 0;
    }.property(),

    max: function() {
        return this.getPath('attrtype.max') || 1;
    }.property(),

    step: function() {
        return this.getPath('attrtype.step') || 1;
    }.property(),

    enumValues: function() {
        return this.getPath('attrtype.enum_values');
    }.property()

});
