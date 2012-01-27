// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals module ok equals same test MyApp */

var set = Ember.set, get = Ember.get;

// NOTE: The test below are based on the Data Hashes state chart.  This models
// the "read" event in the Store portion of the diagram.

var store, storeKey, json;
module("Ember.Store#readDataHash", {
  setup: function() {
    store = Ember.Store.create();
    
    json = {
      string: "string",
      number: 23,
      bool:   YES
    };
    
    storeKey = Ember.Store.generateStoreKey();

    store.writeDataHash(storeKey, json, Ember.Record.READY_CLEAN);
    store.editables = null; // manually patch to setup test state
  }
});

test("data state=LOCKED", function() {
  
  // preconditions
  equals(store.storeKeyEditState(storeKey), Ember.Store.LOCKED, 'precond - data state should be LOCKED');
  var oldrev = store.revisions[storeKey];
  
  // perform read
  var ret = store.readDataHash(storeKey);
  
  // verify
  equals(ret, json, 'should read same data hash once locked');
  equals(store.storeKeyEditState(storeKey), Ember.Store.LOCKED, 'should remain in locked state');

  // test revisions
  equals(store.revisions[storeKey], oldrev, 'should not change revision');
  if (!Ember.none(oldrev)) {
    ok(store.revisions.hasOwnProperty(storeKey), 'should copy reference to revision');
  }
});

test("data state=EDITABLE", function() {
  
  // preconditions
  var ret1 = store.readEditableDataHash(storeKey);
  equals(store.storeKeyEditState(storeKey), Ember.Store.EDITABLE, 'precond - data state should be EDITABLE');
  var oldrev = store.revisions[storeKey];
  
  // perform read
  var ret2 = store.readDataHash(storeKey);
  
  // verify
  equals(ret1, ret2, 'should read same data hash once editable');
  equals(store.storeKeyEditState(storeKey), Ember.Store.EDITABLE, 'should remain in editable state');

  // test revisions
  equals(store.revisions[storeKey], oldrev, 'should not change revision');
  if (!Ember.none(oldrev)) {
    ok(store.revisions.hasOwnProperty(storeKey), 'should copy reference to revision');
  }
});

test("should return null when accessing an unknown storeKey", function() {
  equals(store.readDataHash(20000000), null, 'shuld return null for non-existant store key');
  equals(store.storeKeyEditState(storeKey), Ember.Store.LOCKED, 'should put into locked edit state');
});

