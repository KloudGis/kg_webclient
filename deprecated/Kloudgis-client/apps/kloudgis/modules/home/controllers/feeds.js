// ==========================================================================
// Project:   KG.feedsController
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals KG */

/** @class

  List of feeds for the logged user.

  @extends SC.ArrayController
*/
KG.feedsController = SC.ArrayController.create({		
		allowsMultipleSelection: NO,
		
		
		selectionDidChange: function(){
			console.log('selection changed');
			if(this.get('selection').get('length') > 0){
				KG.projectsController.selectObject(this.get('selection').get('firstObject').get('sandbox'), NO);
			}
		}.observes('selection')
});