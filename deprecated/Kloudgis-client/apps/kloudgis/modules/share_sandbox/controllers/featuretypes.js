// ==========================================================================
// Project:   KG.featuretypesController
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals KG */

/** @class

  List of featuretypes for the active project

  @extends SC.ArrayController
*/
KG.featuretypesController = SC.ArrayController.create({
		
		allowsMultipleSelection: NO,
		
		contentBinding: 'KG.projectController*content.featuretypes'
});