// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals module ok equals same test MyApp */

var set = Ember.set, get = Ember.get;

var store, storeKey, json;
module("Ember.Store#dataSourceCallbacks", {
  setup: function() {
    
    store = Ember.Store.create();
    
    json1 = {
      guid: "commitGUID1",
      string: "string",
      number: 23,
      bool:   YES
    };
    json2 = {
      guid: "commitGUID2",
      string: "string",
      number: 23,
      bool:   YES
    };
    json3 = {
      guid: "commitGUID3",
      string: "string",
      number: 23,
      bool:   YES
    };
    json4 = {
      guid: "commitGUID4",
      string: "string",
      number: 23,
      bool:   YES
    };
    json5 = {
      guid: "commitGUID5",
      string: "string",
      number: 23,
      bool:   YES
    };
    json6 = {
      guid: "commitGUID6",
      string: "string",
      number: 23,
      bool:   YES
    };
    json7 = {
      guid: "commitGUID7",
      string: "string",
      number: 23,
      bool:   YES
    };
    json8 = {
      guid: "commitGUID8",
      string: "string",
      number: 23,
      bool:   YES
    };
    json9 = {
      guid: "commitGUID9",
      string: "string",
      number: 23,
      bool:   YES
    };
    json10 = {
      guid: "commitGUID10",
      string: "string",
      number: 23,
      bool:   YES
    };
    json11 = {
      guid: "commitGUID11",
      string: "string",
      number: 23,
      bool:   YES
    };
    json12 = {
      guid: "commitGUID12",
      string: "string",
      number: 23,
      bool:   YES
    };
    json13 = {
      guid: "commitGUID13",
      string: "string",
      number: 23,
      bool:   YES
    };
    json14 = {
      guid: "commitGUID14",
      string: "string",
      number: 23,
      bool:   YES
    };
    json15 = {
      guid: "commitGUID15",
      string: "string",
      number: 23,
      bool:   YES
    };
    json16 = {
      guid: "commitGUID16",
      string: "string",
      number: 23,
      bool:   YES
    };
    storeKey1 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey1, json1, Ember.Record.READY_CLEAN);
    storeKey2 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey2, json2, Ember.Record.BUSY_LOADING);
    storeKey3 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey3, json3, Ember.Record.BUSY_CREATING);
    storeKey4 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey4, json4, Ember.Record.BUSY_COMMITTING);
    storeKey5 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey5, json5, Ember.Record.BUSY_REFRESH_CLEAN);
    storeKey6 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey6, json6, Ember.Record.BUSY_REFRESH_DIRTY);
    storeKey7 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey7, json7, Ember.Record.BUSY_DESTROYING);
    storeKey8 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey8, json8, Ember.Record.BUSY);
  
    storeKey9 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey9, json9, Ember.Record.READY_CLEAN);
    storeKey10 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey10, json10, Ember.Record.BUSY_DESTROYING);
    storeKey11 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey11, json11, Ember.Record.BUSY_CREATING);
  
    storeKey12 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey12, json12, Ember.Record.READY_CLEAN);
    storeKey13 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey13, json13, Ember.Record.BUSY_CREATING);
  
    storeKey14 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey14, json14, Ember.Record.READY_CLEAN);
    storeKey15 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey15, json15, Ember.Record.BUSY_CREATING);

    storeKey16 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey16, json16, Ember.Record.BUSY_LOADING);
  
    Ember.run.begin();
  
  },
  
  teardown: function() {
    Ember.run.end();
  }
});

