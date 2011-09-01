KG.core_dbclient = SC.Object.create({

    initModule: function() {
        KG.dbclient.initStatechart();
    },

	didLogout: function(){
		this.cleanUp();
	},

	cleanUp: function(){
		//clean controllers and unload records
		KG.cleanUpShareSandbox();
	},
	
	setProject: function(proj){
		KG.projectController.setProject(proj);
	},
	
    gotoInitialState: function(proj) {
		this.setProject(proj);
        KG.dbclient.gotoState('featureTypeUnselected');
    }

});
