// ==========================================================================
// Project:   KG.activeSelectionController
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals KG */

/** @class

  The active selection feature.

  @extends SC.ObjectController
*/
KG.activeSelectionController = SC.ObjectController.create({

    contentBinding: 'KG.selectionController.selection',
	contentBindingDefault: SC.Binding.single()
	
});