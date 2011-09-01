// ==========================================================================
// Project:   KG.activefeaturetypeController
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Dbclient */

/** @class

  (Document Your Controller Here)

  @extends SC.ObjectController
*/
KG.activefeaturetypeController = SC.ObjectController.create(
/** @scope KG.activefeaturetypeController.prototype */ {

  	contentBinding: 'KG.featuretypesController.selection',
	contentBindingDefault: SC.Binding.single(),

}) ;
