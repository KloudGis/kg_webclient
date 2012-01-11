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
        return this.getPath('attrtype.max') || 2000000000;
    }.property(),

    step: function() {
        return this.getPath('attrtype.step') || 1;
    }.property(),

    enumValues: function() {
        var possibleVals = this.getPath('attrtype.enum_values');
        var enumVals = [];
        var value = this.get('value');
        var i, len = possibleVals.length;
        var found = NO;
        for (i = 0; i < len; i++) {
            if (possibleVals[i].key === value) {
                found = YES;
            }
            enumVals.push(possibleVals[i]);
        }
        if (!found) {
            enumVals.insertAt(0, {
                key: value,
                label: '?'
            });
        }
        return enumVals;
    }.property('attr_type').cacheable(),

    enumValuesCustom: function() {
        var possibleVals = this.getPath('attrtype.enum_values');
        var enumVals = [];
        var i, len = possibleVals.length;
        enumVals.push({
            key: KG.otherKey,
            label: "_otherValue".loc()
        });
        for (i = 0; i < len; i++) {
            enumVals.push(possibleVals[i]);
        }
        return enumVals;
    }.property('attr_type').cacheable()

});
