// ==========================================================================
// Project:   KG.activefeatureController
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Dbclient */

/** @class

  (Document Your Controller Here)

  @extends SC.ObjectController
*/
KG.activefeatureController = SC.ObjectController.create(
/** @scope Dbclient.activefeatureController.prototype */ {

  	contentBinding: 'KG.featuresController.selection',
	contentBindingDefault: SC.Binding.single(),

}) ;
