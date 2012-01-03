/**
* Extend the SC.TextArea to add more attributes and localize the placeholder
**/
KG.TextField = SC.TextField.extend({

    //add more attributes (from autofocus)
    attributeBindings: ['type', 'placeholder', 'value', 'autofocus', 'spellcheck', 'autocorrect', 'autocapitalize', "autocomplete", 'disabled', "size", "results"],

    nl_sc_action: null,
    placeholder_not_loc: null,

    placeholder: function() {
        if (SC.none(this.get('placeholder_not_loc'))) {
            return null;
        }
        return this.get("placeholder_not_loc").loc();
    }.property('placeholder_not_loc'),

    insertNewline: function() {
        if (!SC.none(this.get('nl_sc_action'))) {
            KG.statechart.sendAction(this.get('nl_sc_action'), this);
        }
    },

    didInsertElement: function() {
        //To remove once Firefox support HTML5 autofocus attribute
        if (!SC.none(this.get('autofocus')) && $.browser.mozilla) {
            var self = this;
            setTimeout(function() {
                console.log('fallback focus');
                self.$().focus();
            },
            1);
        }
    }
});
