/*
	Wrapper on a feature with a specific attrtype.
*/
KG.Attribute = SC.Object.extend({

    feature: null,
    attrtype: null,

    label: function() {
        return this.getPath('attrtype.label');
    }.property().cacheable(),

    renderer: function() {
        var type = this.getPath('attrtype.type');
        if (type === 'text') {
            return 'text-renderer';
        } else if (type === 'num') {
            return 'num-renderer';
        } else if (type === 'num-range') {
            return 'num-range-renderer';
        }
        return 'read-only-renderer';
    }.property(),

    value: function(key, value) {
        var ref = this.getPath('attrtype.attr_ref');
        var feature = this.get('feature');
        if (value) {
            feature.set(ref, value);
        }
        return feature.get(ref);
    }.property(),

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
    }.property()

});
