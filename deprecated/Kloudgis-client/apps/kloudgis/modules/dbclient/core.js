SC.mixin(KG, {
    
	appModuleDidLoad: function(moduleName, project){
		KG.core_dbclient.setProject(project);
		KG.core_dbclient.initModule();		
	}
});