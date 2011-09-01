// ==========================================================================
// Project:   KG.projectController
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals KG */

/** @class

  The active project for the app module

  @extends SC.ObjectController
*/
KG.activeProjectController = SC.ObjectController.create({
		contentBinding: SC.Binding.single('KG.projectsController.selection'),
		
		
		contentObserver: function() {
	        if (SC.none(this.get('content'))) {
	            KG.statechart.sendEvent('noProjectSelectedEvent', this);
	        } else {
	            KG.statechart.sendEvent('projectSelectedEvent', this);
	        }
	    }.observes('content')
});