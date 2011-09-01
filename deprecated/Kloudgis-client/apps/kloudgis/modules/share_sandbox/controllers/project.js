// ==========================================================================
// Project:   KG.projectController
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals KG */

/** @class

  The active project.

  @extends SC.ObjectController
*/
KG.projectController = SC.ObjectController.create({

    //use this setter instead of set('content') to able CoreKG to have the active sandbox before its actually set.
	//necesssary for sandbox queries
    setProject: function(content) {
        if (SC.none(content)) {
            CoreKG.set('active_sandbox', null);
        } else {
            CoreKG.set('active_sandbox', content.get('id'));
        }
        this.set('content', content);
    },

    //double check - when the content changed
    contentObserver: function() {
        if (SC.none(this.get('content'))) {
            CoreKG.setIfChanged('active_sandbox', null);
        } else {
            CoreKG.setIfChanged('active_sandbox', this.get('content').get('id'));
        }
    }.observes('content')
});
