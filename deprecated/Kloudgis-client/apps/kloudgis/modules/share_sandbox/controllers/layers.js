// ==========================================================================
// Project:   KG.layersController
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals KG */

/** @class

  List of layers for the active project

  @extends SC.ArrayController
*/
KG.layersController = SC.ArrayController.create({
		
		allowsMultipleSelection: NO,
		
		contentBinding: 'KG.projectController*content.layers'
});