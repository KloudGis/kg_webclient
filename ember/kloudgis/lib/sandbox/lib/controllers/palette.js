/**
* List of featuretype available in the palette
**/
KG.paletteController = Ember.ArrayController.create({
	//featuretypes
	content: [],
	active: NO,
	
	/* label and image for the create note control*/
    createLabel: "_showPalette".loc()
});