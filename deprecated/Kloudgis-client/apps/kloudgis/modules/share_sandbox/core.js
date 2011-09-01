SC.mixin(KG, {
    
	cleanUpShareSandbox: function(){
		if(!SC.none(KG.layersController.content)){
			KG.layersController.content.destroy();
		}
		if(!SC.none(KG.mapController.content)){
			KG.mapController.content.destroy();
		}
		if(!SC.none(KG.featuretypesController.content)){
			KG.featuretypesController.content.destroy();
		}
		if(!SC.none(KG.projectController.content)){
			KG.projectController.set('content', null);
		}	
		//remove layer records
		var storeK = CoreKG.store.storeKeysFor(CoreKG.Layer);
        CoreKG.store.unloadRecords(CoreKG.Layer, null, storeK);
		//remove featuretype records
		var storeK = CoreKG.store.storeKeysFor(CoreKG.Featuretype);
        CoreKG.store.unloadRecords(CoreKG.Featuretype, null, storeK);
	}
});