test("Confirm that dataSourceDidCancel switched the records to the right states", function() {
  var msg='', status;
  try{
    store.dataSourceDidCancel(storeKey1);
    msg='';  
  }catch(error){
    msg=error.message;
  }
  equals(Ember.Record.BAD_STATE_ERROR.message, msg, 
    "should throw the following error ");
  
  store.dataSourceDidCancel(storeKey2);
  status = store.readStatus( storeKey2);
  equals(status, Ember.Record.EMPTY, "the status should have changed to EMPTY");
  
  store.dataSourceDidCancel(storeKey3);
  status = store.readStatus( storeKey3);
  equals(status, Ember.Record.READY_NEW, "the status should have changed to READY_NEW");
  
  store.dataSourceDidCancel(storeKey4);
  status = store.readStatus( storeKey4);
  equals(status, Ember.Record.READY_DIRTY, "the status should have changed to READY_DIRTY");
  
  store.dataSourceDidCancel(storeKey5);
  status = store.readStatus( storeKey5);
  equals(status, Ember.Record.READY_CLEAN, "the status should have changed to READY_CLEAN");
  
  store.dataSourceDidCancel(storeKey6);
  status = store.readStatus( storeKey6);
  equals(status, Ember.Record.READY_DIRTY, "the status should have changed to READY_DIRTY");
  
  store.dataSourceDidCancel(storeKey7);
  status = store.readStatus( storeKey7);
  equals(status, Ember.Record.DESTROYED_DIRTY, "the status should have changed to DESTROYED_DIRTY");
  
  try{
    store.dataSourceDidCancel(storeKey8);  
    msg='';
  }catch(error){
    msg=error.message;
  }
  equals(Ember.Record.BAD_STATE_ERROR.message, msg, 
    "should throw the following error ");
  
});


test("Confirm that dataSourceDidComplete switched the records to the right states", function() {
  var msg='', status;
  try{
    store.dataSourceDidComplete(storeKey9);
    msg='';  
  }catch(error){
    msg=error.message;
  }
  equals(Ember.Record.BAD_STATE_ERROR.message, msg, 
    "should throw the following error ");

  try{
    store.dataSourceDidComplete(storeKey10);  
    msg='';
  }catch(error){
    msg=error.message;
  }
  equals(Ember.Record.BAD_STATE_ERROR.message, msg, 
    "should throw the following error ");
  
  store.dataSourceDidComplete(storeKey11);
  status = store.readStatus( storeKey11);
  equals(status, Ember.Record.READY_CLEAN, "the status should have changed to READY_CLEAN.");
  
});


test("Confirm that dataSourceDidDestroy switched the records to the right states", function() {
  var msg='', status;
  try{
    store.dataSourceDidDestroy(storeKey12);  
    msg='';
  }catch(error){
    msg=error.message;
  }  
  equals(Ember.Record.BAD_STATE_ERROR.message, msg, 
    "should throw the following error ");
  
  store.dataSourceDidDestroy(storeKey13);
  status = store.readStatus( storeKey13);
  equals(status, Ember.Record.DESTROYED_CLEAN, "the status should have changed to DESTROYED_CLEAN.");
  
});


test("Confirm that dataSourceDidError switched the records to the right states", function() {
  var msg='', status;
  try{
    store.dataSourceDidError(storeKey14, Ember.Record.BAD_STATE_ERROR);  
    msg='';
  }catch(error){
    msg = error.message;
  }
  equals(Ember.Record.BAD_STATE_ERROR.message, msg, 
    "should throw the following error ");

  store.dataSourceDidError(storeKey15, Ember.Record.BAD_STATE_ERROR);
  status = store.readStatus( storeKey15);
  equals(status, Ember.Record.ERROR, 
    "the status shouldn't have changed.");
});

test("Confirm that errors passed to dataSourceDidError make it into the recordErrors array", function() {
  var msg = '';

  ok(!store.recordErrors, "recordErrors should be null at this point");

  try {
    store.dataSourceDidError(storeKey16, Ember.Record.GENERIC_ERROR);
  } catch (error) {
    msg = error.message;
  }
 
  equals(store.recordErrors[storeKey16], Ember.Record.GENERIC_ERROR,
    "recordErrors[storeKey] should be the right error object");
});
