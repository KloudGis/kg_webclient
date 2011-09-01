// ==========================================================================
// Project:   Auth
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Auth */

/** @namespace

  My cool new app.  Describe your application.
  
  @extends SC.Object
*/
Auth = SC.Application.create(
  /** @scope Auth.prototype */ {

  NAMESPACE: 'Auth',
  VERSION: '0.1.0',

  // This is your application store.  You will use this store to access all
  // of your model data.  You can also set a data source on this store to
  // connect to a backend server.  The default setup below connects the store
  // to any fixtures you define.
  //store: SC.Store.create().from(SC.Record.fixtures),

store: SC.Store.create({ 
  commitRecordsAutomatically: NO
}).from('Auth.Store'),
  
  // TODO: Add global constants or singleton objects needed by your app here.
	testAuth: function(){
		var auth = 'Basic ZGVtbzpkZW1v';
		SC.Request.getUrl('/geoshield/wms/demo?service=wms&version=1.1.1&request=GetCapabilities').header('Authorization', auth).notify(this, this.didTest).send();
		SC.Request.getUrl('/geoshield/wms/demo?service=wms&version=1.1.1&request=GetCapabilities').notify(this, this.didTest).send();
	},
	
	didTest: function(response){
		console.log('test res');
		console.log(response);
	},
	
	testArray: function(){
		Auth.testController.length();
		Auth.testController.notifyPropertyChange('length');
		var len = Auth.testController.get('length');
		var arr = Auth.testController.toArray();
		console.log(arr);
	}
	
});

