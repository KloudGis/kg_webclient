// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals module ok equals same test MyApp */

var set = Ember.set, get = Ember.get;

var store, storeKey, json;
module("Ember.Store#recordDidChange", {
  setup: function() {
    Ember.run.begin();

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
    

    storeKey1 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey1, json1, Ember.Record.BUSY_LOADING);
    storeKey2 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey2, json2, Ember.Record.EMPTY);
    storeKey3 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey3, json3, Ember.Record.READY_NEW);
    storeKey4 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey4, json4, Ember.Record.READY_CLEAN);

    Ember.run.end();
  }
});

test("recordDidChange", function() {
  var status;
  try{
    store.recordDidChange(undefined, undefined, storeKey1);
  }catch(error1){
    equals(Ember.Record.BUSY_ERROR.message, error1.message, "the status shouldn't have changed.");
  }
  
  try{
    store.recordDidChange(undefined, undefined, storeKey2);
  }catch(error2){
    equals(Ember.Record.NOT_FOUND_ERROR.message, error2.message, "the status shouldn't have changed.");
  }
  
  store.recordDidChange(undefined, undefined, storeKey3);
   status = store.readStatus( storeKey3);
   equals(status, Ember.Record.READY_NEW, "the status shouldn't have changed.");

   store.recordDidChange(undefined, undefined, storeKey4);
   status = store.readStatus( storeKey4);
   equals(status, Ember.Record.READY_DIRTY, "the status shouldn't have changed.");
  
});
