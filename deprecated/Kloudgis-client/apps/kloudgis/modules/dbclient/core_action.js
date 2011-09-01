// ==========================================================================
// Project:   Dbclient
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals DbClient */

SC.mixin( KG, {


	loadFeatures: function(_featuretype){
		if(_featuretype){
			var rec = _featuretype.get('recordType');
			var query = SC.Query.remote(rec, {
				isStreaming: YES,
				handleMethod:'fetchAllQuery'
			});
			var res = KG.store.find(query);
			KG.featuresController.set('content', res);
		}
		
	},
	
	createFeature: function(){
		var ft = KG.activefeaturetypeController.get('content');
		if(ft){
			if(!SC.none(ft.get('createInstance'))){
				var f = ft.createInstance();
				f.addObserver('status',this, 'featureCreated', {ft: ft });
				return YES;
			}
		}
		return NO;
	},
	
	
	featureCreated: function(record, key, nil, params){
		SC.Logger.warn(record.get('status'));
		if(record.get('status')===SC.Record.ERROR){
			//... do something
			record.removeObserver('status', this,'featureCreated', params);
		}else if(record.get('status')===SC.Record.READY_CLEAN){
			this.loadFeatures(params.ft);
			KG.featuresController.selectObject(record);
			record.removeObserver('status', this,'featureCreated', params);
		}
		
	}
});
