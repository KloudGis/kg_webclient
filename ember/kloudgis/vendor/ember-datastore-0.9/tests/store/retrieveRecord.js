// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals module ok equals same test MyApp */

var set = Ember.set, get = Ember.get;


var store, storeKey1, storeKey2, storeKey3, storeKey4, storeKey5, storeKey6;
var storeKey7, storeKey8, json, json1, json2, json3, json4, json5, json6 ;
var json7, json8;

module("Ember.Store#retrieveRecord", {
  setup: function() {
    
    store = Ember.Store.create();
    
    json1 = {
      guid: "retrieveGUID1",
      string: "string",
      number: 23,
      bool:   YES
    };
    json2 = {
      guid: "retrieveGUID2",
      string: "string",
      number: 23,
      bool:   YES
    };
    json3 = {
      guid: "retrieveGUID3",
      string: "string",
      number: 23,
      bool:   YES
    };
    json4 = {
      guid: "retrieveGUID4",
      string: "string",
      number: 23,
      bool:   YES
    };
    json5 = {
      guid: "retrieveGUID5",
      string: "string",
      number: 23,
      bool:   YES
    };
    json6 = {
      guid: "retrieveGUID6",
      string: "string",
      number: 23,
      bool:   YES
    };
    json7 = {
      guid: "retrieveGUID7",
      string: "string",
      number: 23,
      bool:   YES
    };
    json8 = {
      guid: "retrieveGUID8",
      string: "string",
      number: 23,
      bool:   YES
    };
    
    storeKey1 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey1, json1, Ember.Record.EMPTY);
    storeKey2 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey2, json2, Ember.Record.ERROR);
    storeKey3 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey3, json3, Ember.Record.DESTROYED_CLEAN);
    storeKey4 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey4, json4, Ember.Record.BUSY_DESTROYING);
    storeKey5 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey5, json5, Ember.Record.BUSY_CREATING);
    storeKey6 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey6, json6, Ember.Record.BUSY_COMMITTING);
    storeKey7 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey7, json7, Ember.Record.DESTROYED_DIRTY);
    storeKey8 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey8, json8, Ember.Record.READY_CLEAN);
    }
});
  
function testStates(canLoad) {
  var msg, status;
  
  Ember.run.begin();
  
  store.retrieveRecord(undefined, undefined, storeKey1, YES);
  status = store.readStatus( storeKey1);
  if (canLoad) {
    equals(status, Ember.Record.BUSY_LOADING, "the status should have changed to BUSY_LOADING");
  } else {
    equals(status, Ember.Record.ERROR, "the status should remain empty");
  }
  
  
  store.retrieveRecord(undefined, undefined, storeKey2, YES);
  status = store.readStatus( storeKey2);
  if (canLoad) {
    equals(status, Ember.Record.BUSY_LOADING, "the status should have changed to BUSY_LOADING");
  } else {
    equals(status, Ember.Record.ERROR, "the status should become empty");
  }
  
  store.retrieveRecord(undefined, undefined, storeKey3, YES);
  status = store.readStatus( storeKey3);
  if (canLoad) {
    equals(status, Ember.Record.BUSY_LOADING, "the status should have changed to BUSY_LOADING");
  } else {
    equals(status, Ember.Record.ERROR, "the status should become empty");
  }
  
  try{
    store.retrieveRecord(undefined, undefined, storeKey4, YES);
    msg='';
  }catch(error1){
    msg=error1.message;
  }
  equals(msg, Ember.Record.BUSY_ERROR.message, "should throw error");

  try{
    store.retrieveRecord(undefined, undefined, storeKey5, YES);
    msg='';
  }catch(error2){
    msg=error2.message;
  }
  equals(msg, Ember.Record.BUSY_ERROR.message, "should throw error");
  
  try{
    store.retrieveRecord(undefined, undefined, storeKey6, YES);
    msg='';
  }catch(error3){
    msg=error3.message;
  }
  equals(msg, Ember.Record.BUSY_ERROR.message, "should throw error");

  try{
    store.retrieveRecord(undefined, undefined, storeKey7, YES);
    msg='';
  }catch(error4){
    msg=error4.message;
  }
  equals(msg, Ember.Record.BAD_STATE_ERROR.message, "should throw error");


  store.retrieveRecord(undefined, undefined, storeKey8, YES);
  status = store.readStatus( storeKey8);
  if (canLoad) {
    ok(Ember.Record.BUSY_REFRESH | (status & 0x03), "the status changed to BUSY_REFRESH.");
  } else {
    equals(status, Ember.Record.READY_CLEAN, "the status should remain ready clean");
  }
  
  Ember.run.end();
}  

test("Retrieve a record without a data source", function() {
  testStates(NO);
});

test("Retrieve a record without a working data source and check for different errors and states", function() {
  // build a fake data source that claims to NOT handle retrieval
  var source = Ember.DataSource.create({
    retrieveRecords: function() { return NO ; }
  });
  set(store, 'dataSource', source);

  testStates(NO);

});

test("Retrieve a record with working data source and check for different errors and states", function() {
  // build a fake data source that claims to handle retrieval
  var source = Ember.DataSource.create({
    retrieveRecords: function() { return YES ; }
  });
  set(store, 'dataSource', source);

  testStates(YES);

});

test("Retrieve a record with callback", function() {
  // build a fake data source that claims to handle retrieval
  var source = Ember.DataSource.create({
    retrieveRecords: function() { return YES ; }
  });
  set(store, 'dataSource', source);
  var callback = NO;
  store.retrieveRecord(undefined, undefined, storeKey1, YES, function(){callback = YES;});
  
  ok(store._callback_queue[storeKey1], "The callback exists in the queue");
  
  store.dataSourceDidComplete(storeKey1);
  
  ok(callback, "Callback did fire");
});