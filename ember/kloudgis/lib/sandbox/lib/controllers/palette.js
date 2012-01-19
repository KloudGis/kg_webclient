/**
* List of featuretype available in the palette
**/
KG.paletteController = Ember.ArrayController.create({
    //featuretypes
    content: null,
    active: NO,

    isDirty: NO,

    /* label and image for the create note control*/
    createLabel: "_showPalette".loc(),

    isAvailable: function() {
        return KG.core_sandbox.get('hasWriteAccess');
    }.property('KG.core_sandbox.hasWriteAccess')
});
