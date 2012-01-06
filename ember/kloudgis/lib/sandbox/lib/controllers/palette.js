/**
* List of featuretype available in the palette
**/
KG.paletteController = Ember.ArrayController.create({
	//featuretypes
	content: [],
	active: NO,
	
	isDirty: NO,
	
	/* label and image for the create note control*/
    createLabel: "_showPalette".loc()
});